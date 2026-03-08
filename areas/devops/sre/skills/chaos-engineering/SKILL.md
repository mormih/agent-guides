---
name: chaos-engineering
type: skill
description: Design and run chaos experiments in Kubernetes — pod failures, network partitions, resource pressure with LitmusChaos and manual chaos.
related-rules:
  - slo-policy.md
  - on-call-standards.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: Chaos Engineering

> **Expertise:** LitmusChaos experiments, manual K8s chaos, network partition testing, graceful degradation validation.

## When to load

When designing chaos experiments, validating failover behavior, verifying SLO headroom, or onboarding a service to chaos testing.

## Chaos Experiment Design Principles

```
1. Define steady state first
   → What does "working" look like? (SLI baseline: error rate < 0.1%, p99 < 200ms)

2. Hypothesize
   → "If 1/3 of pods die, the service will continue serving with p99 < 500ms"

3. Blast radius control
   → Start with staging. Start with 1 pod. Increase gradually.

4. Abort conditions
   → Auto-stop if error rate > 1% or p99 > 1s for > 2 min

5. Document and act
   → Passed = evidence of resilience. Failed = fix + re-test. Never just accept failure.
```

## Manual Chaos (no tooling needed)

```bash
# ── Pod kill (test restart recovery) ──────────────────────────
kubectl delete pod <pod-name> -n production
# Watch: kubectl get pods -n production -l app=my-service -w
# Expected: new pod starts, readiness probe passes, 0 user-visible errors

# ── Kill all pods in deployment (test rolling restart recovery) ──
kubectl rollout restart deployment/my-service -n production
# Watch error rate during rollout

# ── Simulate OOMKill ──────────────────────────────────────────
kubectl exec -it <pod> -n production -- sh -c \
  "dd if=/dev/zero of=/dev/shm/blob bs=1M count=600"
# Expected: pod OOMKilled, restarted, alert fired, no user impact

# ── Resource pressure on node ─────────────────────────────────
kubectl run stress --image=polinux/stress --restart=Never \
  --overrides='{"spec":{"nodeSelector":{"kubernetes.io/hostname":"worker-01"}}}' \
  -- stress --cpu 4 --vm 1 --vm-bytes 2G --timeout 120s

# ── Network partition: isolate a pod (Cilium + network policy) ──
# Apply a policy that drops all traffic from/to the pod
kubectl apply -f - << 'EOF'
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: chaos-isolate, namespace: production }
spec:
  podSelector: { matchLabels: { chaos-target: "true" } }
  policyTypes: [Ingress, Egress]
EOF
kubectl label pod <pod> chaos-target=true -n production
# Observe: circuit breakers trip, retries, fallback behavior
# Cleanup:
kubectl delete networkpolicy chaos-isolate -n production
kubectl label pod <pod> chaos-target- -n production
```

## LitmusChaos Experiments

```yaml
# Install LitmusChaos
kubectl apply -f https://litmuschaos.github.io/litmus/litmus-operator-v3.0.0.yaml

# ── Pod Delete experiment ────────────────────────────────────
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: pod-delete-experiment
  namespace: production
spec:
  appinfo:
    appns: production
    applabel: app=order-service
    appkind: deployment
  engineState: active
  chaosServiceAccount: litmus-admin
  experiments:
    - name: pod-delete
      spec:
        components:
          env:
            - name: TOTAL_CHAOS_DURATION
              value: "60"          # run for 60 seconds
            - name: CHAOS_INTERVAL
              value: "10"          # delete a pod every 10s
            - name: FORCE
              value: "false"       # graceful delete (test SIGTERM handling)
            - name: PODS_AFFECTED_PERC
              value: "33"          # kill 33% of pods at a time
```

```yaml
# ── Pod CPU Hog (test HPA scale-out) ─────────────────────────
apiVersion: litmuschaos.io/v1alpha1
kind: ChaosEngine
metadata:
  name: cpu-hog-experiment
  namespace: production
spec:
  experiments:
    - name: pod-cpu-hog
      spec:
        components:
          env:
            - name: CPU_CORES
              value: "1"
            - name: TOTAL_CHAOS_DURATION
              value: "120"
            - name: TARGET_PODS
              value: "order-service-abc123"
```

## Chaos Game Days (structured runbook)

```
1. Define scope (30 min)
   - Which services? Which failure modes?
   - What is acceptable impact? (staging or prod with traffic shadow)

2. Baseline measurement (10 min)
   - Capture: RPS, error rate, p99, pod count
   - Screenshot Grafana dashboard

3. Run experiments (60–90 min)
   Experiment A: Kill 1 of 3 pods → observe recovery time
   Experiment B: Saturate CPU on 1 pod → observe HPA response
   Experiment C: Partition service from its DB → observe circuit breaker

4. Capture results per experiment
   - Steady state maintained? (SLI threshold)
   - Time to recovery
   - Alerts fired? Correct ones?
   - Runbook adequate?

5. Action items (20 min)
   - For each failure: fix or accept with documentation
   - Schedule follow-up experiments after fixes
```

## Abort / Safety Controls

```yaml
# LitmusChaos: abort on SLO breach using steady-state hypothesis
spec:
  jobCleanUpPolicy: delete
  monitoring: true
  # Prometheus probe: abort if error rate > 1%
  experiments:
    - name: pod-delete
      spec:
        probe:
          - name: check-error-rate
            type: promProbe
            promProbe/inputs:
              endpoint: http://prometheus:9090
              query: |
                sum(rate(http_requests_total{service="order-service",status=~"5.."}[2m]))
                / sum(rate(http_requests_total{service="order-service"}[2m]))
              comparator:
                type: float
                criteria: "<="
                value: "0.01"    # abort if error rate exceeds 1%
            mode: Continuous
            runProperties:
              probeTimeout: 10s
              interval: 15s
```

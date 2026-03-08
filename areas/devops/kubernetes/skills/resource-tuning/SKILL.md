---
name: resource-tuning
type: skill
description: Right-size pod resources, configure HPA/VPA/KEDA, and eliminate resource waste in Kubernetes.
related-rules:
  - resource-governance.md
allowed-tools: Read, Bash
---

# Skill: Resource Tuning

> **Expertise:** CPU/memory right-sizing, HPA, VPA, KEDA event-driven scaling, namespace quota design.

## When to load

When pods are OOMKilled, CPU-throttled, underutilised, or autoscaling isn't working as expected.

## Right-Sizing Methodology

```
1. Observe → 7-day peak metrics (kubectl top / Prometheus)
2. Set request = average × 1.1 (room for normal variance)
3. Set limit = p99 peak × 1.3 (room for spike without OOM)
4. Verify no throttling with: throttled_cpu_seconds metric
5. Adjust after 2 weeks of production data
```

```bash
# Current resource usage (snapshot)
kubectl top pods -n <ns> --sort-by=memory
kubectl top pods -n <ns> --sort-by=cpu

# Historical usage via Prometheus (7-day p99)
# CPU p99:
rate(container_cpu_usage_seconds_total{namespace="<ns>",pod=~"my-app-.*"}[5m])
  > quantile_over_time(0.99, rate(...[5m])[7d:5m])

# Memory p99:
quantile_over_time(0.99,
  container_memory_working_set_bytes{namespace="<ns>",pod=~"my-app-.*"}[7d:5m])
```

## HPA Configuration

```yaml
# CPU + Memory HPA (Kubernetes 1.23+)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-service
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-service
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70    # scale out at 70% avg CPU
    - type: Resource
      resource:
        name: memory
        target:
          type: AverageValue
          averageValue: 400Mi       # scale out if avg pod memory > 400Mi
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300   # wait 5 min before scaling down
      policies:
        - type: Pods
          value: 1
          periodSeconds: 60             # scale down max 1 pod per minute
    scaleUp:
      stabilizationWindowSeconds: 0    # scale up immediately
      policies:
        - type: Percent
          value: 100
          periodSeconds: 15            # can double every 15 seconds
```

## VPA (Vertical Pod Autoscaler)

```yaml
# VPA in "Off" mode — recommendations only, no auto-apply
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-service-vpa
  namespace: production
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-service
  updatePolicy:
    updateMode: "Off"    # "Auto" restarts pods — risky in prod; use "Off" first
  resourcePolicy:
    containerPolicies:
      - containerName: "*"
        minAllowed: { cpu: 50m, memory: 64Mi }
        maxAllowed: { cpu: 2,   memory: 2Gi }

# Check VPA recommendations
kubectl describe vpa my-service-vpa -n production | grep -A20 "Recommendation:"
```

## KEDA (Event-Driven Autoscaling)

```yaml
# Scale based on RabbitMQ queue depth
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: worker-scaledobject
  namespace: production
spec:
  scaleTargetRef:
    name: task-worker
  minReplicaCount: 1
  maxReplicaCount: 30
  cooldownPeriod: 60
  triggers:
    - type: rabbitmq
      metadata:
        host: amqp://rabbitmq.infra.svc.cluster.local:5672
        queueName: task-queue
        queueLength: "20"    # 1 replica per 20 messages in queue
```

## CPU Throttling Detection

```bash
# Check CPU throttling in Prometheus
# > 25% throttling indicates limit is too low
100 * sum(rate(container_cpu_throttled_seconds_total{
  namespace="<ns>", container!=""}[5m]))
/ sum(rate(container_cpu_usage_seconds_total{
  namespace="<ns>", container!=""}[5m]))

# Quick check per pod
kubectl exec -it <pod> -n <ns> -- cat /sys/fs/cgroup/cpu/cpu.stat | grep throttled
```

## ResourceQuota Design by Team Size

| Team size | CPU quota | Memory quota | Pod count |
|:---|:---|:---|:---|
| 1–3 services | 8 cores | 16Gi | 50 |
| 4–10 services | 20 cores | 40Gi | 150 |
| >10 services | per-capacity-plan | per-capacity-plan | 300+ |

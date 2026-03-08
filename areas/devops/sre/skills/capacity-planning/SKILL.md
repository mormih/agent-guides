---
name: capacity-planning
type: skill
description: Forecast infrastructure capacity needs — traffic projection, resource headroom calculations, node pool sizing, K8s cluster capacity.
related-rules:
  - slo-policy.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: Capacity Planning

> **Expertise:** Traffic forecasting, per-pod resource modeling, node pool sizing, cluster capacity headroom, VPA/HPA tuning for growth.

## When to load

When planning for growth, validating current cluster headroom, sizing node pools, or preparing for a high-traffic event (sale, launch).

## Traffic Forecasting

```promql
# Current RPS baseline (7-day average)
avg_over_time(
  sum(rate(http_requests_total{service="checkout-service"}[5m]))[7d:5m]
)

# Peak RPS (7-day p99)
quantile_over_time(0.99,
  sum(rate(http_requests_total{service="checkout-service"}[5m]))[7d:5m]
)

# Week-over-week growth rate
(
  avg_over_time(sum(rate(http_requests_total[5m]))[7d:5m])
  /
  avg_over_time(sum(rate(http_requests_total[5m]))[7d:5m] offset 7d)
) - 1
# e.g. 0.08 = 8% weekly growth → ~3.5× in 6 months
```

## Per-Pod Resource Modeling

```
Model: what resources does 1 pod consume per RPS unit?

Step 1: current pod metrics
  - pods = 4 (HPA current)
  - RPS = 200 req/s (avg)
  - CPU per pod = 320m (avg), 480m (p99)
  - Memory per pod = 280Mi (avg), 380Mi (peak)

Step 2: per-RPS resource cost
  - CPU per RPS = 320m / (200/4) = 6.4m CPU per RPS
  - Mem per RPS = 280Mi / (200/4) = 5.6Mi per RPS

Step 3: future requirements at 2× traffic (400 RPS)
  - CPU needed = 400 × 6.4m = 2560m = 2.56 cores
  - Mem needed = 400 × 5.6Mi = 2240Mi ≈ 2.2Gi
  - Pods needed (at 70% CPU target) = 2560m / (500m × 0.7) = 7.3 → 8 pods min
  - Update HPA maxReplicas to accommodate
```

## Cluster Capacity Check

```bash
# Total cluster allocatable resources
kubectl get nodes -o json | jq '
  [.items[].status.allocatable] |
  {
    cpu: [(.[].cpu | gsub("m";"") | tonumber) / 1000] | add,
    memory_gi: [(.[].memory | gsub("Ki";"") | tonumber) / 1048576] | add
  }'

# Currently requested resources (sum of all pod requests)
kubectl get pods -A -o json | jq '
  [.items[].spec.containers[].resources.requests // {}] |
  {
    cpu_requested: [.[].cpu // "0m" | gsub("m";"") | tonumber] | add / 1000,
    mem_requested_gi: [.[].memory // "0Mi" | gsub("Mi";"") | tonumber] | add / 1024
  }'

# Headroom per node (allocatable - requested)
kubectl describe nodes | grep -A5 "Allocated resources:"

# Quick headroom summary script
kubectl get nodes -o custom-columns=\
"NAME:.metadata.name,\
CPU_ALLOC:.status.allocatable.cpu,\
MEM_ALLOC:.status.allocatable.memory,\
READY:.status.conditions[-1].type"
```

## Node Pool Sizing Formula

```
Variables:
  T = target RPS (peak)
  R_cpu = CPU request per pod (millicores)
  R_mem = memory request per pod (MiB)
  util = target utilisation (e.g. 0.70 = 70%)
  headroom = spare capacity factor (e.g. 1.3 = 30% spare)
  node_cpu = node allocatable CPU (millicores)
  node_mem = node allocatable memory (MiB)

Pods needed:
  pods = ceil((T × cpu_per_rps) / (node_cpu × util)) × headroom

Nodes needed for CPU:
  nodes_cpu = ceil((pods × R_cpu) / (node_cpu × util))

Nodes needed for Memory:
  nodes_mem = ceil((pods × R_mem) / (node_mem × util))

Required nodes = max(nodes_cpu, nodes_mem) + 1 (N+1 for failure tolerance)
```

## Pre-Event Capacity (sale, product launch)

```bash
# 1. Estimate peak multiplier from past events or product team forecast
PEAK_MULTIPLIER=5   # "we expect 5× normal traffic for 2 hours"

# 2. Pre-scale HPA min replicas before event
kubectl patch hpa order-service -n production \
  -p '{"spec":{"minReplicas":10}}'

# 3. Pre-warm node pool (add nodes before autoscaler reacts)
# AWS: adjust ASG desired capacity
aws autoscaling set-desired-capacity \
  --auto-scaling-group-name prod-workers \
  --desired-capacity 12

# 4. Disable HPA scale-down during event window
kubectl patch hpa order-service -n production \
  -p '{"spec":{"behavior":{"scaleDown":{"stabilizationWindowSeconds":3600}}}}'

# 5. Restore after event
kubectl patch hpa order-service -n production \
  -p '{"spec":{"minReplicas":2,"behavior":{"scaleDown":{"stabilizationWindowSeconds":300}}}}'
```

## Capacity Planning Report (monthly)

```markdown
## Capacity Report — November 2024

### Current State
- Cluster: 9 workers (cx41, 4 vCPU / 16Gi each)
- CPU utilisation: 58% avg, 71% peak
- Memory utilisation: 62% avg, 74% peak
- Headroom: ~25% CPU, ~20% Memory

### Growth Trend
- Traffic WoW growth: +6.2% (8 weeks avg)
- Extrapolation: current capacity exhausted in ~14 weeks at current growth

### Recommendations
1. Add 2 nodes before end of Q4 (reduce peak CPU to < 60%)
2. Evaluate spot nodes for worker pool (60-75% cost saving)
3. Review order-service memory limit — VPA recommends 640Mi vs current 512Mi

### Next Review: December 2024
```

# Workflow: `/performance-audit`

**Trigger**: `/performance-audit [--endpoint /api/orders] [--type load|stress|spike|soak]`

## Steps

```
Step 1: CONFIGURE scenario
  load:   Expected peak traffic (e.g., 200 concurrent users)
  stress: Find breaking point (ramp until errors > 5%)
  spike:  Sudden 10× traffic surge
  soak:   Normal load for 2 hours (find memory leaks)

Step 2: ESTABLISH baseline (first run)
  - Run against last stable production version
  - Record p50/p95/p99 latency, throughput, error rate

Step 3: EXECUTE test
  - Run k6 scenario
  - Monitor APM dashboards in parallel

Step 4: COMPARE to baseline and SLOs
  - p99 regression check vs. baseline
  - SLO threshold check

Step 5: IDENTIFY bottlenecks
  - Slow queries
  - Memory pressure (GC pauses, heap growth)
  - CPU saturation
  - External service latency contribution

Step 6: REPORT
  - metric | baseline | current | delta | status
  - Bottleneck analysis with recommendations
```

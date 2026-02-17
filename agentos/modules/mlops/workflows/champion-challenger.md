# Workflow: `/champion-challenger`

**Trigger**: `/champion-challenger [--champion model-v1] [--challenger model-v2] [--duration 14d]`

## Steps

```
Step 1: DESIGN experiment
  - Define primary metric (business outcome)
  - Calculate required sample size (80% power, α=0.05)
  - Define guardrail metrics (latency, error rate)

Step 2: CONFIGURE traffic split
  - Hash user_id for consistent assignment
  - 50% champion, 50% challenger
  - Log assignment to experiment tracker

Step 3: RUN experiment
  - Monitor guardrail metrics daily
  - Alert if guardrail breached → auto-rollback to champion

Step 4: ANALYZE results
  - Compute statistical significance of primary metric
  - Segment analysis: is challenger better for ALL segments?

Step 5: DECIDE
  - p < 0.05 AND practical significance: PROMOTE challenger
  - p >= 0.05 OR harm to any segment: KEEP champion

Step 6: CONCLUDE
  - Route 100% to winner
  - Archive loser model
  - Write experiment report for model registry
```

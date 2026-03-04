# Workflow: `/deploy-endpoint`

**Trigger**: `/deploy-endpoint [--model churn-predictor] [--run-id abc123] [--shadow | --canary | --full]`

## Workflow

```
@team-lead (review model approval) → @developer (deploy endpoint) → 
@qa (validate canary) → @team-lead (promote champion) → Report
```

## Steps

```
Step 1: PRE-FLIGHT
  - Confirm model passed /evaluate-model with PROMOTE recommendation
  - Verify human approval recorded in model registry
  - Check production endpoint health

Step 2: SHADOW deployment (--shadow)
  - Deploy alongside current champion
  - 100% traffic to champion; mirror to challenger (no response from challenger)
  - Run shadow ≥ 48 hours; compare predictions

Step 3: CANARY (--canary or after shadow)
  - Serve challenger to 5% of traffic
  - Monitor 30 minutes:
    → Latency p99 > SLO: AUTO-ROLLBACK
    → Error rate > 1%: AUTO-ROLLBACK
  - Gradually increase: 5% → 20% → 50% → 100%

Step 4: PROMOTE champion
  - Transition: Staging → Production in registry
  - Demote old champion: Production → Archived

Step 5: POST-DEPLOY monitoring
  - Establish new baseline for drift monitoring
  - Confirm monitoring dashboards updated
```

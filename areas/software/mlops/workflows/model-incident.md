# Workflow: `/model-incident`

**Trigger**: `/model-incident [--model churn-predictor] [--type drift|degradation|outage|bias]`

## Workflow

```
@qa (diagnose & scope incident) → @developer (fix root cause) → 
@qa (validate fix) → @team-lead (review postmortem) → Report
```

## Steps

```
Step 1: IMMEDIATE response
  - Assess impact: users affected? incorrect decisions made?
  - Decision: tolerate degraded predictions or rollback NOW?
  - If critical: rollback to previous champion (< 5 min target)

Step 2: DIAGNOSE
  drift:       Compare input distributions to training baseline (PSI)
  degradation: Compare business metrics to post-deployment baseline
  outage:      Check endpoint health, container logs, resource utilization
  bias:        Compute fairness metrics for affected period

Step 3: SCOPE affected predictions
  - Identify time window of degradation
  - Log which predictions made during affected window
  - Notify downstream systems

Step 4: ROOT CAUSE
  - Data drift? (upstream data change)
  - Model rot? (world changed, model stale)
  - Infrastructure? (feature pipeline failure → skew)
  - Code bug? (preprocessing mismatch)

Step 5: REMEDIATE
  - Data drift → schedule retraining
  - Model rot → /train-experiment with recent data
  - Infrastructure → fix pipeline, verify features

Step 6: POST-INCIDENT
  - Add monitoring rule to catch earlier
  - Write postmortem
  - Update model card with known failure modes
```

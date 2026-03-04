# Workflow: `/deploy-production`

**Trigger**: `/deploy-production [--version v2.4.0] [--strategy canary|blue-green]`

**Purpose**: Execute a gated, observable production deployment with automatic rollback on failure.

## Workflow

```
@team-lead (pre-flight checks) → @developer (deploy canary) → 
@qa (validate canary health) → @developer (progressive rollout) → 
@qa (post-deploy validation) → Report
```

## Steps

```
Step 1: PRE-FLIGHT
  - Confirm version tag exists and CI passed
  - Verify staging is healthy with same version
  - Check active incidents: HALT if P0/P1 open

Step 2: ANNOUNCE
  - Post to #deployments: "Deploying v2.4.0 to production"

Step 3: CANARY (10% traffic)
  - Deploy new image to canary pod group
  - Monitor 5 minutes:
    → Error rate delta > 0.5%: AUTO-ROLLBACK
    → p99 latency delta > 500ms: AUTO-ROLLBACK
    → Pod crash loops: AUTO-ROLLBACK

Step 4: PROGRESSIVE rollout (if canary healthy)
  - 25% → wait 2 min → 50% → wait 2 min → 100%
  - Continue monitoring at each step

Step 5: POST-DEPLOY validation
  - Run smoke test suite against production
  - Verify key business metrics not degraded > 10%

Step 6: COMPLETE
  - Post success to #deployments
  - If rollback: create P1 incident, preserve logs
```

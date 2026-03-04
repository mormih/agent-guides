# Workflow: `/ota-update`

**Trigger**: `/ota-update [--bundle js-only] [--target 50%|100%]`

**Purpose**: Deploy a JS-only over-the-air update without App Store review.

## Workflow

```
@developer (build bundle) → @qa (validate eligibility) → 
@developer (deploy staged rollout) → @qa (monitor adoption) → Report
```

## Steps

```
Step 1: VALIDATE OTA eligibility
  - Confirm change is JS-only (no native module changes)
  - Any new native dependencies? → HALT, use /store-submission

Step 2: BUILD bundle
  - Compile JS bundle for production
  - Verify bundle size within budget

Step 3: STAGED rollout
  - Deploy to 5% of users
  - Monitor crash-free rate and JS error rate for 1 hour
  - If stable: expand to 50% → 100%
  - Rollback: expo update:rollback / CodePush rollback

Step 4: MONITOR adoption
  - Track bundle adoption %
  - Expected full adoption: 24-48 hours

Step 5: REPORT
  - OTA update ID and bundle hash
  - Rollback command for emergency use
```

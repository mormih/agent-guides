# Workflow: `/drift-check`

**Trigger**: `/drift-check [--env staging|production] [--fix]`

**Purpose**: Detect and report differences between IaC definitions and actual cloud state.

## Workflow

```
@qa (fetch live state & classify drift) → @team-lead (review critical drifts) → 
@developer (remediate if needed) → Report
```

## Steps

```
Step 1: FETCH live state
  - terraform refresh for target environment

Step 2: COMPUTE diff
  - terraform plan -detailed-exitcode
  - Exit code 2 = drift detected

Step 3: CLASSIFY drift
  - Category A: Tag-only drift → auto-fixable, low risk
  - Category B: Config drift → review required
  - Category C: Missing resource → created manually, investigate
  - Category D: Unexpected destroy → CRITICAL, page on-call

Step 4: REPORT
  - Post summary to Slack #infra-alerts
  - Category D: page on-call immediately

Step 5: REMEDIATE (if --fix)
  - Auto-apply Category A only
  - For B/C/D: create GitHub issue, assign to IaC owner
```

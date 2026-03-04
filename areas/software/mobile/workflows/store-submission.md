# Workflow: `/store-submission`

**Trigger**: `/store-submission [--platform ios|android] [--build-path path/to/artifact]`

## Workflow

```
@developer (prepare build) → @qa (validate quality gates) → 
@team-lead (review compliance) → @developer (submit to store) → 
@qa (monitor post-release) → Report
```

## Steps

```
Step 1: VALIDATE build
  - All quality gates passed
  - Tested on physical devices
  - Crash-free rate in pre-release ≥ 99.5%

Step 2: PREPARE metadata
  - Update release notes (localized if applicable)
  - Update screenshots if UI changed
  - Update app description if features changed

Step 3: COMPLIANCE check
  - Run app-store-prep skill checklist
  - Privacy labels match actual data collection
  - Permission usage descriptions current

Step 4: SUBMIT
  iOS: Upload IPA via Transporter → submit for App Review (24-48h)
  Android: Upload AAB to internal → promote: internal → closed → production (20% rollout)

Step 5: MONITOR
  - Watch for rating spike (negative reviews indicate regression)
  - Monitor crash-free rate first 48 hours
  - Respond to App Review feedback if rejection occurs
```

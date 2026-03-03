# Workflow: `/crash-triage`

**Trigger**: `/crash-triage [--platform ios|android] [--version 2.3.1]`

## Steps

```
Step 1: GATHER data
  - Fetch crash-free rate by version from Firebase/Crashlytics
  - Pull crash logs for target version
  - Identify top 3 crash signatures

Step 2: SYMBOLICATE
  - iOS: Download dSYM from App Store Connect, symbolicate
  - Android: Use ProGuard mapping file to deobfuscate

Step 3: REPRODUCE
  - Identify conditions from breadcrumbs/logs
  - Attempt reproduction in debug build
  - Physical device required?

Step 4: ROOT CAUSE
  - Map crash to source code location
  - Our code vs. third-party library?
  - Recent commit touching this file?

Step 5: FIX
  - Implement fix with regression test
  - Confirm on device before submitting
  - Critical (crash-free < 99%): trigger /ota-update (JS) or /store-submission (native)
```

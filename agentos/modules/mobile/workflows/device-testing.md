# Workflow: `/device-testing`

**Trigger**: `/device-testing [--suite smoke|regression] [--platform ios|android|all]`

**Purpose**: Execute tests on real device farm before release.

## Steps

```
Step 1: SELECT device matrix
  iOS: Latest 2 iOS versions × [iPhone SE, iPhone 15, iPad]
  Android: Latest 2 Android versions × [low-end, mid-range, high-end]

Step 2: UPLOAD build
  - Upload IPA/APK to device farm (AWS Device Farm / BrowserStack)

Step 3: EXECUTE test suite
  - Run Detox test suite on device matrix
  - Capture: video, screenshots, logs, performance metrics per device

Step 4: ANALYZE results
  - Flag device-specific failures (not in emulator)
  - Check: layout issues, performance variations, permission dialogs

Step 5: REPORT
  - Pass/fail matrix by device × test
  - Screenshots of failures with device context
  - Block release if critical tests fail on > 20% of device matrix
```

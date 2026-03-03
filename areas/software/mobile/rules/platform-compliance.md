# Rule: Platform Compliance

**Priority**: P0 — Violations cause App Store / Play Store rejection or delisting.

## iOS (App Store)

1. **Privacy nutrition labels**: All data collected declared in App Store Connect privacy section.
2. **Required capabilities declared**: Every capability (camera, location, microphone) declared in `Info.plist` with usage description.
3. **In-app purchase compliance**: Digital goods must use Apple IAP. No workarounds for App Store builds.
4. **Minimum iOS version**: Support iOS 16+ minimum.

## Android (Play Store)

1. **Permissions at runtime**: Request dangerous permissions at point of use, not at app launch.
2. **Target SDK current**: `targetSdkVersion` within 1 year of latest Android API level.
3. **64-bit requirement**: All native libraries must provide 64-bit versions.
4. **Data safety section**: Play Console data safety form must accurately reflect all data collected.

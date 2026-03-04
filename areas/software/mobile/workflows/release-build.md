# Workflow: `/release-build`

**Trigger**: `/release-build [--platform ios|android|all] [--env staging|production] [--version 2.4.0]`

## Workflow

```
@developer (build release) → @qa (validate on device) → @team-lead (review build) → 
@qa (upload to TestFlight/App Distribution) → Report
```

## Steps

```
Step 1: VALIDATE version
  - Confirm semver format
  - Increment build number (versionCode / CFBundleVersion)
  - Verify git tag doesn't exist

Step 2: ENVIRONMENT check
  - Correct .env file loaded (no dev endpoints)
  - All required env vars populated
  - No debug flags set (DEV=false, FLIPPER=false)

Step 3: BUILD
  iOS:
  - cd ios && pod install
  - xcodebuild archive -scheme MyApp -configuration Release
  - Export IPA with production signing profile

  Android:
  - ./gradlew clean
  - ./gradlew bundleRelease
  - Sign with release keystore (credentials from CI secrets)

Step 4: VALIDATE build
  - Install on physical device
  - Run Detox smoke tests
  - Verify: launch, login, core action, crash-free

Step 5: OUTPUT
  - IPA/AAB artifact path with hash
  - Upload to TestFlight / Firebase App Distribution
```

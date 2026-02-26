# `.agent-os` Domain Package: Mobile Development

> **Version**: 1.0.0
> **Stack**: React Native / TypeScript / Expo / Detox / App Store / Google Play
> **Scope**: iOS and Android application development, offline-first architecture, app store compliance, device-specific concerns
> **Inherits from**: `@agent-os/global`, `@agent-os/security`, `@agent-os/frontend` (component patterns)

---

## Package Structure

```
.agent-os/
└── mobile/
    ├── rules/
    │   ├── platform-compliance.md
    │   ├── offline-first.md
    │   ├── performance-budget.md
    │   └── security-mobile.md
    ├── skills/
    │   ├── navigation-patterns.md
    │   ├── state-sync.md
    │   ├── native-modules.md
    │   ├── push-notifications.md
    │   ├── app-store-prep.md
    │   └── mobile-testing.md
    └── workflows/
        ├── release-build.md
        ├── ota-update.md
        ├── crash-triage.md
        ├── store-submission.md
        └── device-testing.md
```

---

## RULES (Kernel)

---

### `rules/platform-compliance.md`

# Rule: Platform Compliance

**Priority**: P0 — App Store / Play Store violations cause rejection or delisting.

## iOS (App Store Guidelines)

1. **Privacy nutrition labels**: All data collected must be declared in App Store Connect privacy section. Declaration must match actual data collected — periodic audits required.
2. **Required capabilities declared**: Every capability used (camera, location, microphone, contacts, health) must be declared in `Info.plist` with a human-readable usage description. Undeclared capability access crashes on iOS.
3. **Background modes explicit**: Only declare background modes actually used. Declaring unused modes is a rejection reason.
4. **In-app purchase compliance**: Digital goods and services purchasable within the app must use Apple's IAP. No workarounds (linking to external purchase) for App Store builds.
5. **Minimum iOS version**: Support iOS 16+ minimum (track Apple's annual deprecation of oldest supported major version).

## Android (Play Store Policy)

1. **Permissions at runtime**: Request dangerous permissions at the point of use with clear user context, not at app launch. Requesting all permissions at startup is a rejection pattern.
2. **Target SDK current**: `targetSdkVersion` must be within 1 year of the latest Android API level.
3. **64-bit requirement**: All native libraries must provide 64-bit versions.
4. **Data safety section**: Play Console data safety form must accurately reflect all data collected, shared, and whether users can request deletion.

---

### `rules/offline-first.md`

# Rule: Offline-First Architecture

**Priority**: P1 — Mobile apps must be functional without network connectivity.

## Constraints

1. **Optimistic UI required**: User actions (create, update, delete) must update the UI immediately without waiting for network confirmation. Sync happens in background.
2. **Network state awareness**: Every screen that requires network data must gracefully handle offline state with clear UI feedback, not blank screens or cryptic errors.
3. **Sync conflict resolution**: When offline changes conflict with server state (e.g., item deleted remotely while edited locally), a defined conflict resolution strategy must exist and be documented.
4. **Queue persistence**: The outgoing action queue must be persisted to disk (not just memory) so it survives app termination.
5. **Background sync**: Queued actions must be synced when connectivity is restored, including when app is backgrounded (using background fetch / WorkManager).
6. **Stale data disclosure**: Cached data older than the SLA for that data type must be clearly labeled as "Last updated X ago."

---

### `rules/performance-budget.md`

# Rule: Mobile Performance Budget

**Priority**: P1 — Poor mobile performance directly correlates with abandonment and store ratings.

## Budget Thresholds

| Metric | Target | Hard Limit |
|:---|:---|:---|
| Cold start (JS bundle loaded) | < 2s | < 3s |
| Time to interactive | < 1s after bundle | < 2s |
| JS bundle size | < 2 MB | < 4 MB |
| Memory usage (background) | < 50 MB | < 100 MB |
| Frame rate (animations) | 60 fps | 30 fps (never drop below) |
| Battery impact | "Low" in device profiler | Never "High" |

## Constraints

1. **No blocking the JS thread**: Long computations (parsing, encryption, image processing) must be offloaded to native modules or worker threads.
2. **FlatList for all lists**: Never use `ScrollView` to render lists of unknown length. Use `FlatList` or `FlashList` with `windowSize` and `removeClippedSubviews`.
3. **Image optimization**: All images must be resized to display size before loading. Never load a 4K image to display at 200×200. Use `FastImage` for caching.
4. **Hermes engine**: Hermes must be enabled on both platforms. It dramatically reduces startup time and memory usage.

---

### `rules/security-mobile.md`

# Rule: Mobile Security

**Priority**: P0 — Mobile security vulnerabilities expose user data directly on their device.

## Constraints

1. **No sensitive data in AsyncStorage**: AsyncStorage is unencrypted. Use `react-native-keychain` (Keychain on iOS, Keystore on Android) for tokens, passwords, and PII.
2. **Certificate pinning for financial/health apps**: Apps handling financial or health data must implement SSL certificate pinning to prevent MITM attacks.
3. **No sensitive data in logs**: Logging frameworks must have PII scrubbing enabled. Use staging-only logging levels in production builds.
4. **Root/jailbreak detection**: Apps handling sensitive data should detect and warn users about compromised devices (not block usage, but reduce trust signals).
5. **Screenshot prevention on sensitive screens**: Payment screens and authentication screens must set `FLAG_SECURE` (Android) / `allowScreenshots = false` (iOS) to prevent screenshots from appearing in task switcher.
6. **Deep link validation**: All deep link handlers must validate that the incoming URL matches expected scheme and path patterns before processing parameters.

---

## SKILLS (Libraries)

---

### `skills/navigation-patterns.md`

# Skill: Navigation Patterns (React Navigation)

## When to load

When designing app navigation, implementing deep linking, handling auth flows, or debugging navigation state.

## Navigation Architecture

```typescript
// App.tsx — top-level navigation structure
const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer
      linking={linking}  // Deep link configuration
      ref={navigationRef}
    >
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// AppNavigator: tab-based with nested stacks
const AppNavigator = () => (
  <BottomTabs.Navigator screenOptions={{ headerShown: false }}>
    <BottomTabs.Screen name="HomeTab" component={HomeStackNavigator} />
    <BottomTabs.Screen name="ProfileTab" component={ProfileStackNavigator} />
  </BottomTabs.Navigator>
);

// AuthNavigator: handles onboarding flow
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);
```

## Deep Linking Configuration

```typescript
// linking.ts
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      HomeTab: {
        screens: {
          OrderDetail: {
            path: 'orders/:orderId',
            parse: { orderId: String },
            // ✅ Validate: only allow numeric-ish order IDs
            stringify: { orderId: (id) => id.replace(/[^a-zA-Z0-9-]/g, '') },
          },
        },
      },
    },
  },
};
```

---

### `skills/state-sync.md`

# Skill: Offline State Sync

## When to load

When implementing offline-first features, handling optimistic updates, building sync queues, or debugging state conflicts.

## Optimistic Update Pattern (React Query)

```typescript
// hooks/useCreateOrder.ts
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createOrder,

    onMutate: async (newOrder) => {
      // Cancel outgoing refetches to prevent overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['orders'] });

      // Snapshot previous state for rollback
      const previousOrders = queryClient.getQueryData<Order[]>(['orders']);

      // Optimistically add the new order
      const optimisticOrder: Order = {
        ...newOrder,
        id: `temp_${Date.now()}`,  // Temporary ID
        status: 'pending',
        created_at: new Date().toISOString(),
        _isOptimistic: true,       // Flag for UI differentiation
      };

      queryClient.setQueryData<Order[]>(['orders'], (old = []) => [
        optimisticOrder, ...old
      ]);

      return { previousOrders, optimisticOrder };
    },

    onSuccess: (serverOrder, _, context) => {
      // Replace optimistic order with server response
      queryClient.setQueryData<Order[]>(['orders'], (old = []) =>
        old.map(o => o.id === context.optimisticOrder.id ? serverOrder : o)
      );
    },

    onError: (_, __, context) => {
      // Rollback to snapshot
      queryClient.setQueryData(['orders'], context?.previousOrders);
      // Show error toast
      Toast.show({ type: 'error', text1: 'Failed to create order. Will retry when online.' });
      // Enqueue for retry
      offlineQueue.enqueue({ type: 'CREATE_ORDER', payload: _ });
    },
  });
}
```

## Offline Queue with MMKV Persistence

```typescript
// lib/offline-queue.ts
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'offline-queue' });

interface QueuedAction {
  id: string;
  type: string;
  payload: unknown;
  createdAt: string;
  retryCount: number;
}

export const offlineQueue = {
  enqueue(action: Omit<QueuedAction, 'id' | 'createdAt' | 'retryCount'>) {
    const queue = this.getAll();
    const newItem: QueuedAction = {
      ...action,
      id: `action_${Date.now()}`,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };
    storage.set('queue', JSON.stringify([...queue, newItem]));
  },

  getAll(): QueuedAction[] {
    return JSON.parse(storage.getString('queue') ?? '[]');
  },

  async flush() {
    const queue = this.getAll();
    for (const action of queue) {
      try {
        await dispatch(action);
        this.remove(action.id);
      } catch {
        this.incrementRetry(action.id);
      }
    }
  },
};
```

---

### `skills/native-modules.md`

# Skill: Native Module Integration

## When to load

When integrating device APIs (camera, biometrics, NFC), bridging to native SDKs, or debugging platform-specific behavior.

## When to Use Native Modules vs. JS

```
Use Native Module when:
- Accessing device hardware (camera, accelerometer, NFC, Bluetooth)
- Performing cryptographic operations (use device secure enclave)
- Running computation-intensive tasks (image processing, ML on-device)
- Integrating third-party SDKs without JS wrapper (bank SDK, government ID SDK)

Stay in JS/React Native when:
- UI rendering and interactions
- Network requests
- State management
- Business logic that doesn't require device APIs
```

## Biometric Authentication

```typescript
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

export async function authenticateWithBiometrics(): Promise<boolean> {
  const { biometryType } = await rnBiometrics.isSensorAvailable();

  if (!biometryType) {
    // Device doesn't support biometrics — fall back to PIN
    return authenticateWithPin();
  }

  const promptMessage = biometryType === 'FaceID'
    ? 'Confirm with Face ID'
    : 'Confirm with fingerprint';

  const { success } = await rnBiometrics.simplePrompt({ promptMessage });
  return success;
}
```

---

### `skills/app-store-prep.md`

# Skill: App Store Submission Preparation

## When to load

When preparing a release build, submitting to App Store / Play Store, or responding to rejection reasons.

## Pre-Submission Checklist

### Both Platforms
- [ ] Version code/build number incremented
- [ ] Release notes written (plain language, describe user-facing changes)
- [ ] All new permissions declared with usage descriptions
- [ ] Deep links tested end-to-end
- [ ] Crash-free rate > 99.5% in pre-release testing
- [ ] No debug flags enabled in release build

### iOS Specific
- [ ] `Info.plist` usage descriptions for all accessed capabilities
- [ ] Privacy nutrition labels updated in App Store Connect
- [ ] TestFlight beta validated with at least 5 real devices
- [ ] Screenshots updated for new features (required sizes: 6.7" and 5.5")
- [ ] App Review notes added if feature requires test account or special steps

### Android Specific
- [ ] `targetSdkVersion` is current year's API level
- [ ] Data safety form updated in Play Console
- [ ] App Bundle (`.aab`) submitted (not APK)
- [ ] Play Console signing configured (not local keystore)
- [ ] Internal testing → Closed testing → Production promotion flow followed

---

### `skills/mobile-testing.md`

# Skill: Mobile Testing Patterns (Detox)

## When to load

When writing E2E tests for mobile, configuring Detox, or debugging mobile test failures.

## Detox Test Pattern

```typescript
// e2e/login.test.ts
describe('Login flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login with valid credentials', async () => {
    // Use testID for reliable element selection in Detox
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    // Wait for navigation
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);

    await expect(element(by.text('Welcome back'))).toBeVisible();
  });

  it('should show error for wrong password', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('wrongpassword');
    await element(by.id('login-button')).tap();

    await waitFor(element(by.id('error-message')))
      .toBeVisible()
      .withTimeout(3000);
  });
});
```

---

## WORKFLOWS (Applications)

---

### `workflows/release-build.md`

# Workflow: `/release-build`

**Trigger**: `/release-build [--platform ios|android|all] [--env staging|production] [--version 2.4.0]`

**Purpose**: Build a production-grade release artifact for distribution.

## Steps

```
Step 1: VALIDATE version
  - Confirm version follows semver
  - Increment build number (versionCode / CFBundleVersion)
  - Verify git tag doesn't already exist

Step 2: ENVIRONMENT check
  - Confirm correct .env file loaded (no dev endpoints in release)
  - Verify all required env vars populated
  - Check no debug flags set (DEV=false, FLIPPER=false)

Step 3: BUILD

  iOS:
  - Install pods: cd ios && pod install
  - Archive: xcodebuild archive -scheme MyApp -configuration Release
  - Export IPA with production signing profile
  - Verify code signing identity and provisioning profile

  Android:
  - Clean: ./gradlew clean
  - Build bundle: ./gradlew bundleRelease
  - Sign with release keystore (credentials from CI secrets)
  - Verify APK/AAB size against budget

Step 4: VALIDATE build
  - Install on physical device (iOS) / emulator (Android)
  - Run smoke test suite (Detox)
  - Verify: launch, login, core action, crash-free

Step 5: OUTPUT
  - IPA/AAB artifact path
  - Build fingerprint (hash)
  - Upload to App Distribution (Firebase) or TestFlight for internal testing
```

---

### `workflows/ota-update.md`

# Workflow: `/ota-update`

**Trigger**: `/ota-update [--bundle js-only] [--target 50%|100%]`

**Purpose**: Deploy an over-the-air JavaScript bundle update without app store review (Expo EAS Update or CodePush).

## Steps

```
Step 1: VALIDATE OTA eligibility
  - Confirm change is JS-only (no native module changes)
  - Native changes CANNOT be OTA — must go through store submission
  - Check: any new native dependencies added? → HALT, use /store-submission instead

Step 2: BUILD bundle
  - Compile JS bundle for production
  - Verify bundle size within budget
  - Run JS-level tests

Step 3: STAGED rollout
  - Deploy to 5% of users initially
  - Monitor crash-free rate and JS error rate for 1 hour
  - If no degradation: expand to 50% → then 100%
  - Rollback: expo update:rollback or CodePush rollback

Step 4: MONITOR adoption
  - Track bundle adoption percentage (users downloading new bundle)
  - Monitor for JS errors in new bundle version
  - Expected full adoption: 24-48 hours for active user base

Step 5: REPORT
  - OTA update ID and bundle hash
  - Adoption curve URL (EAS/AppCenter)
  - Rollback command for emergency use
```

---

### `workflows/crash-triage.md`

# Workflow: `/crash-triage`

**Trigger**: `/crash-triage [--platform ios|android] [--version 2.3.1]`

**Purpose**: Investigate a production crash report and identify root cause and fix.

## Steps

```
Step 1: GATHER crash data
  - Fetch top 10 crash-free rate by version from Firebase/Crashlytics
  - Pull crash logs for target version
  - Identify: top 3 crash signatures (most frequent)

Step 2: SYMBOLICATE crash logs
  - iOS: Download dSYM from App Store Connect, symbolicate
  - Android: Use ProGuard mapping file to deobfuscate
  - Human-readable stack trace extracted

Step 3: REPRODUCE crash
  - Identify conditions from breadcrumbs/logs
  - Attempt reproduction in debug build
  - Check if crash occurs in simulator or requires physical device

Step 4: IDENTIFY root cause
  - Map crash to source code location
  - Check if crash is in our code vs. third-party library
  - Check git history: did a recent commit touch this file?

Step 5: FIX and VALIDATE
  - Implement fix with regression test
  - Confirm fix on device before submitting
  - If critical (crash-free rate < 99%): trigger /ota-update (JS crashes) or /store-submission (native)

Step 6: POST-INCIDENT
  - Close crash signature in Crashlytics
  - Document in CHANGELOG
  - Add monitoring: alert if crash-free rate drops below 99.5%
```

---

### `workflows/store-submission.md`

# Workflow: `/store-submission`

**Trigger**: `/store-submission [--platform ios|android] [--build-path path/to/artifact]`

**Purpose**: Submit a build to App Store / Google Play with all required metadata.

## Steps

```
Step 1: VALIDATE build artifact
  - Verify build passes all quality gates
  - Confirm build was tested on physical devices
  - Check crash-free rate in pre-release channel ≥ 99.5%

Step 2: PREPARE metadata
  - Update release notes (localized if multiple languages supported)
  - Update screenshots if UI changed (flag outdated screenshots)
  - Update app description if features changed

Step 3: COMPLIANCE check
  - Run /app-store-prep checklist
  - Verify privacy labels match actual data collection
  - Confirm permissions usage descriptions are current

Step 4: SUBMIT

  iOS (App Store Connect):
  - Upload IPA via Transporter or xcodebuild
  - Fill review notes (test account, special features)
  - Submit for App Review (expected: 24-48 hours)

  Android (Play Console):
  - Upload AAB to internal track
  - Promote: internal → closed testing → production (staged rollout)
  - Configure rollout percentage: start at 20%

Step 5: MONITOR post-launch
  - Watch for App Store rating spike (negative reviews indicate regression)
  - Monitor crash-free rate for first 48 hours
  - Respond to App Review feedback if rejection occurs
```

---

## Domain Boundary Notes

### Mobile ↔ Frontend (Client Engineering)
- **Overlap**: React Native shares component patterns, state management, and API integration with React web.
- **Decision**: If the codebase uses React Native only (no native Swift/Kotlin modules), import `@agent-os/frontend` component patterns and apply Mobile rules on top. If native modules are heavy, maintain separate packages.

### Mobile ↔ Backend SDLC
- **Overlap**: API client, auth token management, offline sync protocol design.
- **Decision**: Mobile owns the client-side API integration and token storage. Backend owns the API contract. API contracts are versioned and documented by Backend; Mobile adapts to them.

### Mobile ↔ Security
- **Overlap**: Keychain/Keystore usage, certificate pinning, deep link validation.
- **Decision**: Security provides crypto standards. Mobile `rules/security-mobile.md` extends those standards with platform-specific implementation requirements.

---

## Changelog

| Version | Date | Changes |
|:---|:---|:---|
| 1.0.0 | 2026-02-16 | Initial release. React Native / Expo / Detox stack. iOS & Android. |

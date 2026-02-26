# Rule: Mobile Security

**Priority**: P0 — Mobile security vulnerabilities expose user data directly on device.

1. **No sensitive data in AsyncStorage**: Use `react-native-keychain` (Keychain/Keystore) for tokens, passwords, PII.
2. **Certificate pinning**: Apps handling financial or health data must implement SSL certificate pinning.
3. **No sensitive data in logs**: PII scrubbing enabled in logging. Staging-only log levels in production builds.
4. **Screenshot prevention**: Payment and auth screens must set `FLAG_SECURE` (Android) / `allowScreenshots = false` (iOS).
5. **Deep link validation**: All deep link handlers must validate URL scheme and path patterns before processing parameters.

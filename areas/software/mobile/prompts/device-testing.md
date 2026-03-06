# Prompt: `/device-testing`

Use when: executing a structured test run across a device matrix before a release.

---

## Example 1 — Pre-release device matrix

**EN:**
```
/device-testing

Release: v3.2.0 (release candidate)
Platform: iOS + Android
Test matrix:
  iOS:     iPhone 15 Pro (iOS 17), iPhone 12 (iOS 16), iPad Air (iPadOS 16)
  Android: Pixel 8 (Android 14), Samsung Galaxy S21 (Android 13), OnePlus 9 (Android 12)
Test tool: AWS Device Farm (Detox E2E suite)
Critical flows: login, checkout, notifications, dark mode
Accept criteria: zero crashes, all critical flows pass on all devices
Blocking for release: any P1 crash on a supported device
```

**RU:**
```
/device-testing

Релиз: v3.2.0 (release candidate)
Платформа: iOS + Android
Матрица устройств:
  iOS:     iPhone 15 Pro (iOS 17), iPhone 12 (iOS 16), iPad Air (iPadOS 16)
  Android: Pixel 8 (Android 14), Samsung Galaxy S21 (Android 13), OnePlus 9 (Android 12)
Инструмент: AWS Device Farm (Detox E2E suite)
Критические потоки: вход, оформление заказа, уведомления, тёмная тема
Критерии приёмки: ноль крэшей, все критические потоки проходят на всех устройствах
Блокирует релиз: любой P1 крэш на поддерживаемом устройстве
```

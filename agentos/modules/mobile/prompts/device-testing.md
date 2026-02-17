# Prompt: `/device-testing`

## Полный регресс перед релизом

```
/device-testing --suite regression --platform all

Device matrix:
iOS: iPhone SE 3gen (iOS 16.7), iPhone 15 Pro (iOS 17.3), iPad Air 5gen (iOS 17.3)
Android: Samsung Galaxy A14 (Android 13), Pixel 7 (Android 14), Xiaomi Redmi Note 12 (Android 13)

Критично проверить: checkout, push notifications, offline mode, camera (KYC flow), deep links.
Блокировать релиз если: critical тест упал на > 2 устройствах из 6.
Видео и скриншоты для всех упавших тестов.
```

## Проверка конкретной платформы

```
/device-testing --suite smoke --platform android

Smoke тест только Android после hotfix 3.1.8.
Проверить: payment flow, базовая навигация, offline mode.
Достаточно 3 устройств: low-end (A14), mid-range (Redmi Note 12), flagship (Pixel 7).
```

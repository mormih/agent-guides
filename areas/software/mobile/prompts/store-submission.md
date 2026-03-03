# Prompt: `/store-submission`

## App Store (iOS)

```
/store-submission --platform ios --build-path builds/MyApp-3.2.0.ipa

Релиз 3.2.0. Прогони app-store-prep checklist перед сабмитом.

Release notes (en-US):
"What's New: Faster checkout with one-tap payment. Improved order tracking with real-time updates. Bug fixes and performance improvements."

Тестовый аккаунт для App Review: reviewer@example.com / TestReview123!
Инструкция: Apple Pay работает только на реальном устройстве с добавленной тестовой картой.

При rejection: немедленно уведомить #mobile-team и разобрать причину.
```

## Google Play (Android)

```
/store-submission --platform android --build-path builds/app-release-3.2.0.aab

Staged rollout: старт 20% → через 48 часов 50% → через 48 часов 100%.
Стоп-критерий: ANR rate > 0.47% или crash rate > 1.09% на любом этапе → остановить rollout.
Data safety form: проверь что отражены новые permission (push notifications, разрешили в 3.2.0).
```

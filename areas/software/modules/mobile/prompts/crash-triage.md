# Prompt: `/crash-triage`

## iOS crash после релиза

```
/crash-triage --platform ios --version 3.1.2

Crash-free rate упал с 99.8% до 98.1% после релиза 3.1.2.
Top crash: "EXC_BAD_ACCESS KERN_INVALID_ADDRESS" в CheckoutViewController.

1. Скачай dSYM из App Store Connect, символицируй стек трейс
2. Найди все breadcrumbs из Crashlytics перед крашем
3. Воспроизведи условия: какие действия пользователя предшествуют крашу?
4. Предложи fix с regression тестом
5. Оцени: нужен OTA (если JS-причина) или store submission (если native)?
```

## Android ANR

```
/crash-triage --platform android --version 3.2.0

ANR rate вырос с 0.1% до 0.8% на Android 13 устройствах.
Симптом: UI freeze при открытии списка заказов.
Проверить: main thread blocking, тяжёлые операции без coroutine, синхронные запросы к БД.
```

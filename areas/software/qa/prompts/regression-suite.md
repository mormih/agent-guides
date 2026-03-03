# Prompt: `/regression-suite`

## Перед деплоем (critical)

```
/regression-suite --env staging --scope critical

Запусти critical regression suite перед деплоем v2.4.0.
Scope: auth flows, checkout, payment, account management, email notifications.
Pass rate 100% обязателен — любой failure блокирует деплой.
При failure: уведомить #qa-alerts, создать GitHub issue, приложить видео падения.
Выдать Allure report.
```

## Ночной полный прогон

```
/regression-suite --env staging --scope full

Ночной full regression (~300 тестов). Допустимый fail rate: < 2% (без quarantined flaky).
Запустить в 23:00 UTC, результат в #qa-daily к 08:00 UTC.
Новые failures (не в списке known flaky) → автоматически создать GitHub issues.
```

## Smoke после деплоя в staging

```
/regression-suite --env staging --scope smoke

Post-deploy smoke для staging. Тайм-лимит: 5 минут.
При > 1 critical failure → уведомить #deployments.
```

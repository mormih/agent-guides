# Prompt: `/smoke-test`

## Post-deploy в production

```
/smoke-test --env production --post-deploy

POST-DEPLOY smoke тест после деплоя v2.4.0 в production.
Тайм-лимит: 5 минут максимум.
Обязательные проверки: login, создание заказа, payment тест-картой 4242 4242 4242 4242, logout.
При > 1 critical failure → инициировать rollback + уведомить #deployments + создать P1 инцидент.
```

## Плановый мониторинг staging

```
/smoke-test --env staging

Плановый smoke staging окружения (запускается по cron каждые 30 минут).
При failure: создать GitHub issue, уведомить @platform-team в Slack, не блокировать production.
```

## После восстановления от инцидента

```
/smoke-test --env production --post-deploy

POST-INCIDENT verification после восстановления от P1 инцидента.
Особо проверить: [указать затронутый сервис] работает корректно.
Результат зафиксировать в incident timeline.
```

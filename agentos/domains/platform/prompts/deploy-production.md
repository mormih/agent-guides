# Prompt: `/deploy-production`

## Canary деплой

```
/deploy-production --version v2.4.0 --strategy canary

Деплой v2.4.0 в production. Стратегия: canary.
Rollback триггеры: error rate delta > 0.5% или p99 latency delta > 500ms.
Этапы: 10% → 5 мин → 25% → 2 мин → 50% → 2 мин → 100%.
После 100% — уведомить #deployments со ссылкой на diff.
```

## Hotfix (ускоренный)

```
/deploy-production --version v2.3.8 --strategy canary

HOTFIX: критический баг в payment flow (ENG-4521).
Ускоренный canary: 10% → 2 мин мониторинга → 100%.
Мониторить особо: /api/payments/* error rate и checkout conversion rate.
При любом rollback → автоматически создать P1 инцидент.
```

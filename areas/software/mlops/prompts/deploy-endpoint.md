# Prompt: `/deploy-endpoint`

## Shadow mode (safe start)

```
/deploy-endpoint --model churn-predictor --run-id abc123def456 --shadow

Задеплой в shadow mode на 48 часов.
100% трафика → champion (ответы клиенту от него).
Зеркало запросов → challenger (без ответа клиенту).
Мониторить: prediction distribution, latency p99, error rate.
Через 48 часов — отчёт о divergence между champion и challenger.
Если divergence > 15% — HALT, не переходить к canary без ручного review.
```

## Canary (после shadow)

```
/deploy-endpoint --model churn-predictor --run-id abc123def456 --canary

Shadow завершён: divergence 3%, latency OK. Модель одобрена ML lead.
Canary: 5% → 30 мин → 20% → 30 мин → 50% → 1 час → 100%.
Rollback: PSI > 0.2 на любой фиче или error rate > 1%.
После 100% → обновить drift monitoring baseline под новую модель.
```

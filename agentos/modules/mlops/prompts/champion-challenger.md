# Prompt: `/champion-challenger`

## Стандартный A/B тест

```
/champion-challenger --champion churn-predictor-v2 --challenger churn-predictor-v3 --duration 14d

Primary metric: 30-day retention rate среди пользователей, получивших retention offer на основе предсказания.
Traffic: 50/50, hash by user_id (consistent assignment).
Guardrails: p99 latency < 200ms, prediction error rate < 0.5%.
Рассчитай минимальный sample size (80% power, α=0.05, MDE=2 percentage points).
Промежуточные проверки: на 7-й и 14-й день. Ранняя остановка если guardrail нарушен.
```

## Экспресс-тест (7 дней)

```
/champion-challenger --champion fraud-detector-v4 --challenger fraud-detector-v5 --duration 7d

Срочный тест: нужно решение до конца спринта.
Primary metric: precision at 80% recall (бизнес-требование: не больше X false positives в день).
Traffic: 80% champion / 20% challenger (меньше risk).
При любом росте fraud missed rate → немедленный rollback.
```

# Prompt: `/champion-challenger`

## Standartnyy A/B test

```
/champion-challenger --champion churn-predictor-v2 --challenger churn-predictor-v3 --duration 14d

Primary metric: 30-day retention rate sredi polzovateley, poluchivshikh retention offer na osnove predskazaniya.
Traffic: 50/50, hash by user_id (consistent assignment).
Guardrails: p99 latency < 200ms, prediction error rate < 0.5%.
Rasschitay minimalnyy sample size (80% power, α=0.05, MDE=2 percentage points).
Promezhutochnye proverki: na 7-y i 14-y den. Rannyaya ostanovka esli guardrail narushen.
```

## Ekspress-test (7 dney)

```
/champion-challenger --champion fraud-detector-v4 --challenger fraud-detector-v5 --duration 7d

Srochnyy test: nuzhno reshenie do kontsa sprinta.
Primary metric: precision at 80% recall (biznes-trebovanie: ne bolshe X false positives v den).
Traffic: 80% champion / 20% challenger (menshe risk).
Pri lyubom roste fraud missed rate → nemedlennyy rollback.
```

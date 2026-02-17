# Prompt: `/evaluate-model`

## Полная оценка со сравнением

```
/evaluate-model --run-id abc123def456 --compare-to champion

Primary metric: AUC-ROC.
Business metric: "Revenue retained при топ-20% predicted churners" (assume $50 retention cost, $200 LTV).
Fairness: по plan_type (free/pro/enterprise) и country_region — флагировать если demographic parity diff > 0.1.
Если challenger лучше champion статистически значимо (p < 0.05) → рекомендовать PROMOTE.
Выдать scorecard в .mlops/evaluations/run-abc123-scorecard.json
```

## Упрощённый отчёт для стейкхолдеров

```
/evaluate-model --run-id abc123def456

Оценка для нетехнической аудитории (product/finance).
Переведи метрики в бизнес-язык:
- Сколько churners поймаем в топ-20% скора?
- Сколько "ложных тревог" на 1000 клиентов?
- Оцени ROI retention campaign при конверсии 35%.
Без технических терминов (AUC, F1 — во вторичном блоке).
```

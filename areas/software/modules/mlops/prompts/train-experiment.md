# Prompt: `/train-experiment`

## Новый эксперимент с новыми фичами

```
/train-experiment --model churn-predictor --config config/xgboost_v3.yaml

Изменения vs предыдущий run: добавили 3 фичи — days_since_last_login, device_type, plan_upgrade_count.
Данные: snapshot v2026-02-01, split 70/15/15 (temporal: test = последние 15% по времени).
Random seed: 42. Compute: GPU cluster, таймаут 4 часа.
MLflow experiment: "churn-predictor-feature-expansion".
После обучения — автоматически /evaluate-model и сравнение с champion.
```

## Retraining на новых данных

```
/train-experiment --model fraud-detector --config config/lgbm_prod.yaml

Плановый retrain fraud-detector. Причина: PSI > 0.2 на feature transaction_amount (drift alert).
Данные: last 90 days, snapshot v2026-02-17.
Гиперпараметры: те же что у текущего champion (не менять).
Цель: получить модель на свежих данных без изменения архитектуры.
```

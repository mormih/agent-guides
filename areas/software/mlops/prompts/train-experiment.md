# Prompt: `/train-experiment`

## Novyy eksperiment s novymi fichami

```
/train-experiment --model churn-predictor --config config/xgboost_v3.yaml

Izmeneniya vs predydushchiy run: dobavili 3 fichi — days_since_last_login, device_type, plan_upgrade_count.
Dannye: snapshot v2026-02-01, split 70/15/15 (temporal: test = poslednie 15% po vremeni).
Random seed: 42. Compute: GPU cluster, taymaut 4 chasa.
MLflow experiment: "churn-predictor-feature-expansion".
Posle obucheniya — avtomaticheski /evaluate-model i sravnenie s champion.
```

## Retraining na novykh dannykh

```
/train-experiment --model fraud-detector --config config/lgbm_prod.yaml

Planovyy retrain fraud-detector. Prichina: PSI > 0.2 na feature transaction_amount (drift alert).
Dannye: last 90 days, snapshot v2026-02-17.
Giperparametry: te zhe chto u tekushchego champion (ne menyat).
Tsel: poluchit model na svezhikh dannykh bez izmeneniya arkhitektury.
```

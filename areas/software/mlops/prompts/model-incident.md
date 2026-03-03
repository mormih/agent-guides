# Prompt: `/model-incident`

## Drift

```
/model-incident --model fraud-detector --type drift

ИНЦИДЕНТ: PSI > 0.25 на feature transaction_amount последние 3 часа.
Возможная причина: новый тип транзакций после вчерашнего продуктового релиза.

1. Scope: какие предсказания затронуты (% трафика)?
2. Немедленно: откатить на previous champion или продолжать с мониторингом?
3. Долгосрочно: retrain на новых данных или feature engineering нужен?
Таймаут на решение: 30 минут.
```

## Деградация качества

```
/model-incident --model churn-predictor --type degradation

Бизнес: retention campaign конвертирует 12% vs ожидаемых 35% (последние 2 недели).
Гипотеза: training-serving skew или model rot.
Проверить: изменился ли input feature distribution (PSI)? Изменилось ли поведение пользователей (concept drift)?
Сравни predictions distribution: 4 недели назад vs текущий момент.
```

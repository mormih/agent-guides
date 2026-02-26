# Prompt: `/new-model`

## Staging-модель

```
/new-model stg_payments --layer staging --source raw_payments

Источник: raw_payments (raw schema).
Переименовать: payment_id→id, payment_amount→amount_usd, payment_ts→paid_at.
Типы: amount_usd → NUMERIC(10,2), paid_at → TIMESTAMP WITH TIME ZONE.
Дедупликация по payment_id, сохранять запись с максимальным updated_at.
Тесты: unique+not_null на id, accepted_values на status ('pending','completed','failed','refunded').
```

## Mart fact-таблица

```
/new-model fct_daily_revenue --layer mart

Grain: один ряд на (date, currency_code).
Источники: ref('stg_payments') JOIN ref('dim_currencies').
Метрики: total_gross_usd, total_net_usd, transaction_count, avg_transaction_usd.
Материализация: incremental, partition by order_date, cluster by currency_code.
Тесты: recency (данные свежее 26 часов), row_count_min=1, unique на (date, currency_code).
```

## Intermediate-модель

```
/new-model int_orders_enriched --layer intermediate

JOIN stg_orders + stg_users + stg_products.
Добавить вычисляемые поля: is_repeat_customer (> 1 предыдущий заказ), days_to_fulfillment.
Материализация: ephemeral (не материализовывать в БД).
Документировать все вычисляемые поля в YAML.
```

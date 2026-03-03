# Prompt: `/new-model`

## Staging-model

```
/new-model stg_payments --layer staging --source raw_payments

Istochnik: raw_payments (raw schema).
Pereimenovat: payment_id→id, payment_amount→amount_usd, payment_ts→paid_at.
Tipy: amount_usd → NUMERIC(10,2), paid_at → TIMESTAMP WITH TIME ZONE.
Deduplikatsiya po payment_id, sokhranyat zapis s maksimalnym updated_at.
Testy: unique+not_null na id, accepted_values na status ('pending','completed','failed','refunded').
```

## Mart fact-tablitsa

```
/new-model fct_daily_revenue --layer mart

Grain: odin ryad na (date, currency_code).
Istochniki: ref('stg_payments') JOIN ref('dim_currencies').
Metriki: total_gross_usd, total_net_usd, transaction_count, avg_transaction_usd.
Materializatsiya: incremental, partition by order_date, cluster by currency_code.
Testy: recency (dannye svezhee 26 chasov), row_count_min=1, unique na (date, currency_code).
```

## Intermediate-model

```
/new-model int_orders_enriched --layer intermediate

JOIN stg_orders + stg_users + stg_products.
Dobavit vychislyaemye polya: is_repeat_customer (> 1 predydushchiy zakaz), days_to_fulfillment.
Materializatsiya: ephemeral (ne materializovyvat v BD).
Dokumentirovat vse vychislyaemye polya v YAML.
```

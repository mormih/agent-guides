# Prompt: `/lineage-trace`

## Оценка влияния изменения колонки

```
/lineage-trace --column stg_orders.discount_type --direction downstream

Планируем: переименовать discount_type → promotion_type и изменить enum значения (FIXED→flat, PERCENT→pct).
Найди все downstream модели, дашборды, ML-фичи, API, использующие эту колонку.
Оцени blast radius: N моделей, M дашбордов затронуто.
Сформируй migration checklist с phased approach и оценкой усилий (S/M/L).
```

## Трассировка источника метрики

```
/lineage-trace --column fct_revenue.net_amount_usd --direction upstream

Откуда берётся net_amount_usd в fct_revenue?
Проследи upstream до source-таблицы. Какие трансформации применяются?
Где происходит конвертация валют? Есть ли промежуточная модель с бизнес-логикой?
```

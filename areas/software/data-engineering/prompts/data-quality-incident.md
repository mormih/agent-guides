# Prompt: `/data-quality-incident`

## Дубликаты

```
/data-quality-incident --model fct_orders --type duplicate

Обнаружены дубликаты в fct_orders за 2026-02-15: row count в 2.3x больше нормы.
Downstream эффект: финансовый дашборд завышает revenue, ML-модель получает неверные обучающие данные.

1. Scope: сколько партиций затронуто?
2. Root cause: pipeline code? upstream? ошибка деплоя?
3. Quarantine: пометить затронутые партиции, уведомить #data-consumers
4. После фикса — запустить dbt test на unique
```

## SLA breach

```
/data-quality-incident --model fct_daily_revenue --type sla_breach

fct_daily_revenue не обновлялась с 02:00 UTC (SLA: обновление до 04:00 UTC).
Сейчас 07:30 UTC — просрочка 3.5 часа.
Проверь: Airflow DAG статус, upstream модели, warehouse доступность.
Уведомить: finance team что дашборд показывает вчерашние данные.
```

# Prompt: `/schema-migration`

## Переименование колонки

```
/schema-migration --table dim_users --change rename-column

Переименовать: user_email → email_hashed (тип VARCHAR сохраняется).
Причина: корпоративный стандарт именования PII-колонок.

1. Blast radius через /lineage-trace: список downstream
2. Уведомить downstream владельцев (минимум 5 business days notice)
3. Phased migration: добавить новую колонку → мигрировать downstream → deprecated старую → drop через 30 дней
4. Подготовить SQL для каждой фазы
```

## Смена типа данных

```
/schema-migration --table fct_orders --change change-type

Изменить тип: amount FLOAT → amount NUMERIC(12,4).
Причина: потеря точности при финансовых расчётах.
Это breaking change — нужен versioned подход.
Подготовь: stg_orders_v2 с правильным типом, migration script для исторических данных.
```

# Prompt: `/add-migration`

## Добавление новой колонки

```
/add-migration --table users --change add-column --name status

Добавь колонку `status` в таблицу `users`.
- Тип: VARCHAR(50).
- Поведение: Не должно локировать таблицу на проде при создании для больших таблиц PostgreSQL.
- Учти правила из `backend/skills/database-modeling.md`.
```

## Изменение существующей колонки (Expand-and-Contract)

```
/add-migration --table products --change rename-column --from price --to price_usd

Сгенерируй Phase 1 (Expand) скрипт для переименования `price` в `price_usd`.
Создай новую колонку, триггер для синхронизации старой и новой колонок, и напиши инструкцию по обновлению бэкенд-кода на двойную запись. 
Согласуй это с правилом Backward Compatible Migrations в `backend/rules/data_access.md`.
```

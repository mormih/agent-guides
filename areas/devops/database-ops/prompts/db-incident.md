# Prompt: `/db-incident`

Use when: responding to a database performance incident — locks, connections, slow queries, replication lag.

---

## Example 1 — Connection pool exhaustion

**EN:**
```
/db-incident

Database: postgres-primary / DB: production_db
Severity: P1
Symptom: application returning "connection refused" errors; PgBouncer log: "no more connections allowed"
Current connections: 490/500 (max_connections=500)
PgBouncer pool: default_pool_size=20, max_client_conn=200 (currently 200/200)
Recent change: new service order-processor deployed 30 min ago (suspected connection leak)
Investigate:
  1. Break down connections by state and application_name
  2. Identify leaked idle-in-transaction connections
  3. Kill safe connections; restore service
  4. Recommend PgBouncer config change to prevent recurrence
```

**RU:**
```
/db-incident

База данных: postgres-primary / БД: production_db
Severity: P1
Симптом: приложение возвращает ошибки "connection refused"; лог PgBouncer: "no more connections allowed"
Текущие подключения: 490/500 (max_connections=500)
PgBouncer pool: default_pool_size=20, max_client_conn=200 (сейчас 200/200)
Последнее изменение: новый сервис order-processor задеплоен 30 мин назад (подозрение на утечку соединений)
Расследовать:
  1. Разбивка соединений по состоянию и application_name
  2. Определить утекшие idle-in-transaction соединения
  3. Завершить безопасные соединения; восстановить сервис
  4. Рекомендовать изменение конфигурации PgBouncer для предотвращения повторения
```

---

## Example 2 — Migration causing lock cascade

**EN:**
```
/db-incident

Database: postgres-primary / DB: production_db
Severity: P0 — all writes blocked
Symptom: application hanging on INSERT/UPDATE; 47 queries in Lock state
Timeline: developer ran "ALTER TABLE orders ADD COLUMN total_usd DECIMAL NOT NULL DEFAULT 0" at 16:05
Table size: orders = 85M rows
Immediate action needed:
  1. Kill the ALTER TABLE statement (pid: find from pg_stat_activity)
  2. Verify all blocked queries resume after kill
  3. Design safe alternative migration (expand-and-contract)
  4. Estimate duration for safe version on 85M rows
```

**RU:**
```
/db-incident

База данных: postgres-primary / БД: production_db
Severity: P0 — все записи заблокированы
Симптом: приложение зависает на INSERT/UPDATE; 47 запросов в состоянии Lock
Timeline: разработчик запустил "ALTER TABLE orders ADD COLUMN total_usd DECIMAL NOT NULL DEFAULT 0" в 16:05
Размер таблицы: orders = 85М строк
Необходимые немедленные действия:
  1. Завершить ALTER TABLE statement (pid: найти из pg_stat_activity)
  2. Убедиться что все заблокированные запросы возобновились после завершения
  3. Спроектировать безопасную альтернативную миграцию (expand-and-contract)
  4. Оценить продолжительность безопасной версии для 85М строк
```

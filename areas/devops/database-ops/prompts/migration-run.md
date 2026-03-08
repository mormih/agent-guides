# Prompt: `/migration-run`

Use when: planning, executing, or debugging a production database migration.

---

## Example 1 — Safe migration: add non-null column to large table

**EN:**
```
/migration-run

Database: production_db / Table: orders (85M rows)
Migration: add column processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
Problem: naive ALTER TABLE would lock 85M rows for minutes (unacceptable in production)
Required approach:
  1. Estimate lock duration on staging with production-size data first
  2. Use safe sequence: ADD COLUMN (nullable, no default) → backfill in batches of 10k → ADD NOT NULL constraint
  3. Backfill script: Python with batched UPDATE + commit every 10k rows + sleep 50ms between batches
  4. Estimate total backfill time: 85M / 10k per batch × ~100ms per batch ≈ ?
  5. Final constraint: ALTER TABLE orders ALTER COLUMN processed_at SET NOT NULL (fast, no backfill needed if no NULLs)
  6. Rollback: DROP COLUMN processed_at (fast even on large table)
Show: complete migration SQL + backfill Python script + timing estimate
```

**RU:**
```
/migration-run

База данных: production_db / Таблица: orders (85М строк)
Миграция: добавить столбец processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
Проблема: наивный ALTER TABLE заблокирует 85М строк на минуты (недопустимо в production)
Необходимый подход:
  1. Оценить продолжительность блокировки на staging с данными размером production сначала
  2. Использовать безопасную последовательность: ADD COLUMN (nullable, без default) → backfill батчами по 10k → ADD NOT NULL constraint
  3. Скрипт backfill: Python с батчевым UPDATE + коммит каждые 10k строк + sleep 50мс между батчами
  4. Оценить общее время backfill: 85М / 10k на батч × ~100мс на батч ≈ ?
  5. Финальный constraint: ALTER TABLE orders ALTER COLUMN processed_at SET NOT NULL (быстро, без backfill если нет NULL)
  6. Откат: DROP COLUMN processed_at (быстро даже на большой таблице)
Показать: полный SQL миграции + Python скрипт backfill + оценка времени
```

---

## Example 2 — Emergency rollback: migration caused production incident

**EN:**
```
/migration-run

Incident: migration ran at 14:05; error rate spiked to 8% at 14:07; migration likely caused it
Migration applied: CREATE INDEX ON orders(user_id, status) (non-concurrent — mistake!)
Impact: table-level lock on orders; all writes blocked for 4 minutes
Current state: migration completed but service still degraded (connection pool exhausted)
Immediate actions:
  1. Connection pool: kill idle connections to release pool saturation
  2. Verify: index was created successfully (check pg_indexes)
  3. Decision: keep index (it's valid data) but fix the immediate saturation
  4. Prevent recurrence: add pre-migration check that all indexes use CONCURRENTLY
  5. Runbook addition: never use CREATE INDEX without CONCURRENTLY in production
```

**RU:**
```
/migration-run

Инцидент: миграция запущена в 14:05; error rate вырос до 8% в 14:07; миграция вероятно стала причиной
Применённая миграция: CREATE INDEX ON orders(user_id, status) (без CONCURRENTLY — ошибка!)
Влияние: блокировка на уровне таблицы orders; все записи заблокированы на 4 минуты
Текущее состояние: миграция завершена но сервис всё ещё деградирован (connection pool истощён)
Немедленные действия:
  1. Connection pool: завершить idle соединения для снятия насыщения
  2. Убедиться: индекс создан успешно (проверить pg_indexes)
  3. Решение: сохранить индекс (данные валидны) но исправить насыщение
  4. Предотвратить повторение: добавить pre-migration проверку что все индексы используют CONCURRENTLY
  5. Дополнение runbook: никогда не использовать CREATE INDEX без CONCURRENTLY в production
```

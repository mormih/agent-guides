---
name: migration-safety
type: skill
description: Safe database migrations in production — expand-and-contract, lock-safe DDL, timing estimation, rollback SQL.
related-rules:
  - migration-runbook.md
  - backup-policy.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: Migration Safety

> **Expertise:** Expand-and-contract, `CREATE INDEX CONCURRENTLY`, migration timing estimation, rollback planning.

## When to load

When planning or executing a production database migration, estimating migration duration, or writing rollback SQL.

## Expand-and-Contract Pattern

```sql
-- ❌ DANGEROUS: direct rename locks table and breaks old app version
ALTER TABLE orders RENAME COLUMN user_id TO customer_id;

-- ✅ SAFE: expand-and-contract over multiple deploys

-- Phase 1: EXPAND (add new column, keep old)
ALTER TABLE orders ADD COLUMN customer_id BIGINT;

-- Phase 2: DUAL-WRITE (app v2 writes to both; reads from customer_id)
-- (code change, no migration needed)

-- Phase 3: BACKFILL (run in small batches to avoid lock)
UPDATE orders SET customer_id = user_id
WHERE customer_id IS NULL
  AND id BETWEEN <batch_start> AND <batch_end>;

-- Phase 4: CONTRACT (app v3 no longer uses user_id)
ALTER TABLE orders DROP COLUMN user_id;
```

## Lock-Safe DDL

```sql
-- ✅ Safe: CREATE INDEX CONCURRENTLY (no table lock)
CREATE INDEX CONCURRENTLY idx_orders_customer_id ON orders(customer_id);
-- If concurrent creation fails:
DROP INDEX CONCURRENTLY idx_orders_customer_id_invalid;
-- Then retry

-- ❌ Dangerous on large tables: full table lock
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- ✅ Safe: ADD COLUMN with no default (instant in PostgreSQL 11+)
ALTER TABLE orders ADD COLUMN processed_at TIMESTAMPTZ;

-- ❌ Dangerous: ADD COLUMN with DEFAULT rewrites all rows (pre-PG11) / blocks (PG11+)
ALTER TABLE orders ADD COLUMN processed_at TIMESTAMPTZ NOT NULL DEFAULT now();
-- ✅ Safe alternative: add nullable, backfill, add constraint
ALTER TABLE orders ADD COLUMN processed_at TIMESTAMPTZ;
UPDATE orders SET processed_at = created_at WHERE processed_at IS NULL;
ALTER TABLE orders ALTER COLUMN processed_at SET NOT NULL;
```

## Estimating Migration Duration

```sql
-- Estimate rows to process
SELECT reltuples::BIGINT AS estimated_rows
FROM pg_class
WHERE relname = 'orders';

-- Rough timing: ~100k rows/sec for simple UPDATE on indexed column
-- ~10k rows/sec for complex JOIN-based UPDATE
-- Always test on production-size staging first!

-- Watch migration progress (PostgreSQL 9.6+)
SELECT
  phase,
  blocks_done,
  blocks_total,
  round(100.0 * blocks_done / NULLIF(blocks_total, 0), 1) AS pct_done
FROM pg_stat_progress_create_index
WHERE relid = 'orders'::regclass;

SELECT
  phase,
  tuples_done,
  tuples_total,
  round(100.0 * tuples_done / NULLIF(tuples_total, 0), 1) AS pct_done
FROM pg_stat_progress_vacuum
WHERE relid = 'orders'::regclass;
```

## Batched Backfill (avoid long transactions)

```python
# Never: UPDATE orders SET customer_id = user_id  (locks all rows, huge transaction)
# Always: batch by primary key range

import psycopg2

BATCH_SIZE = 10_000

with psycopg2.connect(DSN) as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT MIN(id), MAX(id) FROM orders WHERE customer_id IS NULL")
        min_id, max_id = cur.fetchone()

    batch_start = min_id
    while batch_start <= max_id:
        batch_end = batch_start + BATCH_SIZE
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE orders
                SET customer_id = user_id
                WHERE id >= %s AND id < %s AND customer_id IS NULL
            """, (batch_start, batch_end))
        conn.commit()  # commit each batch — releases row locks
        print(f"Backfilled {batch_start}–{batch_end}")
        batch_start = batch_end
```

## Rollback SQL Template

```sql
-- Every migration should have a paired rollback script

-- Migration (forward):
-- ALTER TABLE orders ADD COLUMN customer_id BIGINT;
-- CREATE INDEX CONCURRENTLY idx_orders_customer_id ON orders(customer_id);

-- Rollback:
DROP INDEX CONCURRENTLY IF EXISTS idx_orders_customer_id;
ALTER TABLE orders DROP COLUMN IF EXISTS customer_id;
```

## Pre-Migration Checklist

```bash
# 1. Take snapshot backup
pgbackrest --stanza=main --type=full backup
pgbackrest --stanza=main info   # verify backup completed

# 2. Check current lock activity (no long-running transactions)
psql -c "SELECT pid, now() - query_start AS duration, state, query
         FROM pg_stat_activity
         WHERE state != 'idle'
         ORDER BY duration DESC LIMIT 10;"

# 3. Set statement_timeout for migration session (prevent runaway)
psql -c "SET statement_timeout = '10min'; <migration_sql>"

# 4. Test rollback on staging first
```

---
name: db-performance
type: skill
description: PostgreSQL query performance — EXPLAIN ANALYZE, index design, pg_stat_statements, slow query detection, connection pool tuning.
related-rules:
  - access-control.md
  - migration-runbook.md
allowed-tools: Read, Bash
---

# Skill: Database Performance

> **Expertise:** EXPLAIN ANALYZE, index design (partial/covering), pg_stat_statements, autovacuum tuning, PgBouncer sizing.

## When to load

When investigating slow queries, designing indexes, tuning PostgreSQL config, or sizing PgBouncer pools.

## Query Analysis with pg_stat_statements

```sql
-- Enable (add to postgresql.conf, then restart or reload)
-- shared_preload_libraries = 'pg_stat_statements'
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Top 10 slowest queries by total time
SELECT
  left(query, 120) AS query_snippet,
  calls,
  round(total_exec_time::numeric, 2) AS total_ms,
  round(mean_exec_time::numeric, 2)  AS mean_ms,
  round(stddev_exec_time::numeric, 2) AS stddev_ms,
  rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- Top queries by mean execution time (find worst-per-call)
SELECT
  left(query, 120),
  calls,
  round(mean_exec_time::numeric, 2) AS mean_ms,
  round(rows::numeric / calls, 1)   AS rows_per_call
FROM pg_stat_statements
WHERE calls > 100   -- ignore one-offs
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Queries with high I/O (missing index candidates)
SELECT
  left(query, 120),
  calls,
  round(mean_exec_time::numeric, 1) AS mean_ms,
  shared_blks_read + shared_blks_hit AS total_blocks,
  round(shared_blks_hit::numeric / NULLIF(shared_blks_hit + shared_blks_read, 0) * 100, 1) AS cache_hit_pct
FROM pg_stat_statements
WHERE calls > 50
ORDER BY shared_blks_read DESC
LIMIT 10;

-- Reset stats after tuning
SELECT pg_stat_statements_reset();
```

## EXPLAIN ANALYZE (reading execution plans)

```sql
-- Always use ANALYZE BUFFERS for real cost data
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT o.*, c.email
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'pending'
  AND o.created_at > now() - interval '7 days';

/* Reading the output:
   Seq Scan          → full table scan, may need index
   Index Scan        → good, using index
   Index Only Scan   → best, covering index (no heap access)
   Nested Loop       → OK for small datasets; bad for large
   Hash Join         → good for large joins
   Merge Join        → good for pre-sorted data

   Key numbers:
   - actual time=START..END ms per row
   - rows=N vs rows=N (estimated vs actual — big diff = stale stats)
   - Buffers: hit=N read=N  (high 'read' = cache miss → index opportunity)
*/
```

## Index Design Patterns

```sql
-- Standard B-tree (equality and range queries)
CREATE INDEX CONCURRENTLY idx_orders_status_created
  ON orders(status, created_at)
  WHERE status IN ('pending', 'processing');   -- partial index — smaller, faster

-- Covering index (index-only scan — no heap access)
CREATE INDEX CONCURRENTLY idx_orders_customer_covering
  ON orders(customer_id, created_at)
  INCLUDE (status, total_amount);   -- INCLUDE avoids heap fetch for these columns

-- Expression index (for function-based queries)
CREATE INDEX CONCURRENTLY idx_users_email_lower
  ON users(lower(email));           -- for: WHERE lower(email) = lower($1)

-- JSON/JSONB index
CREATE INDEX CONCURRENTLY idx_events_data_type
  ON events USING GIN (data jsonb_path_ops);  -- for: WHERE data @> '{"type":"click"}'

-- Multicolumn order: selectivity matters
-- For: WHERE status='active' AND created_at > X
-- ✅ (status, created_at) — filter on status first (low cardinality OK as prefix)
-- ❌ (created_at, status) — date range first is wide; wastes I/O
```

## Identifying Missing Indexes

```sql
-- Tables with high sequential scans (candidates for indexing)
SELECT
  schemaname || '.' || relname AS table,
  seq_scan,
  seq_tup_read,
  idx_scan,
  round(seq_scan::numeric / NULLIF(seq_scan + idx_scan, 0) * 100, 1) AS seq_pct
FROM pg_stat_user_tables
WHERE seq_scan > 1000
  AND seq_tup_read > 10000
ORDER BY seq_tup_read DESC
LIMIT 20;

-- Unused indexes (wasting write overhead)
SELECT
  schemaname || '.' || tablename AS table,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS size,
  idx_scan AS scans
FROM pg_stat_user_indexes
JOIN pg_index USING (indexrelid)
WHERE idx_scan = 0
  AND NOT indisunique          -- don't drop unique constraints
  AND indpred IS NULL          -- don't drop partial indexes without analysis
ORDER BY pg_relation_size(indexrelid) DESC;
```

## PostgreSQL Configuration Tuning

```sql
-- Key parameters for a 16GB RAM server
ALTER SYSTEM SET shared_buffers = '4GB';          -- 25% of RAM
ALTER SYSTEM SET effective_cache_size = '12GB';   -- 75% of RAM
ALTER SYSTEM SET work_mem = '64MB';               -- per sort/hash; set conservatively
ALTER SYSTEM SET maintenance_work_mem = '1GB';    -- for VACUUM, CREATE INDEX
ALTER SYSTEM SET max_worker_processes = 8;
ALTER SYSTEM SET max_parallel_workers = 4;
ALTER SYSTEM SET max_parallel_workers_per_gather = 2;

-- WAL tuning (for high-write workloads)
ALTER SYSTEM SET wal_buffers = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET min_wal_size = '1GB';
ALTER SYSTEM SET max_wal_size = '4GB';

SELECT pg_reload_conf();
```

## PgBouncer Pool Sizing

```
Formula:
  max_server_connections = min(max_connections_pg - 5, available_connections)
  default_pool_size = max_server_connections / number_of_services
  max_client_conn = default_pool_size × 10   (clients can queue)

Example (max_connections=200, 5 services):
  default_pool_size = (200 - 5) / 5 = 39 → set to 40
  max_client_conn = 400
  reserve_pool_size = 5 (emergency burst)
```

```ini
# pgbouncer.ini
[pgbouncer]
pool_mode = transaction          # best for stateless apps
max_client_conn = 500            # total client connections
default_pool_size = 40           # server connections per database+user
reserve_pool_size = 5
reserve_pool_timeout = 3
server_idle_timeout = 600
client_idle_timeout = 0
query_wait_timeout = 30          # fail fast if no server available
```

## Autovacuum Tuning for High-Write Tables

```sql
-- Per-table autovacuum settings for hot tables
ALTER TABLE orders SET (
  autovacuum_vacuum_scale_factor = 0.01,     -- vacuum at 1% dead rows (default 20%)
  autovacuum_analyze_scale_factor = 0.005,   -- analyze at 0.5% (default 10%)
  autovacuum_vacuum_cost_delay = 2           -- less aggressive throttling
);
```

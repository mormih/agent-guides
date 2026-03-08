---
name: postgres-operations
type: skill
description: PostgreSQL operational runbooks — health checks, vacuum, bloat, locks, PITR, connection pool management.
related-rules:
  - backup-policy.md
  - access-control.md
  - migration-runbook.md
allowed-tools: Read, Bash
---

# Skill: PostgreSQL Operations

> **Expertise:** PostgreSQL health, vacuuming, lock analysis, PITR, WAL archiving, PgBouncer, K8s-hosted PostgreSQL.

## When to load

When investigating a slow database, diagnosing lock waits, running PITR recovery, or managing a PostgreSQL instance.

## Health Check Commands

```sql
-- Database size overview
SELECT
  datname,
  pg_size_pretty(pg_database_size(datname)) AS size,
  numbackends AS active_connections
FROM pg_stat_database
ORDER BY pg_database_size(datname) DESC;

-- Table sizes (top 20)
SELECT
  schemaname || '.' || tablename AS table,
  pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname || '.' || tablename)) AS table_size,
  pg_size_pretty(pg_indexes_size(schemaname || '.' || tablename)) AS index_size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC
LIMIT 20;

-- Replication lag (primary)
SELECT
  client_addr,
  state,
  pg_size_pretty(pg_wal_lsn_diff(sent_lsn, replay_lsn)) AS replication_lag
FROM pg_stat_replication;
```

## Lock Investigation

```sql
-- Active locks and blocking queries
SELECT
  blocking.pid AS blocking_pid,
  blocking.query AS blocking_query,
  blocked.pid AS blocked_pid,
  blocked.query AS blocked_query,
  blocked.wait_event_type,
  blocked.wait_event
FROM pg_stat_activity blocking
JOIN pg_stat_activity blocked
  ON blocked.wait_event_type = 'Lock'
  AND blocking.pid != blocked.pid
WHERE blocking.state = 'active';

-- Kill blocking query (confirm before running!)
SELECT pg_terminate_backend(<blocking_pid>);

-- Long-running queries (> 5 min)
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
  AND state = 'active';
```

## VACUUM and Bloat

```sql
-- Check autovacuum health
SELECT
  schemaname || '.' || relname AS table,
  last_autovacuum,
  last_autoanalyze,
  n_dead_tup,
  n_live_tup,
  round(n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0) * 100, 2) AS dead_pct
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC
LIMIT 20;

-- Manual VACUUM ANALYZE (non-blocking)
VACUUM ANALYZE VERBOSE orders;

-- VACUUM FULL (rewrites table — locks! use with maintenance window)
VACUUM FULL orders;
```

## Connection Pool (PgBouncer)

```bash
# Check PgBouncer stats
psql -h pgbouncer -p 6432 pgbouncer -c "SHOW POOLS;"
psql -h pgbouncer -p 6432 pgbouncer -c "SHOW STATS;"
psql -h pgbouncer -p 6432 pgbouncer -c "SHOW CLIENTS;"

# Reload config (no restart needed)
psql -h pgbouncer -p 6432 pgbouncer -c "RELOAD;"

# PgBouncer config for transaction mode (K8s apps)
[databases]
mydb = host=postgres-primary port=5432 dbname=mydb

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
min_pool_size = 5
server_idle_timeout = 600
```

## PITR (Point-in-Time Recovery) — pgBackRest

```bash
# Verify backup status
pgbackrest --stanza=main info

# Take full backup
pgbackrest --stanza=main --type=full backup

# PITR restore to specific time
pgbackrest --stanza=main --delta restore \
  --target="2024-11-15 03:40:00" \
  --target-action=promote

# After restore: promote replica to primary
pg_ctl promote -D /var/lib/postgresql/data
```

## K8s PostgreSQL (CloudNativePG / Zalando Operator)

```bash
# Check cluster status (CloudNativePG)
kubectl get cluster -n database
kubectl describe cluster postgres-cluster -n database

# Connect to primary
kubectl exec -it -n database \
  $(kubectl get pods -n database -l cnpg.io/cluster=postgres-cluster,role=primary -o name) \
  -- psql -U postgres mydb

# Manual failover
kubectl cnpg promote postgres-cluster -n database

# Check backup status
kubectl get backup -n database
```

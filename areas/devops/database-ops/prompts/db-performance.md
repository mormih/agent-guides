# Prompt: `/db-performance`

Use when: diagnosing slow queries, missing indexes, or general database performance degradation.

---

## Example 1 — Identify and fix slow queries

**EN:**
```
/db-performance

Database: production_db / DB: order_db
Symptom: order-service p99 latency increased from 80ms to 450ms 3 days ago
Observation: CPU on postgres-primary up from 15% to 65% (Prometheus)
Available: pg_stat_statements extension enabled
Investigation:
  1. Top-10 queries by total_time (pg_stat_statements, last reset: 3 days ago)
  2. Check for: sequential scans on large tables, high rows_examined vs rows_returned ratio
  3. EXPLAIN ANALYZE the top offender
  4. Identify missing index (likely new query after code deploy)
  5. Test index creation on staging first (measure latency improvement)
  6. Apply CREATE INDEX CONCURRENTLY in production (verify no lock)
Output: slow query + EXPLAIN output + CREATE INDEX CONCURRENTLY statement
```

**RU:**
```
/db-performance

База данных: production_db / БД: order_db
Симптом: p99 latency order-service вырос с 80мс до 450мс 3 дня назад
Наблюдение: CPU на postgres-primary вырос с 15% до 65% (Prometheus)
Доступно: расширение pg_stat_statements включено
Расследование:
  1. Топ-10 запросов по total_time (pg_stat_statements, последний сброс: 3 дня назад)
  2. Проверить: sequential scans на больших таблицах, высокое отношение rows_examined к rows_returned
  3. EXPLAIN ANALYZE для главного виновника
  4. Определить отсутствующий индекс (вероятно новый запрос после деплоя кода)
  5. Протестировать создание индекса на staging сначала (измерить улучшение latency)
  6. Применить CREATE INDEX CONCURRENTLY в production (убедиться в отсутствии блокировки)
Результат: медленный запрос + вывод EXPLAIN + оператор CREATE INDEX CONCURRENTLY
```

---

## Example 2 — Connection pool tuning for spike traffic

**EN:**
```
/db-performance

Database: production_db
Symptom: during traffic spikes (BF sale), errors "remaining connection slots reserved for replication"
Current config: max_connections=200; PgBouncer pool_size=20; 8 application pods × 5 connections = 160
Observation: at peak, connection count hits 195/200; some reserved for superuser/replication
Goal: support 2× current pod count (16 pods) without changing PostgreSQL max_connections
Analysis needed:
  1. Audit actual connections in use vs idle (pg_stat_activity breakdown)
  2. Calculate effective PgBouncer pool size needed: pods × avg_concurrent_queries_per_pod
  3. Tune PgBouncer: pool_mode=transaction (reuse connections across requests)
  4. Set server_pool_size to serve 16 pods comfortably within 180 connections (leaving 20 for admin)
  5. Test: k6 load test at 2× current peak; verify no "too many connections" errors
```

**RU:**
```
/db-performance

База данных: production_db
Симптом: во время пиков трафика (BF распродажа), ошибки "remaining connection slots reserved for replication"
Текущая конфигурация: max_connections=200; PgBouncer pool_size=20; 8 подов × 5 соединений = 160
Наблюдение: в пике количество соединений достигает 195/200; часть зарезервирована для superuser/репликации
Цель: поддержать 2× текущего количества подов (16 подов) без изменения PostgreSQL max_connections
Необходимый анализ:
  1. Аудит фактически используемых соединений vs idle (разбивка pg_stat_activity)
  2. Рассчитать необходимый эффективный pool size PgBouncer: поды × avg_concurrent_queries_per_pod
  3. Настроить PgBouncer: pool_mode=transaction (повторное использование соединений между запросами)
  4. Установить server_pool_size для комфортного обслуживания 16 подов в рамках 180 соединений (оставив 20 для admin)
  5. Тест: k6 нагрузочный тест при 2× текущего пика; убедиться в отсутствии ошибок "too many connections"
```

# Prompt: `/redis-ops`

Use when: managing Redis in production — memory pressure, eviction, persistence config, or cluster failover.

---

## Example 1 — Redis memory pressure: eviction policy tuning

**EN:**
```
/redis-ops

Redis setup: standalone Redis 7.2 (K8s StatefulSet), 2Gi maxmemory
Symptom: Redis hitting maxmemory; evicting keys needed for active sessions (data loss)
Current eviction policy: allkeys-lru (evicting ALL keys by LRU)
Use cases in this Redis instance:
  - User sessions (must not evict, TTL 24h)
  - Rate limiting counters (can evict, TTL 60s)
  - Cache of DB query results (can evict, TTL 5m)
Solution needed:
  1. Separate key namespaces: sessions:*, rate:*, cache:*
  2. Change eviction to volatile-lru (only evict keys WITH TTL set)
  3. Verify: sessions never have TTL (prevent eviction), cache/rate always have TTL
  4. Add Redis memory monitoring: alert at 80% usage, 90% critical
  5. Long term: split into 2 Redis instances (session store vs cache)
```

**RU:**
```
/redis-ops

Redis конфигурация: standalone Redis 7.2 (K8s StatefulSet), 2Gi maxmemory
Симптом: Redis достигает maxmemory; вытесняет ключи нужные для активных сессий (потеря данных)
Текущая политика вытеснения: allkeys-lru (вытесняет ВСЕ ключи по LRU)
Use cases в этом Redis:
  - Пользовательские сессии (нельзя вытеснять, TTL 24ч)
  - Счётчики rate limiting (можно вытеснять, TTL 60с)
  - Кэш результатов DB запросов (можно вытеснять, TTL 5м)
Необходимое решение:
  1. Разделить пространства имён ключей: sessions:*, rate:*, cache:*
  2. Изменить вытеснение на volatile-lru (вытеснять только ключи С установленным TTL)
  3. Убедиться: sessions никогда не имеют TTL (предотвращение вытеснения), cache/rate всегда имеют TTL
  4. Добавить мониторинг памяти Redis: алерт при 80% использовании, critical при 90%
  5. Долгосрочно: разделить на 2 Redis инстанса (session store vs cache)
```

---

## Example 2 — Redis Sentinel failover verification

**EN:**
```
/redis-ops

Setup: Redis Sentinel (1 primary + 2 replicas + 3 sentinels in K8s)
Task: verify automatic failover works correctly before relying on it for production
Test procedure:
  1. Confirm current primary: redis-cli -h sentinel -p 26379 SENTINEL get-master-addr-by-name mymaster
  2. Kill primary pod: kubectl delete pod redis-primary-0 -n cache
  3. Watch Sentinel elect new primary (should complete in < 30s)
  4. Verify application reconnects: check error spike duration in Grafana
  5. Verify old primary (when it comes back) becomes replica
  6. Verify: no data loss (write 1000 keys before failover; count after)
Application client: ioredis (Node.js) with sentinel support configured
Expected: < 30s failover; < 500ms added latency per request during failover; 0 data loss
```

**RU:**
```
/redis-ops

Конфигурация: Redis Sentinel (1 primary + 2 реплики + 3 sentinels в K8s)
Задача: убедиться что автоматический failover работает корректно до использования в production
Процедура тестирования:
  1. Подтвердить текущий primary: redis-cli -h sentinel -p 26379 SENTINEL get-master-addr-by-name mymaster
  2. Убить primary под: kubectl delete pod redis-primary-0 -n cache
  3. Наблюдать за выбором нового primary Sentinel (должно завершиться за < 30с)
  4. Убедиться что приложение переподключается: проверить продолжительность spike ошибок в Grafana
  5. Убедиться что старый primary (когда вернётся) становится репликой
  6. Убедиться: нет потери данных (записать 1000 ключей до failover; подсчитать после)
Клиент приложения: ioredis (Node.js) с настроенной поддержкой sentinel
Ожидаемое: < 30с failover; < 500мс дополнительная latency на запрос во время failover; 0 потери данных
```

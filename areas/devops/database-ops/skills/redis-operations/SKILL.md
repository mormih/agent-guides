---
name: redis-operations
type: skill
description: Redis operational runbooks — memory management, eviction policy, persistence config, Sentinel/Cluster, K8s-hosted Redis ops.
related-rules:
  - backup-policy.md
  - access-control.md
allowed-tools: Read, Bash
---

# Skill: Redis Operations

> **Expertise:** Redis memory management, eviction, persistence (RDB+AOF), Redis Sentinel, Redis Cluster, K8s Redis (Bitnami/Spotahome operator).

## When to load

When investigating Redis memory pressure, configuring persistence, debugging eviction, or setting up Redis HA.

## Health Check Commands

```bash
# Connect to Redis
redis-cli -h redis-master -p 6379 -a $REDIS_PASSWORD

# Server info overview
redis-cli INFO server | grep -E "redis_version|uptime|tcp_port"
redis-cli INFO memory | grep -E "used_memory_human|used_memory_peak_human|mem_fragmentation_ratio|maxmemory"
redis-cli INFO stats   | grep -E "total_commands_processed|rejected_connections|evicted_keys"
redis-cli INFO keyspace  # databases with key counts + expires

# Real-time monitoring (ops/sec per command)
redis-cli --stat          # 1-second interval stats
redis-cli MONITOR         # log every command (NEVER in production for long — high overhead)

# Slow log (commands over threshold)
redis-cli CONFIG SET slowlog-log-slower-than 10000   # 10ms threshold
redis-cli SLOWLOG GET 20   # last 20 slow commands
redis-cli SLOWLOG LEN
redis-cli SLOWLOG RESET
```

## Memory Management

```bash
# Check memory usage breakdown
redis-cli MEMORY DOCTOR        # health analysis + recommendations
redis-cli MEMORY STATS         # detailed breakdown
redis-cli MEMORY USAGE <key>   # bytes used by a specific key

# Find big keys (scan, not KEYS — non-blocking)
redis-cli --bigkeys            # sample-based big key finder
redis-cli --memkeys            # memory usage per key (sample)

# Memory fragmentation: ratio > 1.5 = fragmentation, < 1.0 = swap
redis-cli INFO memory | grep mem_fragmentation_ratio

# Defragment memory online (Redis 4+)
redis-cli CONFIG SET activedefrag yes
redis-cli CONFIG SET active-defrag-threshold-lower 10   # start at 10% frag
```

## Eviction Policy

```bash
# View current policy
redis-cli CONFIG GET maxmemory-policy

# Set eviction policy
# allkeys-lru    — evict any key by LRU (general-purpose cache)
# volatile-lru   — evict only keys with TTL by LRU (mixed TTL/no-TTL use)
# allkeys-lfu    — evict by LFU (access frequency, Redis 4+) — best for skewed access
# noeviction     — return OOM error when full (use for session store / queue — no silent data loss)
redis-cli CONFIG SET maxmemory-policy allkeys-lru

# Set memory limit
redis-cli CONFIG SET maxmemory 4gb

# Persist config to redis.conf
redis-cli CONFIG REWRITE
```

## Persistence Configuration

```bash
# RDB snapshot (point-in-time)
redis-cli CONFIG SET save "3600 1 300 100 60 10000"  # save if N changes in M seconds

# AOF (append-only file — more durable)
redis-cli CONFIG SET appendonly yes
redis-cli CONFIG SET appendfsync everysec   # fsync every second (balance: perf vs durability)
# appendfsync always   — safest (every write) — high IOPS
# appendfsync everysec — recommended — max 1s data loss
# appendfsync no       — fastest — OS decides when to flush

# AOF rewrite (compaction)
redis-cli BGREWRITEAOF

# Manual RDB snapshot
redis-cli BGSAVE
redis-cli LASTSAVE   # Unix timestamp of last successful save

# Best practice: enable both RDB + AOF
# RDB for fast restarts, AOF for minimal data loss
```

## Redis Sentinel (HA)

```bash
# Check Sentinel status
redis-cli -p 26379 SENTINEL masters
redis-cli -p 26379 SENTINEL slaves mymaster
redis-cli -p 26379 SENTINEL sentinels mymaster

# Force failover (test)
redis-cli -p 26379 SENTINEL failover mymaster

# sentinel.conf (minimal)
sentinel monitor mymaster redis-master 6379 2  # quorum=2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
sentinel parallel-syncs mymaster 1
```

## K8s Redis (Bitnami Helm)

```yaml
# values.yaml (Redis Sentinel mode)
architecture: replication
auth:
  enabled: true
  existingSecret: redis-password
  existingSecretPasswordKey: password

master:
  resources:
    requests: { memory: 256Mi, cpu: 100m }
    limits:   { memory: 1Gi,   cpu: 500m }
  persistence:
    enabled: true
    size: 8Gi

replica:
  replicaCount: 2

sentinel:
  enabled: true
  resources:
    requests: { memory: 64Mi, cpu: 50m }
    limits:   { memory: 128Mi, cpu: 100m }
```

```bash
# K8s Redis health check
kubectl exec -it redis-master-0 -n cache -- redis-cli ping
kubectl exec -it redis-master-0 -n cache -- redis-cli INFO replication

# Force failover in K8s
kubectl exec -it redis-master-0 -n cache -- \
  redis-cli -p 26379 SENTINEL failover mymaster

# Check pod resources vs actual memory usage
kubectl top pods -n cache -l app.kubernetes.io/name=redis
```

## Common Issues & Fixes

| Symptom | Diagnosis | Fix |
|:---|:---|:---|
| `OOM command not allowed` | maxmemory reached + `noeviction` | Increase maxmemory or change eviction policy |
| High eviction rate | Cache too small or no TTLs on keys | Increase maxmemory; audit keys without TTL |
| `WRONGTYPE` errors | Key type mismatch in application | Flush specific key: `DEL <key>` |
| Connection refused | maxclients reached | `CONFIG SET maxclients 10000` |
| Slow KEYS command | Running `KEYS *` in production | Replace with SCAN; never use KEYS in prod |
| AOF growing unbounded | Auto-rewrite threshold too high | Lower `auto-aof-rewrite-percentage` to 50 |

# Prompt: `/performance-audit`

## Load тест нового endpoint

```
/performance-audit --endpoint /api/v2/recommendations --type load

Load тест нового endpoint /api/v2/recommendations перед запуском в production.
Профиль: ramp up до 500 concurrent users за 5 минут, держать 10 минут, ramp down 2 минуты.
SLO: p99 < 300ms, error rate < 0.1%, throughput > 1000 rps.
Мониторить: CPU/memory сервиса, DB connection pool, Redis cache hit rate.
Если SLO нарушены → определить bottleneck и дать конкретные рекомендации.
```

## Spike тест (flash sale симуляция)

```
/performance-audit --endpoint /api/orders --type spike

Симуляция flash sale нагрузки.
Профиль: базовый 100 rps → spike до 1000 rps за 30 секунд → держать 2 минуты → возврат к 100 rps.
Проверить: успевает ли автоскейлинг? Есть ли потеря запросов во время spike?
Ожидаемое поведение: временное увеличение latency допустимо, потеря запросов — нет.
```

## Soak тест (поиск memory leaks)

```
/performance-audit --endpoint /api/orders --type soak

Soak тест для поиска memory leaks и деградации производительности.
Профиль: 200 concurrent users, 2 часа непрерывно.
Мониторить каждые 15 минут: heap size, GC pause time, p99 latency trend.
Алерт: если latency вырастает > 20% от baseline за время теста → memory leak suspect.
```

# Prompt: `/performance-audit`

## Load test novogo endpoint

```
/performance-audit --endpoint /api/v2/recommendations --type load

Load test novogo endpoint /api/v2/recommendations pered zapuskom v production.
Profil: ramp up do 500 concurrent users za 5 minut, derzhat 10 minut, ramp down 2 minuty.
SLO: p99 < 300ms, error rate < 0.1%, throughput > 1000 rps.
Monitorit: CPU/memory servisa, DB connection pool, Redis cache hit rate.
Esli SLO narusheny → opredelit bottleneck i dat konkretnye rekomendatsii.
```

## Spike test (flash sale simulyatsiya)

```
/performance-audit --endpoint /api/orders --type spike

Simulyatsiya flash sale nagruzki.
Profil: bazovyy 100 rps → spike do 1000 rps za 30 sekund → derzhat 2 minuty → vozvrat k 100 rps.
Proverit: uspevaet li avtoskeyling? Est li poterya zaprosov vo vremya spike?
Ozhidaemoe povedenie: vremennoe uvelichenie latency dopustimo, poterya zaprosov — net.
```

## Soak test (poisk memory leaks)

```
/performance-audit --endpoint /api/orders --type soak

Soak test dlya poiska memory leaks i degradatsii proizvoditelnosti.
Profil: 200 concurrent users, 2 chasa nepreryvno.
Monitorit kazhdye 15 minut: heap size, GC pause time, p99 latency trend.
Alert: esli latency vyrastaet > 20% ot baseline za vremya testa → memory leak suspect.
```

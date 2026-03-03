# Prompt: `/debug-issue`

## Poisk Root Cause (RCA) po logam

```
/debug-issue "Order API Timeout"

Poslednie polchasa p99 na /api/v1/orders stal 5 sekund.
Vot logi prilozheniya:
[2026-02-21 16:30] WARN: slow query execution 4850ms - SELECT * FROM orders JOIN items ...
[2026-02-21 16:30] ERROR: Timeout exception writing to Redis cache

Sdelay Root Cause Analysis ispolzuya `backend/skills/troubleshooting/SKILL.md`:
1. Napishi test, kotoryy vossozdast problemu lokalno (N+1? Nekhvatka indeksa? Deadlock?).
2. Napishi fiks koda.
3. Predlozhi metriku RED/USE (Prometheus), chtoby lovit eto avtomaticheski v budushchem (`backend/skills/observability/SKILL.md`).
```

## Rassledovanie degradatsii proizvoditelnosti BD

```
/debug-issue "High Connection Pool Usage"

Simptomy: Uchastilis 502 oshibki, baza stala otbivat konnekty (connection pool exhaustion).
Treys pokazyvaet, chto endpoint `/export-report` derzhit tranzaktsiyu otkrytoy po 2 minuty.
Proanaliziruy kod `/export-report` i predlozhi fiks dlya striminga dannykh bez uderzhaniya dolgoy tranzaktsii.
```

# Prompt: `/debug-issue`

## Поиск Root Cause (RCA) по логам

```
/debug-issue "Order API Timeout"

Последние полчаса p99 на /api/v1/orders стал 5 секунд.
Вот логи приложения:
[2026-02-21 16:30] WARN: slow query execution 4850ms - SELECT * FROM orders JOIN items ...
[2026-02-21 16:30] ERROR: Timeout exception writing to Redis cache

Сделай Root Cause Analysis используя `backend/skills/troubleshooting/SKILL.md`:
1. Напиши тест, который воссоздаст проблему локально (N+1? Нехватка индекса? Deadlock?).
2. Напиши фикс кода.
3. Предложи метрику RED/USE (Prometheus), чтобы ловить это автоматически в будущем (`backend/skills/observability/SKILL.md`).
```

## Расследование деградации производительности БД

```
/debug-issue "High Connection Pool Usage"

Симптомы: Участились 502 ошибки, база стала отбивать коннекты (connection pool exhaustion).
Трейс показывает, что эндпоинт `/export-report` держит транзакцию открытой по 2 минуты.
Проанализируй код `/export-report` и предложи фикс для стриминга данных без удержания долгой транзакции.
```

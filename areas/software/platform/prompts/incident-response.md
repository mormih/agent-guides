# Prompt: `/incident-response`

## P0 инцидент

```
/incident-response --severity P0 --service api

P0 ИНЦИДЕНТ: orders-api вернул 5xx rate = 35% за последние 10 минут.
Начало: ~14:32 UTC. Последний деплой: v2.3.7 два часа назад.
Создай #incident-channel, сформируй топ-3 гипотезы, выдай команды для немедленной диагностики.
Первое действие: проверить возможность rollback к v2.3.6.
```

## P1 деградация БД

```
/incident-response --severity P1 --service db

P1: p99 latency БД выросла с 50ms до 8s. Connection pool exhaustion в logs.
Выдай runbook: проверка активных запросов, блокировок, pool size.
Конкретные SQL-запросы для диагностики postgres.
```

# Prompt: `/chaos-run`

Use when: designing or executing a chaos engineering experiment to verify system resilience.

---

## Example 1 — Pod failure resilience test

**EN:**
```
/chaos-run

System under test: checkout-service (3 replicas in production-like staging)
Hypothesis: "checkout-service handles loss of 1/3 pods with < 0.1% error rate increase"
Tool: chaos-mesh (already installed in staging cluster)
Experiment:
  - Inject PodChaos: kill 1 random pod every 30 seconds for 5 minutes
  - Steady-state baseline: error rate < 0.1%, p99 < 300ms (5 min before experiment)
  - Monitor during: error rate, p99 latency, RPS in Grafana
  - Rollback: stop experiment if error rate > 1% for > 60s
Verification: steady-state hypothesis holds (or document why it failed)
Environment: staging only (never run chaos in production without graduated process)
Output: experiment report with hypothesis verdict + observations + recommended fix if failed
```

**RU:**
```
/chaos-run

Система под тестом: checkout-service (3 реплики в production-like staging)
Гипотеза: "checkout-service обрабатывает потерю 1/3 подов с увеличением error rate < 0.1%"
Инструмент: chaos-mesh (уже установлен в staging кластере)
Эксперимент:
  - Инжектировать PodChaos: убивать 1 случайный под каждые 30 секунд в течение 5 минут
  - Baseline стационарного состояния: error rate < 0.1%, p99 < 300ms (5 мин до эксперимента)
  - Мониторинг во время: error rate, p99 latency, RPS в Grafana
  - Откат: остановить эксперимент если error rate > 1% в течение > 60с
Верификация: гипотеза стационарного состояния выполнена (или задокументировать почему нет)
Окружение: только staging (никогда не запускать chaos в production без постепенного процесса)
Результат: отчёт об эксперименте с вердиктом гипотезы + наблюдения + рекомендуемое исправление при отказе
```

---

## Example 2 — Network partition: database failover test

**EN:**
```
/chaos-run

System under test: payment-service → postgres-primary (CloudNativePG cluster)
Hypothesis: "payment-service automatically reconnects within 30s after postgres primary failover, with < 500ms added latency per request during reconnect"
Experiment:
  - Inject NetworkChaos: block traffic from payment-service pods to postgres-primary for 90s
  - CloudNativePG should auto-promote replica to primary during network partition
  - Monitor: payment-service error rate, connection pool exhaustion (pgbouncer stats), reconnect time
  - Verify: after partition heals, service recovers automatically (no manual intervention)
Pre-conditions:
  - Confirm postgres replica is healthy before starting
  - Confirm pgbouncer reconnect_timeout is set appropriately
  - Run at 10% of normal traffic (k6 load generator)
```

**RU:**
```
/chaos-run

Система под тестом: payment-service → postgres-primary (CloudNativePG кластер)
Гипотеза: "payment-service автоматически переподключается в течение 30с после failover postgres primary, с задержкой < 500ms на запрос во время переподключения"
Эксперимент:
  - Инжектировать NetworkChaos: блокировать трафик от подов payment-service к postgres-primary на 90с
  - CloudNativePG должен автоматически назначить реплику primary во время сетевого раздела
  - Мониторинг: error rate payment-service, исчерпание connection pool (статистика pgbouncer), время переподключения
  - Проверить: после восстановления раздела сервис восстанавливается автоматически (без ручного вмешательства)
Предусловия:
  - Убедиться что postgres реплика здорова перед началом
  - Убедиться что pgbouncer reconnect_timeout настроен правильно
  - Запустить при 10% от нормального трафика (k6 генератор нагрузки)
```

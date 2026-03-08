# Prompt: `/tracing-debug`

Use when: debugging a slow distributed request using traces, or setting up tracing for the first time.

---

## Example 1 — Trace slow checkout (multi-service waterfall)

**EN:**
```
/tracing-debug

Symptom: checkout p99 latency = 3.2s; SLO threshold = 500ms
Trace available: trace_id=abc123def456 (found in Loki error log, captured during slow request)
Services in trace: api-gateway → checkout-service → payment-service → order-service → postgres
Goal:
  1. Open trace in Tempo; identify which span is slow
  2. Check for: sequential calls that could be parallelised, N+1 DB queries, missing DB indexes
  3. If DB span is slow: correlate with postgres slow query log (Loki query by trace_id)
  4. Output: root cause span + recommended fix (code change or index)
Tempo URL: https://tempo.monitoring.internal
```

**RU:**
```
/tracing-debug

Симптом: checkout p99 latency = 3.2s; порог SLO = 500ms
Трейс доступен: trace_id=abc123def456 (найден в Loki error log, захвачен во время медленного запроса)
Сервисы в трейсе: api-gateway → checkout-service → payment-service → order-service → postgres
Цель:
  1. Открыть трейс в Tempo; определить какой span медленный
  2. Проверить: последовательные вызовы которые можно распараллелить, N+1 DB запросы, отсутствующие индексы
  3. Если медленный DB span: сопоставить с postgres slow query log (запрос Loki по trace_id)
  4. Результат: корневой медленный span + рекомендуемое исправление (изменение кода или индекс)
Tempo URL: https://tempo.monitoring.internal
```

---

## Example 2 — Add tracing to existing Go microservice

**EN:**
```
/tracing-debug

Task: add OpenTelemetry tracing to existing Go service (order-service)
Framework: net/http + chi router + sqlx (postgres)
Current state: no instrumentation
Collector: otel-collector.monitoring:4317 (already running in cluster)
Required:
  - Auto-instrument: all HTTP handlers (chi middleware)
  - Auto-instrument: all SQL queries (otelsqlx or sqlx wrapper)
  - Manual span for: external HTTP calls to payment-service
  - Propagate W3C TraceContext in all outgoing HTTP requests
  - Inject trace_id into slog structured log entries
  - Test: generate a request; verify trace appears in Tempo with all spans
```

**RU:**
```
/tracing-debug

Задача: добавить OpenTelemetry трейсинг в существующий Go сервис (order-service)
Фреймворк: net/http + chi router + sqlx (postgres)
Текущее состояние: нет инструментирования
Collector: otel-collector.monitoring:4317 (уже работает в кластере)
Требуется:
  - Авто-инструментирование: все HTTP handlers (chi middleware)
  - Авто-инструментирование: все SQL запросы (otelsqlx или sqlx wrapper)
  - Ручной span для: внешние HTTP вызовы к payment-service
  - Передача W3C TraceContext во всех исходящих HTTP запросах
  - Инжекция trace_id в slog structured log записи
  - Тест: сгенерировать запрос; убедиться что трейс появился в Tempo со всеми spans
```

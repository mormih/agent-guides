# Prompt: `/slo-dashboard`

Use when: building or reviewing an SLO/error budget dashboard in Grafana.

---

## Example 1 — SLO overview dashboard for all Tier 1 services

**EN:**
```
/slo-dashboard

Goal: single Grafana dashboard showing SLO health for all 6 Tier 1 services
Services: checkout-service, payment-service, order-service, auth-service, user-service, notification-service
SLO type: availability (99.5%) + latency p99 < 500ms for each
Datasource: Prometheus (recording rules already defined via Sloth)
Dashboard panels per service:
  - Current SLI value (gauge, green/yellow/red vs SLO target)
  - Error budget remaining % (gauge)
  - 28-day error budget burn rate (time series)
  - Budget state badge: Healthy / Warning / Freeze / Exhausted
Top of dashboard: fleet summary (# services healthy / warning / exhausted)
Variables: time range selector; environment filter (staging/production)
```

**RU:**
```
/slo-dashboard

Цель: единый Grafana дашборд с состоянием SLO для всех 6 Tier 1 сервисов
Сервисы: checkout-service, payment-service, order-service, auth-service, user-service, notification-service
Тип SLO: availability (99.5%) + latency p99 < 500ms для каждого
Datasource: Prometheus (recording rules уже определены через Sloth)
Панели дашборда на каждый сервис:
  - Текущее значение SLI (gauge, green/yellow/red vs цель SLO)
  - Остаток error budget % (gauge)
  - Скорость сжигания error budget за 28 дней (time series)
  - Значок состояния бюджета: Healthy / Warning / Freeze / Exhausted
Вверху дашборда: сводка по fleet (# сервисов healthy / warning / exhausted)
Переменные: выбор диапазона времени; фильтр окружения (staging/production)
```

---

## Example 2 — Service deep-dive: single service golden signals

**EN:**
```
/slo-dashboard

Goal: deep-dive Grafana dashboard for single service (payment-service)
Panels needed (in order, top to bottom):
  Row 1 — Health summary:
    - Request rate (RPS) — time series
    - Error rate % — time series with threshold line at 1%
    - p50/p95/p99 latency — time series
    - Active replicas / desired replicas (HPA) — stat panel
  Row 2 — SLO:
    - 28-day SLI ratio vs 99.5% target — time series
    - Error budget remaining (minutes) — gauge
    - Burn rate 1h / 6h / 24h — stat panels
  Row 3 — Resources:
    - CPU usage vs request vs limit — time series
    - Memory usage vs limit — time series
    - Pod restart count — bar chart
  Row 4 — Dependencies:
    - Downstream error rate (postgres, redis) — time series
    - DB connection pool utilisation — stat
Datasources: Prometheus + Loki (logs panel for errors)
Link to Tempo traces from latency panel
```

**RU:**
```
/slo-dashboard

Цель: детальный Grafana дашборд для одного сервиса (payment-service)
Панели (сверху вниз):
  Ряд 1 — Сводка здоровья:
    - Request rate (RPS) — time series
    - Error rate % — time series с линией порога 1%
    - p50/p95/p99 latency — time series
    - Активные реплики / желаемые реплики (HPA) — stat панель
  Ряд 2 — SLO:
    - 28-дневное SLI ratio vs цель 99.5% — time series
    - Остаток error budget (минуты) — gauge
    - Burn rate 1ч / 6ч / 24ч — stat панели
  Ряд 3 — Ресурсы:
    - CPU использование vs request vs limit — time series
    - Память vs limit — time series
    - Количество рестартов подов — bar chart
  Ряд 4 — Зависимости:
    - Error rate downstream (postgres, redis) — time series
    - Использование DB connection pool — stat
Datasources: Prometheus + Loki (log панель для ошибок)
Ссылка на Tempo трейсы из панели latency
```

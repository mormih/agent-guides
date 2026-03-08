# Rule: Golden Signals & Observability Baseline

**Priority**: P1 — Services without golden signals cannot be promoted to production.

## Four Golden Signals (mandatory for every service)

| Signal | Metric | Alert threshold |
|:---|:---|:---|
| **Latency** | p50, p95, p99 request duration | p99 > 1s for 5 min |
| **Traffic** | Requests per second (RPS) | Drop > 50% from baseline |
| **Errors** | 5xx rate / error rate | > 1% for 2 min |
| **Saturation** | CPU %, memory %, queue depth | CPU > 80%, Memory > 85% |

## Instrumentation Requirements

1. **Every HTTP service exposes** `/metrics` in Prometheus format on port 9090 (or sidecar).
2. **Every service has** a `ServiceMonitor` (kube-prometheus-stack) or scrape config.
3. **Structured JSON logging** — no unstructured log lines in production.
4. **Trace context propagated** — W3C TraceContext headers forwarded between all services.
5. **Health endpoints** — `/health/ready` (readiness) and `/health/live` (liveness) separate.

## Three Pillars Coverage

| Pillar | Stack | Retention |
|:---|:---|:---|
| Metrics | Prometheus + VictoriaMetrics (long-term) | 15 days hot / 1 year cold |
| Logs | Loki or ELK (Elasticsearch+Logstash+Kibana) | 30 days |
| Traces | Tempo or Jaeger (via OpenTelemetry) | 7 days |

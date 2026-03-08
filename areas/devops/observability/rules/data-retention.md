# Rule: Observability Data Retention

**Priority**: P2 — Retention settings affect compliance and cost.

## Retention Policy

| Data type | Hot storage | Cold/archive | Delete |
|:---|:---|:---|:---|
| Metrics (Prometheus) | 15 days | 1 year (VictoriaMetrics/Thanos) | > 1 year |
| Logs | 30 days (Loki/ES hot) | 90 days (cold) | > 90 days |
| Traces | 7 days | Not archived (high volume) | > 7 days |
| Alerting history | 90 days | — | > 90 days |

## Cost Controls

1. **High-cardinality labels are forbidden** — no `user_id`, `session_id`, `request_id` as Prometheus labels (use trace context instead).
2. **Log sampling** — DEBUG logs sampled at 1% in production; INFO at 100%; ERROR/WARN at 100%.
3. **Trace sampling** — head-based: 10% of requests; always-sample for errors and slow requests (> p99).
4. **Prometheus recording rules** — pre-aggregate expensive queries; don't query raw metrics in dashboards.

---
name: log-aggregation
type: skill
description: Set up Loki or ELK log aggregation for K8s workloads — structured logging, log routing, and log-based alerting.
related-rules:
  - golden-signals.md
  - data-retention.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: Log Aggregation

> **Expertise:** Loki (Grafana stack), Promtail/Fluent Bit, structured JSON logging, log-based alerting, ELK basics.

## When to load

When setting up log collection, writing log queries, debugging missing logs, or adding log-based alerts.

## Loki Stack (K8s — recommended)

```yaml
# Promtail DaemonSet auto-discovers K8s pod logs
# Install via helm:
helm upgrade --install loki grafana/loki-stack \
  -n monitoring \
  -f loki-values.yaml

# loki-values.yaml
loki:
  auth_enabled: false
  limits_config:
    retention_period: 720h   # 30 days
    ingestion_rate_mb: 16
    max_streams_per_user: 10000
  storage_config:
    boltdb_shipper:
      active_index_directory: /data/loki/boltdb-index
    filesystem:
      directory: /data/loki/chunks

promtail:
  config:
    clients:
      - url: http://loki:3100/loki/api/v1/push
    scrape_configs:
      - job_name: kubernetes-pods
        kubernetes_sd_configs:
          - role: pod
        pipeline_stages:
          - docker: {}     # parse Docker JSON log format
          - json:          # extract fields from app JSON logs
              expressions:
                level: level
                trace_id: trace_id
                service: service
          - labels:
              level:
              service:
```

## LogQL Queries

```logql
# All error logs from a service in last 5 min
{namespace="production", app="order-service"} |= "ERROR"

# Parse JSON and filter by field
{namespace="production"} | json | level="error" | trace_id != ""

# Count errors per service (for alerting)
sum by (service) (
  count_over_time({namespace="production"} | json | level="error" [5m])
)

# Log rate (to detect log explosion)
sum(rate({namespace="production"}[5m])) by (app)

# Find slow requests from logs
{app="api-gateway"} | json | response_time_ms > 500
```

## Structured Logging Standards

```python
# Python — structlog
import structlog

log = structlog.get_logger()

# Always include: service, version, trace_id, span_id, level
log.info("order.created",
    order_id="ord-123",
    user_id="usr-456",    # OK in log; NOT in metrics labels
    amount_cents=4999,
    # trace_id injected automatically via TraceContextFilter
)

# Output (JSON):
# {"event": "order.created", "level": "info", "order_id": "ord-123",
#  "trace_id": "abc123def456", "span_id": "789xyz", "timestamp": "..."}
```

```go
// Go — slog (stdlib, Go 1.21+)
logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelInfo,
}))
slog.SetDefault(logger)

slog.Info("order.created",
    "order_id", "ord-123",
    "amount_cents", 4999,
    "trace_id", traceID,  // inject from context
)
```

## Log-Based Alerting (Loki ruler)

```yaml
# loki-rules.yaml
groups:
  - name: application.logs
    rules:
      - alert: HighErrorLogRate
        expr: |
          sum(rate({namespace="production"} | json | level="error" [5m])) by (app)
          > 10
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "Error log rate > 10/s — {{ $labels.app }}"
          runbook_url: "https://runbooks.internal/high-error-logs"
```

## Fluent Bit (alternative — lower resource usage)

```yaml
# fluent-bit-config.yaml (K8s ConfigMap)
[INPUT]
    Name              tail
    Path              /var/log/containers/*.log
    Parser            docker
    Refresh_Interval  5

[FILTER]
    Name         kubernetes
    Match        kube.*
    Kube_Tag_Prefix  kube.var.log.containers.
    Merge_Log    On
    Keep_Log     Off

[OUTPUT]
    Name   loki
    Match  kube.*
    Host   loki
    Port   3100
    Labels job=fluent-bit, namespace=$kubernetes['namespace_name']
```

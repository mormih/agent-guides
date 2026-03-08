---
name: grafana-dashboards
type: skill
description: Design and maintain Grafana dashboards — service overview panels, SLO tracking, variable templates, dashboard-as-code with Grafonnet/Jsonnet.
related-rules:
  - golden-signals.md
  - data-retention.md
allowed-tools: Read, Write, Edit
---

# Skill: Grafana Dashboards

> **Expertise:** Panel design, variable templates, cross-datasource linking (Prometheus + Loki + Tempo), SLO dashboards, Jsonnet/Grafonnet for dashboard-as-code.

## When to load

When creating a new service dashboard, adding SLO panels, debugging a missing metric in Grafana, or converting dashboards to code.

## Standard Service Overview Dashboard Panels

```
Row 1: Golden Signals
  [Traffic: RPS]  [Error Rate %]  [P50/P95/P99 Latency]  [Saturation: CPU/Mem]

Row 2: Infrastructure
  [Pod count / restarts]  [Memory usage vs limit]  [CPU throttling %]

Row 3: Logs & Traces (via Explore links)
  [Recent error logs]  [Slow trace exemplars]

Row 4: Business Metrics (service-specific)
  [Order rate]  [Checkout conversion]  [Queue depth]
```

## Panel Configurations

```json
// Error rate panel (Stat + threshold coloring)
{
  "type": "stat",
  "title": "Error Rate",
  "datasource": "Prometheus",
  "targets": [{
    "expr": "sum(rate(http_requests_total{service='$service', status=~'5..'}[5m])) / sum(rate(http_requests_total{service='$service'}[5m])) * 100",
    "legendFormat": "Error %"
  }],
  "fieldConfig": {
    "defaults": {
      "unit": "percent",
      "thresholds": {
        "steps": [
          {"color": "green", "value": 0},
          {"color": "yellow", "value": 0.1},
          {"color": "red",   "value": 1.0}
        ]
      }
    }
  }
}
```

```json
// Latency heatmap panel
{
  "type": "heatmap",
  "title": "Request Latency Heatmap",
  "targets": [{
    "expr": "sum(rate(http_request_duration_seconds_bucket{service='$service'}[5m])) by (le)",
    "format": "heatmap",
    "legendFormat": "{{le}}"
  }],
  "yAxis": { "format": "s", "logBase": 2 }
}
```

## Variable Templates (dashboard filters)

```json
// Namespace variable (auto-populated from Prometheus labels)
{
  "name": "namespace",
  "type": "query",
  "datasource": "Prometheus",
  "query": "label_values(kube_pod_info, namespace)",
  "refresh": 2,     // refresh on time range change
  "includeAll": true,
  "multi": true
}

// Service variable (filtered by selected namespace)
{
  "name": "service",
  "type": "query",
  "query": "label_values(http_requests_total{namespace='$namespace'}, service)",
  "refresh": 2
}
```

## Trace Exemplars (link Prometheus → Tempo)

```json
// Enable exemplars on latency histogram panel
{
  "type": "timeseries",
  "targets": [{
    "expr": "histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service='$service'}[5m])) by (le))",
    "exemplar": true,    // show exemplar dots linking to traces
    "legendFormat": "p99"
  }]
}
// Requires: Tempo as datasource, traceID in exemplar labels
```

## Log Panel (Loki integration)

```json
{
  "type": "logs",
  "title": "Recent Errors",
  "datasource": "Loki",
  "targets": [{
    "expr": "{namespace='$namespace', app='$service'} | json | level='error'",
    "maxLines": 100
  }]
}
```

## SLO Dashboard Panels

```json
// SLO budget remaining (Gauge)
{
  "type": "gauge",
  "title": "Error Budget Remaining",
  "targets": [{
    "expr": "(1 - (sum(increase(http_requests_total{service='$service',status=~'5..'}[28d])) / sum(increase(http_requests_total{service='$service'}[28d])))) / 0.005 * 100"
  }],
  "fieldConfig": {
    "defaults": {
      "unit": "percent",
      "min": 0, "max": 100,
      "thresholds": {
        "steps": [
          {"color": "red",    "value": 0},
          {"color": "yellow", "value": 25},
          {"color": "green",  "value": 50}
        ]
      }
    }
  }
}
```

## Dashboard as Code (Jsonnet + Grafonnet)

```jsonnet
// dashboards/service-overview.jsonnet
local grafana = import 'grafonnet/grafana.libsonnet';
local dashboard = grafana.dashboard;
local row = grafana.row;
local prometheus = grafana.prometheus;
local graphPanel = grafana.graphPanel;

dashboard.new(
  'Service Overview',
  tags=['generated', 'service'],
  refresh='1m',
  time_from='now-1h',
)
.addPanel(
  graphPanel.new(
    'Request Rate',
    datasource='Prometheus',
  ).addTarget(
    prometheus.target(
      'sum(rate(http_requests_total{service="$service"}[5m]))',
      legendFormat='RPS',
    )
  ),
  gridPos={ x: 0, y: 0, w: 12, h: 8 }
)
```

```bash
# Generate JSON from Jsonnet and import to Grafana
jsonnet -J vendor dashboards/service-overview.jsonnet > /tmp/dashboard.json
curl -X POST http://grafana:3000/api/dashboards/import \
  -H 'Content-Type: application/json' \
  -d "{\"dashboard\": $(cat /tmp/dashboard.json), \"overwrite\": true}"
```

## Dashboard Git Workflow

```bash
# Export dashboard JSON from Grafana (for version control)
curl http://grafana:3000/api/dashboards/uid/<uid> | jq '.dashboard' > dashboards/service-overview.json

# Apply dashboard from Git (GitOps)
# Use grafana-operator or grizzly (grafana/grizzly)
grr apply dashboards/
```

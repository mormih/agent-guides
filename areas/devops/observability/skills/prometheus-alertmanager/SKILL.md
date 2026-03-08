---
name: prometheus-alertmanager
type: skill
description: Write production-quality Prometheus alert rules, recording rules, and Alertmanager routing configs.
related-rules:
  - golden-signals.md
  - alerting-standards.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: Prometheus & Alertmanager

> **Expertise:** PromQL, alert rules, recording rules, Alertmanager routing, inhibition, silences.

## When to load

When writing alert rules, debugging PromQL, configuring Alertmanager routing, or investigating a firing alert.

## Golden Signal Alert Rules

```yaml
# alerts/service-golden-signals.yaml
groups:
  - name: service.golden-signals
    rules:

      # ── Errors ────────────────────────────────────────
      - alert: HighErrorRate
        expr: |
          (
            sum(rate(http_requests_total{status=~"5.."}[5m])) by (namespace, service)
            /
            sum(rate(http_requests_total[5m])) by (namespace, service)
          ) > 0.01
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Error rate > 1% — {{ $labels.service }} in {{ $labels.namespace }}"
          description: "Current error rate: {{ $value | humanizePercentage }}"
          runbook_url: "https://runbooks.internal/high-error-rate"

      # ── Latency ───────────────────────────────────────
      - alert: HighP99Latency
        expr: |
          histogram_quantile(0.99,
            sum(rate(http_request_duration_seconds_bucket[5m])) by (namespace, service, le)
          ) > 1.0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "p99 latency > 1s — {{ $labels.service }}"
          description: "p99: {{ $value | humanizeDuration }}"
          runbook_url: "https://runbooks.internal/high-latency"

      # ── Saturation ────────────────────────────────────
      - alert: PodMemoryPressure
        expr: |
          (
            container_memory_working_set_bytes{container!=""}
            /
            container_spec_memory_limit_bytes{container!=""}
          ) > 0.85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Memory > 85% limit — {{ $labels.container }} in {{ $labels.namespace }}"
          runbook_url: "https://runbooks.internal/memory-pressure"

      # ── Traffic Drop ──────────────────────────────────
      - alert: TrafficDrop
        expr: |
          (
            sum(rate(http_requests_total[5m])) by (service)
            /
            sum(rate(http_requests_total[1h] offset 5m)) by (service)
          ) < 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Traffic dropped > 50% vs 1h ago — {{ $labels.service }}"
          runbook_url: "https://runbooks.internal/traffic-drop"
```

## Recording Rules (pre-aggregate expensive queries)

```yaml
groups:
  - name: service.recording
    interval: 1m
    rules:
      # Pre-compute error rate (used in dashboards — no re-computation)
      - record: job:http_requests:error_rate5m
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m])) by (job, namespace)
          /
          sum(rate(http_requests_total[5m])) by (job, namespace)

      # Pre-compute p99 (expensive histogram_quantile)
      - record: job:http_request_duration_seconds:p99_5m
        expr: |
          histogram_quantile(0.99,
            sum(rate(http_request_duration_seconds_bucket[5m])) by (job, le)
          )
```

## PromQL Patterns

```promql
# Rate of requests (always use rate() on counters, not irate() for alerting)
rate(http_requests_total[5m])

# Error ratio
sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
/ sum(rate(http_requests_total[5m])) by (service)

# Memory utilisation (working set vs limit)
container_memory_working_set_bytes / container_spec_memory_limit_bytes

# CPU throttling ratio (> 25% = limit too low)
sum(rate(container_cpu_throttled_seconds_total[5m])) by (pod)
/ sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)

# Absent metric (detect missing scrape targets)
absent(up{job="my-service"} == 1)
```

## Alertmanager Config

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  slack_api_url: https://hooks.slack.com/...

route:
  receiver: slack-warning
  group_by: [alertname, namespace, service]
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - matchers: [severity="critical"]
      receiver: pagerduty
      group_wait: 0s            # page immediately
    - matchers: [alertname="Watchdog"]
      receiver: deadman-snitch  # heartbeat alert

inhibit_rules:
  # If a service is down (critical), suppress its latency/error warnings
  - source_matchers: [severity="critical", alertname="ServiceDown"]
    target_matchers: [severity="warning"]
    equal: [namespace, service]

receivers:
  - name: pagerduty
    pagerduty_configs:
      - routing_key: $PD_ROUTING_KEY
        description: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'

  - name: slack-warning
    slack_configs:
      - channel: '#alerts-warning'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
```

## Debugging Alerts

```bash
# Check currently firing alerts
kubectl port-forward svc/alertmanager 9093:9093 -n monitoring
# Open http://localhost:9093

# Evaluate a PromQL expression (check why alert fired/didn't fire)
kubectl port-forward svc/prometheus 9090:9090 -n monitoring
# Open http://localhost:9090/graph

# Check alert rule evaluation
curl http://localhost:9090/api/v1/rules | jq '.data.groups[].rules[] | select(.name=="HighErrorRate")'

# Silence a noisy alert during maintenance
amtool silence add alertname="HighErrorRate" namespace="staging" \
  --duration=2h --comment="Scheduled maintenance window"
```

---
name: slo-implementation
type: skill
description: Implement SLOs end-to-end in Prometheus — recording rules, burn rate alerts, error budget dashboards, and Sloth/pyrra integration.
related-rules:
  - golden-signals.md
  - alerting-standards.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: SLO Implementation

> **Expertise:** Prometheus recording rules for SLOs, multi-window burn rate alerts, Sloth code generation, error budget Grafana panels.

## When to load

When implementing SLOs for a service in Prometheus, setting up burn rate alerts, or creating error budget dashboards.

## Full SLO Stack (single service)

### Step 1: Define the SLI Recording Rules

```yaml
# prometheus-rules/slo-checkout-service.yaml
groups:
  - name: slo:checkout-service:recording
    interval: 30s
    rules:
      # Good requests: 2xx, latency < 500ms (combine availability + latency SLI)
      - record: slo:http_requests_good:rate5m
        labels: { service: checkout-service }
        expr: |
          sum(rate(http_requests_total{
            service="checkout-service",
            status=~"2.."
          }[5m]))
          # For latency SLI, intersect with bucket:
          # sum(rate(http_request_duration_seconds_bucket{
          #   service="checkout-service", le="0.5"}[5m]))

      - record: slo:http_requests_total:rate5m
        labels: { service: checkout-service }
        expr: |
          sum(rate(http_requests_total{service="checkout-service"}[5m]))

      # SLI ratio (5m window)
      - record: slo:http_availability:ratio_rate5m
        labels: { service: checkout-service }
        expr: |
          slo:http_requests_good:rate5m{service="checkout-service"}
          / slo:http_requests_total:rate5m{service="checkout-service"}

      # Pre-compute multiple windows for burn rate alerts
      - record: slo:http_availability:ratio_rate30m
        labels: { service: checkout-service }
        expr: |
          sum(rate(http_requests_total{service="checkout-service",status=~"2.."}[30m]))
          / sum(rate(http_requests_total{service="checkout-service"}[30m]))

      - record: slo:http_availability:ratio_rate1h
        labels: { service: checkout-service }
        expr: |
          sum(rate(http_requests_total{service="checkout-service",status=~"2.."}[1h]))
          / sum(rate(http_requests_total{service="checkout-service"}[1h]))

      - record: slo:http_availability:ratio_rate6h
        labels: { service: checkout-service }
        expr: |
          sum(rate(http_requests_total{service="checkout-service",status=~"2.."}[6h]))
          / sum(rate(http_requests_total{service="checkout-service"}[6h]))

      - record: slo:http_availability:ratio_rate1d
        labels: { service: checkout-service }
        expr: |
          sum(rate(http_requests_total{service="checkout-service",status=~"2.."}[1d]))
          / sum(rate(http_requests_total{service="checkout-service"}[1d]))

      - record: slo:http_availability:ratio_rate28d
        labels: { service: checkout-service }
        expr: |
          sum_over_time(slo:http_availability:ratio_rate5m{service="checkout-service"}[28d])
          / (28 * 24 * 12)   # 12 samples/hour × 24h × 28d
```

### Step 2: Multi-Window Burn Rate Alerts

```yaml
  - name: slo:checkout-service:alerts
    rules:
      # ── Fast burn (1h + 5m windows, 14.4× rate) ──────────────────
      # Consumes 2% of 28d budget in 1h → page immediately
      - alert: CheckoutSLOFastBurn
        expr: |
          (slo:http_availability:ratio_rate1h{service="checkout-service"} < (1 - 14.4 * 0.005))
          and
          (slo:http_availability:ratio_rate5m{service="checkout-service"} < (1 - 14.4 * 0.005))
        for: 2m
        labels:
          severity: critical
          service: checkout-service
          slo: availability-99.5
        annotations:
          summary: "Checkout SLO fast burn — error rate > 14.4× baseline"
          description: "1h availability: {{ $value | humanizePercentage }}. Budget burning rapidly."
          runbook_url: "https://runbooks.internal/checkout-slo-fast-burn"

      # ── Slow burn (6h + 30m windows, 6× rate) ────────────────────
      # Consumes 5% of 28d budget in 6h → ticket, fix in business hours
      - alert: CheckoutSLOSlowBurn
        expr: |
          (slo:http_availability:ratio_rate6h{service="checkout-service"} < (1 - 6 * 0.005))
          and
          (slo:http_availability:ratio_rate30m{service="checkout-service"} < (1 - 6 * 0.005))
        for: 15m
        labels:
          severity: warning
          service: checkout-service
          slo: availability-99.5
        annotations:
          summary: "Checkout SLO slow burn — error rate > 6× baseline"
          runbook_url: "https://runbooks.internal/checkout-slo-slow-burn"

      # ── Budget exhaustion warning ─────────────────────────────────
      - alert: CheckoutSLOBudgetLow
        expr: |
          slo:http_availability:ratio_rate28d{service="checkout-service"}
          < (1 - 0.005 * 0.75)   # < 25% budget remaining
        for: 1h
        labels:
          severity: warning
          service: checkout-service
        annotations:
          summary: "Checkout error budget < 25% remaining for this month"
          runbook_url: "https://runbooks.internal/checkout-error-budget"
```

### Step 3: Sloth (generate from YAML spec)

```yaml
# slo/checkout-service.yaml
version: "prometheus/v1"
service: checkout-service
labels: { team: backend, tier: "1" }
slos:
  - name: requests-availability
    objective: 99.5
    description: "99.5% of checkout requests succeed"
    sli:
      events:
        error_query: |
          sum(rate(http_requests_total{
            service="checkout-service",
            status=~"5.."}[{{.window}}]))
        total_query: |
          sum(rate(http_requests_total{
            service="checkout-service"}[{{.window}}]))
    alerting:
      name: CheckoutServiceAvailability
      page_alert:
        labels: { severity: critical }
        annotations:
          runbook_url: https://runbooks.internal/checkout-availability
      ticket_alert:
        labels: { severity: warning }
```

```bash
# Generate Prometheus rules + alerts from Sloth spec
sloth generate -i slo/checkout-service.yaml -o rules/slo-checkout-generated.yaml
# Produces: recording rules for all windows + multi-window burn rate alerts
```

### Step 4: Error Budget Dashboard (Grafana)

```promql
-- Current error budget remaining (percent of 28d budget)
(
  sum_over_time(slo:http_availability:ratio_rate5m{service="checkout-service"}[28d])
  / (28 * 24 * 12)
  - (1 - 0.005)
)
/ 0.005 * 100

-- Hours of budget remaining at current burn rate
(
  (slo:http_availability:ratio_rate28d{service="checkout-service"} - (1 - 0.005))
  / 0.005
) * 28 * 24
```

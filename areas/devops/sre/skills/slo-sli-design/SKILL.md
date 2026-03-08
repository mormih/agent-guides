---
name: slo-sli-design
type: skill
description: Define SLIs, SLOs, and error budgets; implement burn rate alerts; integrate with Prometheus.
related-rules:
  - slo-policy.md
  - error-budget-policy.md
allowed-tools: Read, Write, Edit
---

# Skill: SLO/SLI Design

> **Expertise:** SLI selection, SLO target setting, error budget calculation, burn rate alerting, Sloth/pyrra integration.

## When to load

When defining SLOs for a new service, setting up error budget tracking, or reviewing existing SLOs after an incident.

## SLI Selection Framework

```
Step 1: What does the user care about?
  → "The checkout completes successfully and quickly"

Step 2: What CAN we measure?
  → HTTP 2xx responses, p99 latency

Step 3: Define the SLI formula
  → Availability SLI: good_requests / total_requests
     where good = status < 500 AND latency < 500ms

Step 4: Pick SLO target (start conservative, tighten later)
  → 99.5% (don't chase 99.99% without data — high budget wasted on caution)

Step 5: Calculate error budget
  → 100% - 99.5% = 0.5% over 28 days = 0.5% × 28 × 24 × 60 = 201.6 minutes
```

## Prometheus SLO Implementation (manual)

```yaml
# Recording rules for SLO tracking
groups:
  - name: slo.checkout-service
    interval: 30s
    rules:
      # Good requests (2xx, latency < 500ms)
      - record: slo:http_requests_good:rate5m
        expr: |
          sum(rate(http_requests_total{
            service="checkout-service",
            status=~"2..",
            duration_bucket="0.5"
          }[5m]))

      # Total requests
      - record: slo:http_requests_total:rate5m
        expr: |
          sum(rate(http_requests_total{service="checkout-service"}[5m]))

      # SLI = good / total
      - record: slo:http_availability:ratio_rate5m
        expr: slo:http_requests_good:rate5m / slo:http_requests_total:rate5m

      # 28-day rolling availability
      - record: slo:http_availability:ratio_rate28d
        expr: |
          sum_over_time(slo:http_availability:ratio_rate5m[28d]) / (28 * 24 * 12)
```

## Burn Rate Alerts (multiwindow)

```yaml
# Multi-window, multi-burn-rate alerting (Google SRE Workbook pattern)
groups:
  - name: slo.checkout-service.burn-rate
    rules:
      # Fast burn: 14.4× rate (burns 1h of budget in 5 min)
      - alert: SLOFastBurn
        expr: |
          (
            slo:http_availability:ratio_rate1h{service="checkout-service"} < (1 - 14.4 * 0.005)
          ) and (
            slo:http_availability:ratio_rate5m{service="checkout-service"} < (1 - 14.4 * 0.005)
          )
        labels:
          severity: critical
          slo: checkout-service-availability
        annotations:
          summary: "Fast error budget burn — checkout-service (> 14.4× rate)"
          runbook_url: "https://runbooks.internal/slo-fast-burn"

      # Slow burn: 3× rate (burns 10% of budget in 6h)
      - alert: SLOSlowBurn
        expr: |
          (
            slo:http_availability:ratio_rate6h{service="checkout-service"} < (1 - 3 * 0.005)
          ) and (
            slo:http_availability:ratio_rate30m{service="checkout-service"} < (1 - 3 * 0.005)
          )
        labels:
          severity: warning
          slo: checkout-service-availability
        annotations:
          summary: "Slow error budget burn — checkout-service (> 3× rate)"
```

## Sloth (SLO as Code)

```yaml
# slo/checkout-service.yaml — Sloth generates all recording rules + alerts
version: "prometheus/v1"
service: checkout-service
labels:
  team: backend
slos:
  - name: requests-availability
    objective: 99.5
    description: "99.5% of checkout requests succeed with latency < 500ms"
    sli:
      events:
        error_query: |
          sum(rate(http_requests_total{service="checkout-service", status=~"5.."}[{{.window}}]))
        total_query: |
          sum(rate(http_requests_total{service="checkout-service"}[{{.window}}]))
    alerting:
      name: CheckoutServiceSLO
      page_alert:
        labels: { severity: critical }
      ticket_alert:
        labels: { severity: warning }
```

```bash
# Generate Prometheus rules from Sloth definition
sloth generate -i slo/checkout-service.yaml -o prometheus-rules/slo-checkout.yaml
```

## Error Budget Dashboard (Grafana)

Key panels:
1. **SLI over 28 days** — current ratio vs SLO target line
2. **Error budget remaining** — percentage + time remaining (burn at current rate)
3. **Burn rate** — 1h, 6h, 1d, 7d windows
4. **Events causing budget consumption** — top error causes by count

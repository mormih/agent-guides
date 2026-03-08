# Rule: Alerting Standards

**Priority**: P1 — Alerts without runbooks are not deployed.

## Alert Quality Rules

1. **Every alert has a runbook** — `annotations.runbook_url` is mandatory.
2. **No alert fires without a human action** — if no one can do anything about it, it's not an alert (it's a dashboard).
3. **Alert on symptoms, not causes** — `HighErrorRate` is an alert; `HighCPU` is a warning unless it causes user impact.
4. **Severity classification**

   | Severity | Meaning | Response |
   |:---|:---|:---|
   | `critical` | User-facing outage or data loss risk | Page on-call immediately |
   | `warning` | Degraded but not broken; trending toward critical | Notify Slack; fix in business hours |
   | `info` | Informational; no action required | Dashboard only |

5. **`for:` duration** — critical alerts: `for: 2m`; warning alerts: `for: 10m`. Instant alerts cause false positives.
6. **Alert fatigue policy** — if an alert fires more than 3 times in a week without action → reduce sensitivity or fix root cause.

## Notification Routing (Alertmanager)

```yaml
route:
  group_by: [alertname, namespace]
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: slack-warning
  routes:
    - matchers: [severity="critical"]
      receiver: pagerduty-oncall
      continue: true
    - matchers: [severity="critical"]
      receiver: slack-critical
```

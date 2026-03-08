# Rule: Error Budget Policy

**Priority**: P1 — Error budget governs feature development velocity vs reliability investment.

## Error Budget States

| State | Budget remaining | Action |
|:---|:---|:---|
| 🟢 Healthy | > 50% | Normal development velocity |
| 🟡 Warning | 25–50% | Reliability work enters next sprint |
| 🔴 Freeze | < 25% | Feature freeze; only reliability fixes ship |
| ⛔ Exhausted | 0% | Mandatory postmortem; all features blocked until replenished |

## Freeze Rules

- Feature freeze requires: team-lead + product-owner sign-off.
- Reliability work during freeze: reduce MTTR, add chaos tests, improve monitoring.
- Exception for hotfixes (security, critical bugs) — requires VP Engineering approval.

## Error Budget Tracking

- Error budget burn rate alerts:
  - Fast burn (> 14.4× in 1h): page on-call → investigate immediately
  - Slow burn (> 3× over 6h): Slack alert → review in next stand-up
- Monthly error budget report published to Confluence/Notion.

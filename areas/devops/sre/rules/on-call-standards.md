# Rule: On-Call Standards

**Priority**: P1 — On-call engineers must be equipped and protected.

## On-Call Requirements

1. **Response times** — P0: 5 min; P1: 15 min; P2: 1h (business hours).
2. **On-call rotation** — maximum 1 week primary + 1 week secondary per engineer per month.
3. **Runbook coverage** — every alert that can page must have a runbook. No runbook = alert is demoted to warning until written.
4. **Tooling access** — on-call engineer has prod read + limited write access (rollback, scale, restart). Full access requires separate MFA.
5. **Escalation path** documented and tested quarterly.

## Incident Severity (align with platform)

| Severity | Definition | Response |
|:---|:---|:---|
| P0 | Complete outage; data loss | Immediate; all hands |
| P1 | Major feature broken; >25% users affected | 15 min; on-call + lead |
| P2 | Degraded; workaround available | 1h; business hours OK |
| P3 | Minor issue; no user impact | Next sprint |

## Toil Budget

- On-call toil (repetitive, automatable work) must not exceed 50% of on-call hours.
- Toil > 50% for 2 consecutive rotations → mandatory automation sprint.

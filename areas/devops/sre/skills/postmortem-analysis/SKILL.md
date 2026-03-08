---
name: postmortem-analysis
type: skill
description: Write blameless postmortems with 5-whys RCA, actionable follow-ups, and systematic prevention measures.
related-rules:
  - on-call-standards.md
allowed-tools: Read, Write
---

# Skill: Postmortem Analysis

> **Expertise:** Blameless culture, 5-whys root cause analysis, contributing factors, actionable items with owners and due dates.

## When to load

When writing a postmortem after a P0/P1 incident, reviewing a draft postmortem, or designing action items.

## Postmortem Template

```markdown
# Postmortem: [Service] — [Date] — [Severity]

**Status:** Draft / In Review / Complete
**Severity:** P0 / P1
**Duration:** [start] → [end] ([total duration])
**Impact:** [N users affected, revenue impact if known, SLO budget consumed: X minutes]
**Incident Commander:** [name]
**Authors:** [name(s)]

---

## Summary
[2–3 sentences: what broke, what caused it, what fixed it]

## Timeline (UTC)

| Time | Event |
|:---|:---|
| 14:22 | Alert fired: HighErrorRate on payment-service |
| 14:24 | On-call acknowledged; war room opened |
| 14:28 | Identified: error correlated with v2.4.1 deploy at 14:05 |
| 14:31 | Mitigation: helm rollback payment-service to revision 3 |
| 14:33 | Error rate returning to baseline |
| 14:40 | Resolved; monitoring |

## Root Cause Analysis (5-Whys)

**Symptom:** Payment service returning 502s at 4.2% rate

1. **Why?** → Upstream credit-card-service returning 503s
2. **Why?** → credit-card-service pods OOMKilled
3. **Why?** → Memory limit was 256Mi; new code path loaded full transaction history into memory
4. **Why?** → Code review missed memory complexity of the new query (no performance test)
5. **Why?** → No memory profiling step in CI; no load test in staging pipeline

**Root cause:** Insufficient memory limit combined with absent memory regression testing.

## Contributing Factors
- [ ] Memory limits not updated with new feature PR
- [ ] Staging environment has lower traffic than production (bug not triggered)
- [ ] No VPA recommendation visible to developers

## What Went Well
- On-call responded in 4 minutes (SLO: 5 min) ✅
- Rollback executed in 2 minutes ✅
- Status page updated within 10 minutes ✅

## What Went Poorly
- Memory issue not caught in staging
- Alert fired 17 minutes after deploy (too slow — alert `for: 2m` but high latency in detection)
- Runbook for OOMKilled did not include memory limit increase steps

## Action Items

| Action | Owner | Priority | Due |
|:---|:---|:---|:---|
| Add memory profiling step to CI (`memory-profiler`) | @dev-team | P1 | 2024-11-22 |
| Add k6 load test to staging pipeline (match prod traffic pattern) | @devops-team | P1 | 2024-11-29 |
| Add VPA in "Off" mode for all services → surface recommendations | @devops-team | P2 | 2024-12-06 |
| Update OOMKilled runbook with memory limit increase steps | @sre-team | P2 | 2024-11-20 |
| Reduce alert `for:` to 1m for payment-service | @sre-team | P3 | 2024-11-20 |

## SLO Impact
- Error budget consumed: 18 minutes (of 201.6 min / 28d budget)
- Budget remaining: 89.1%
- Budget state: 🟢 Healthy
```

## 5-Whys Facilitation Tips

1. **Start with the user-visible symptom**, not the technical failure.
2. **Each "why" must be something that could have been different** — avoid "because the code had a bug" (that's not actionable).
3. **Stop at organizational / process level** — usually why 4 or 5 reveals a missing process, test, or convention.
4. **Multiple root causes are OK** — most incidents have 2-3 contributing causes, not one.
5. **Blameless means systems-focused** — "the deployment process allowed an under-tested change" not "Alice didn't test well".

## Action Item Quality

| ❌ Weak | ✅ Strong |
|:---|:---|
| "Improve testing" | "Add k6 load test targeting payment endpoint to staging pipeline by Nov 29" |
| "Fix monitoring" | "Add HighMemoryUsage alert (> 80% of limit) with `for: 5m` by Nov 20" |
| "Be more careful" | "Add required checklist item in PR template: memory impact assessed for new DB queries" |
| "Investigate X" | "Timebox investigation to 2h; report findings in Slack #postmortems by Nov 21" |

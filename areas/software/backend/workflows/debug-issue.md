---
name: debug-issue
type: workflow
description: Resolve backend defects with reproducible diagnosis, fix, and verification.
inputs:
  - incident-or-bug-report
  - logs-metrics-traces
outputs:
  - verified-fix
  - root-cause-summary
roles-involved:
  - pm
  - team-lead
  - developer
  - qa
related-rules:
  - architecture.md
  - security.md
  - testing.md
uses-skills:
  - observability
  - troubleshooting
quality-gates:
  - issue reproducible before fix
  - fix verified by automated checks
  - root cause documented
---

## Steps

1. **Triage and impact classification** — Owner: `@pm` + `@team-lead`.
2. **Reproduce and isolate** — Owner: `@developer`.
3. **Fix implementation** — Owner: `@developer`.
4. **Verification and regression checks** — Owner: `@qa`.
5. **Technical review and closure** — Owner: `@team-lead`.

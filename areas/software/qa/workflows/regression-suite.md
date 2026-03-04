---
name: regression-suite
type: workflow
description: Execute and analyze regression suites for release confidence.
inputs:
  - environment
  - regression-scope
outputs:
  - regression-report
  - blocker-list
roles-involved:
  - qa
  - developer
  - team-lead
related-rules:
  - quality-gates.md
  - test-strategy.md
  - flakiness-policy.md
uses-skills:
  - e2e-patterns
  - test-pyramid
  - test-data-management
quality-gates:
  - no unresolved critical failures in selected scope
  - flaky test handling policy applied
---

## Steps

1. **Scope selection and environment readiness** — Owner: `@qa`.
2. **Suite execution and evidence capture** — Owner: `@qa`.
3. **Failure triage and fixes** — Owner: `@developer` + `@qa`.
4. **Risk review and release recommendation** — Owner: `@team-lead` + `@qa`.

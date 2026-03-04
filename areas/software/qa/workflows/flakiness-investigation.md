---
name: flakiness-investigation
type: workflow
description: Diagnose and eliminate flaky tests with reproducible evidence.
inputs:
  - flaky-test-target
  - ci-history
outputs:
  - flakiness-root-cause-report
  - stabilized-test-suite
roles-involved:
  - qa
  - developer
  - team-lead
related-rules:
  - flakiness-policy.md
  - test-strategy.md
uses-skills:
  - e2e-patterns
  - test-data-management
quality-gates:
  - root cause identified
  - stabilization confirmed by repeated runs
---

## Steps

1. **Collect failure signals and patterns** — Owner: `@qa`.
2. **Reproduce and classify root cause** — Owner: `@qa` + `@developer`.
3. **Implement stabilization fix** — Owner: `@developer`.
4. **Stress re-run and quarantine decision** — Owner: `@qa`.
5. **Policy review and closure** — Owner: `@team-lead`.

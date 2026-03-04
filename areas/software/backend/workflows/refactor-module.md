---
name: refactor-module
type: workflow
description: Safely refactor backend modules while preserving behavior and operability.
inputs:
  - refactor-goal
  - baseline-behavior
outputs:
  - refactored-module
  - behavior-parity-evidence
roles-involved:
  - team-lead
  - developer
  - qa
related-rules:
  - architecture.md
  - testing.md
uses-skills:
  - troubleshooting
  - observability
quality-gates:
  - no behavior regressions on critical flows
  - complexity reduced or maintainability improved
---

## Steps

1. **Refactor plan and boundaries** — Owner: `@team-lead`.
2. **Incremental refactor implementation** — Owner: `@developer`.
3. **Regression validation** — Owner: `@qa`.
4. **Review/fix loop** — Owner: `@team-lead` + `@developer` + `@qa`.
5. **Closure with parity report** — Owner: `@team-lead`.

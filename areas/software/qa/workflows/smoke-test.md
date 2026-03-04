---
name: smoke-test
type: workflow
description: Rapid post-change validation of critical user and system paths.
inputs:
  - target-environment
  - deployment-context
outputs:
  - smoke-result-summary
  - rollback-recommendation-if-needed
roles-involved:
  - qa
  - developer
  - team-lead
  - pm
related-rules:
  - quality-gates.md
  - test-strategy.md
  - test-data.md
uses-skills:
  - e2e-patterns
  - api-testing
quality-gates:
  - critical path checks complete
  - blocking failures escalated immediately
---

## Steps

1. **Prepare environment and test data** — Owner: `@qa`.
2. **Run critical smoke scenarios** — Owner: `@qa`.
3. **Assist with defect triage/fix** — Owner: `@developer`.
4. **Assess operational risk** — Owner: `@team-lead`.
5. **Communicate go/no-go** — Owner: `@pm` + `@qa`.

---
name: performance-audit
type: workflow
description: Execute performance testing and turn findings into actionable engineering work.
inputs:
  - target-endpoint-or-flow
  - test-type
  - slo-baseline
outputs:
  - performance-report
  - prioritized-remediation-plan
roles-involved:
  - qa
  - developer
  - team-lead
  - pm
related-rules:
  - quality-gates.md
  - test-strategy.md
uses-skills:
  - performance-testing
  - api-testing
quality-gates:
  - SLO regressions clearly identified
  - remediation actions assigned
---

## Steps

1. **Scenario definition and baseline alignment** — Owner: `@qa`.
2. **Load/stress execution and monitoring capture** — Owner: `@qa`.
3. **Bottleneck analysis and fix proposal** — Owner: `@developer` + `@qa`.
4. **Prioritization and delivery planning** — Owner: `@team-lead` + `@pm`.

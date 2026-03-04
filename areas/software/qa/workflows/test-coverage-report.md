---
name: test-coverage-report
type: workflow
description: Measure, analyze, and improve test coverage based on business risk.
inputs:
  - coverage-artifacts
  - threshold
outputs:
  - coverage-analysis-report
  - targeted-test-improvement-plan
roles-involved:
  - qa
  - developer
  - team-lead
related-rules:
  - quality-gates.md
  - test-strategy.md
uses-skills:
  - test-pyramid
  - test-data-management
quality-gates:
  - critical paths meet threshold
  - top uncovered risks have owners
---

## Steps

1. **Collect and compare coverage metrics** — Owner: `@qa`.
2. **Identify high-risk gaps** — Owner: `@qa` + `@team-lead`.
3. **Implement targeted tests/fixes** — Owner: `@developer` + `@qa`.
4. **Publish trend and action plan** — Owner: `@qa`.

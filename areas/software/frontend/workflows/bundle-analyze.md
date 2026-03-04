---
name: bundle-analyze
type: workflow
description: Analyze frontend bundle impact and define optimization actions.
inputs:
  - build-artifacts
  - baseline-metrics
outputs:
  - bundle-diff-report
  - optimization-backlog
roles-involved:
  - developer
  - qa
  - team-lead
related-rules:
  - performance.md
  - architecture.md
uses-skills:
  - performance-tuning
quality-gates:
  - budget regressions triaged
  - optimization actions prioritized
---

## Steps

1. **Generate and compare bundle metrics** — Owner: `@developer`.
2. **Validate measurement reliability** — Owner: `@qa`.
3. **Prioritize optimization candidates** — Owner: `@team-lead` + `@developer`.
4. **Publish report and next actions** — Owner: `@pm` (or `@team-lead`).

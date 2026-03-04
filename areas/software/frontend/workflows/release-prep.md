---
name: release-prep
type: workflow
description: Prepare frontend release through coordinated quality, performance, and product checks.
inputs:
  - release-scope
  - target-version
outputs:
  - release-readiness-decision
  - release-notes
roles-involved:
  - product-owner
  - pm
  - developer
  - qa
  - team-lead
related-rules:
  - quality.md
  - performance.md
  - accessibility.md
uses-skills:
  - performance-tuning
  - testing-patterns
quality-gates:
  - quality checks pass
  - accessibility/performance gates pass
  - release notes approved
---

## Steps

1. **Confirm release scope and success criteria** — Owner: `@product-owner` + `@pm`.
2. **Execute build/lint/test/perf checks** — Owner: `@developer`.
3. **Run regression + smoke verification** — Owner: `@qa`.
4. **Review go/no-go risks** — Owner: `@team-lead`.
5. **Publish release notes and decision** — Owner: `@pm` + `@product-owner`.

---
name: test-feature
type: workflow
description: Expand backend feature test coverage with traceable quality evidence.
inputs:
  - feature-scope
  - acceptance-criteria
outputs:
  - comprehensive-test-suite
  - quality-report
roles-involved:
  - qa
  - developer
  - team-lead
related-rules:
  - testing.md
  - architecture.md
uses-skills:
  - troubleshooting
  - database-modeling
quality-gates:
  - critical paths and failure paths covered
  - tests stable in CI
---

## Steps

1. **Coverage gap analysis** — Owner: `@qa`.
2. **Testability adjustments in code** — Owner: `@developer`.
3. **Automated test implementation** — Owner: `@qa` (+ `@developer` for shared ownership).
4. **Review of scenarios and assertions** — Owner: `@team-lead`.
5. **Stability run and reporting** — Owner: `@qa`.

---
name: visual-regression
type: workflow
description: Detect and triage unintended UI visual diffs before release.
inputs:
  - changed-ui-scope
  - baseline-snapshots
outputs:
  - visual-diff-report
  - approved-or-rejected-baseline-update
roles-involved:
  - developer
  - qa
  - designer
  - team-lead
related-rules:
  - quality.md
  - accessibility.md
  - performance.md
uses-skills:
  - testing-patterns
  - component-design
quality-gates:
  - critical diffs reviewed by designer
  - accepted diffs documented
---

## Steps

1. **Determine visual test scope** — Owner: `@developer`.
2. **Run capture and comparison suite** — Owner: `@qa`.
3. **Classify diffs (expected/unexpected)** — Owner: `@designer` + `@qa`.
4. **Fix or approve baseline updates** — Owner: `@developer` + `@designer`.
5. **Final gate decision** — Owner: `@team-lead`.

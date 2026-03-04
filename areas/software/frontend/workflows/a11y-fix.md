---
name: a11y-fix
type: workflow
description: Detect, fix, and validate accessibility issues for UI routes/components.
inputs:
  - target-route-or-component
outputs:
  - remediated-accessibility-issues
  - a11y-report
roles-involved:
  - designer
  - developer
  - qa
  - team-lead
related-rules:
  - accessibility.md
  - quality.md
uses-skills:
  - a11y-audit
  - testing-patterns
quality-gates:
  - no blocking WCAG A issues
  - keyboard and screen-reader critical paths validated
---

## Steps

1. **Audit and severity classification** — Owner: `@qa`.
2. **UX/content decision for ambiguous fixes** — Owner: `@designer`.
3. **Implement fixes** — Owner: `@developer`.
4. **Re-test and regression checks** — Owner: `@qa`.
5. **Final review and acceptance** — Owner: `@team-lead`.

---
name: scaffold-component
type: workflow
description: Create a reusable UI component with implementation, tests, and design alignment.
inputs:
  - component-request
  - design-system-context
outputs:
  - scaffolded-component
  - validation-evidence
roles-involved:
  - product-owner
  - designer
  - developer
  - qa
  - team-lead
related-rules:
  - architecture.md
  - quality.md
  - accessibility.md
uses-skills:
  - component-design
  - css-architecture
  - testing-patterns
quality-gates:
  - component API documented
  - tests and accessibility checks pass
---

## Steps

1. **Define component intent and acceptance criteria** — Owner: `@product-owner` + `@designer`.
2. **Design/system alignment** — Owner: `@designer`.
3. **Generate and implement component files** — Owner: `@developer`.
4. **Functional + accessibility verification** — Owner: `@qa`.
5. **Code review and merge readiness** — Owner: `@team-lead`.

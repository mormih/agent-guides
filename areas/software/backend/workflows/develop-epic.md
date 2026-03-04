---
name: develop-epic
type: workflow
description: Multi-iteration backend epic delivery with controlled milestones.
inputs:
  - epic-goals
  - prioritized-backlog
outputs:
  - incrementally-delivered-epic
  - decision-and-risk-log
roles-involved:
  - product-owner
  - pm
  - team-lead
  - developer
  - qa
related-rules:
  - architecture.md
  - data_access.md
  - security.md
  - testing.md
uses-skills:
  - api-design
  - async-processing
  - observability
  - troubleshooting
quality-gates:
  - each increment independently testable
  - integration and regression checks passed
  - epic acceptance criteria satisfied
---

## Steps

1. **Epic decomposition and milestone planning** — Owner: `@product-owner` + `@pm`.
2. **Architecture runway definition** — Owner: `@team-lead`.
3. **Increment implementation** — Owner: `@developer`.
4. **Increment verification** — Owner: `@qa`.
5. **Milestone review and replanning** — Owner: `@pm` + `@team-lead`.
6. **Final acceptance** — Owner: `@product-owner`.

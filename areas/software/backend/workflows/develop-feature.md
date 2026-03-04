---
name: develop-feature
type: workflow
description: End-to-end backend feature delivery workflow with SDLC handoffs.
inputs:
  - feature-request
  - acceptance-criteria
outputs:
  - delivered-feature
  - release-readiness-report
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
quality-gates:
  - scope and acceptance criteria approved
  - tests and quality checks pass
  - no unresolved blockers
---

## Steps

1. **Requirements and value framing** — Owner: `@product-owner` + `@pm`.
2. **Solution design and risk plan** — Owner: `@team-lead`.
3. **Implementation increments** — Owner: `@developer`.
4. **Verification and risk-based testing** — Owner: `@qa`.
5. **Review, fix, retest loop** — Owner: `@team-lead` + `@developer` + `@qa`.
6. **Acceptance and final reporting** — Owner: `@product-owner` + `@pm`.

---
name: create-endpoint
type: workflow
description: Implement a new API endpoint with explicit subagent ownership and quality gates.
inputs:
  - endpoint-scope
  - api-contract
  - non-functional-requirements
outputs:
  - production-ready-endpoint
  - tests-and-review-evidence
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
  - database-modeling
  - troubleshooting
quality-gates:
  - acceptance criteria verified
  - security and validation checks passed
  - automated tests green
---

## Steps

1. **Scope & contract** — Owner: `@product-owner` + `@pm`.
2. **Architecture review** — Owner: `@team-lead`.
3. **Implement endpoint and data access** — Owner: `@developer`.
4. **Test design and execution** — Owner: `@qa`.
5. **Code review and sign-off** — Owner: `@team-lead`.
6. **Fix/retest loop** — Owner: `@developer` + `@qa`.
7. **Final acceptance report** — Owner: `@product-owner` + `@pm`.

For each step produce: inputs, action, artifacts, and handoff notes in the feature folder.

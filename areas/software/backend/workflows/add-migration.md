---
name: add-migration
type: workflow
description: Plan, implement, and validate safe schema migrations using expand/contract principles.
inputs:
  - schema-change-request
  - affected-services
outputs:
  - migration-artifacts
  - validation-report
roles-involved:
  - team-lead
  - developer
  - qa
related-rules:
  - data_access.md
  - architecture.md
  - testing.md
uses-skills:
  - database-modeling
  - troubleshooting
quality-gates:
  - forward migration validated
  - rollback/mitigation documented
  - no blocking compatibility risk
---

## Steps

1. **Risk and compatibility analysis** — Owner: `@team-lead`.
2. **Migration implementation** — Owner: `@developer`.
3. **Test DB validation and data checks** — Owner: `@qa`.
4. **Review and remediation loop** — Owner: `@team-lead` + `@developer`.
5. **Readiness report** — Owner: `@pm` (or `@team-lead` if PM absent).

# `agent-config` Domain Package: Backend Engineering

> **Version**: 1.0.0
> **Stack**: Python / Go / Node.js / Java / Rust (framework-agnostic)
> **Scope**: API services, domain logic, data access, asynchronous processing, observability, reliability

---

## Package Structure

```
agent-config/
└── backend/
    ├── rules/
    │   ├── architecture.md
    │   ├── data_access.md
    │   ├── security.md
    │   └── testing.md
    ├── skills/
    │   ├── api-design.md
    │   ├── database-modeling.md
    │   ├── async-processing.md
    │   ├── observability.md
    │   └── troubleshooting.md
    └── workflows/
        ├── develop-epic.md
        ├── develop-feature.md
        ├── create-endpoint.md
        ├── add-migration.md
        ├── test-feature.md
        ├── debug-issue.md
        └── refactor-module.md
```

---

## RULES (Kernel)

> Rules are **always active**. The agent must never violate these constraints.
> These are mandatory backend engineering decisions for every implementation.

---

### `rules/architecture.md`

# Rule: Architecture Boundaries

**Priority**: P0 — Boundary violations block merge.

## Constraints

1. **Layered/Clean architecture is mandatory**: Keep domain logic independent from transports (HTTP/gRPC), storage, and framework internals.
2. **Explicit module boundaries**: Cross-module interaction only through stable interfaces/contracts. No hidden coupling through shared mutable state.
3. **Idempotent write flows**: Retryable operations (payments, order creation, webhook handlers, queue consumers) must be idempotent.
4. **No transport leakage into domain**: DTOs, request context, HTTP status, and framework exceptions cannot be used in domain services.
5. **Failure-aware design**: External calls must define timeout, retry policy, and fallback behavior.

## Verification

- Architecture docs or PR notes must identify affected boundaries.
- New/changed services must include contract tests for inter-service integration.

---

### `rules/data_access.md`

# Rule: Data Access Discipline

**Priority**: P0 — Data correctness and performance are non-negotiable.

## Constraints

1. **No N+1 queries**: Load related entities with joins, eager loading, or batching strategies.
2. **Transactional integrity**: Multi-step writes that must succeed atomically require explicit transactions.
3. **Backward-compatible migrations first**: Expand → migrate data/code → contract. No destructive migration in same rollout.
4. **Index-aware development**: Any new query path on medium/high cardinality fields must include index plan.
5. **Pagination is required**: List APIs over unbounded datasets must use cursor/offset pagination with stable sort.
6. **Concurrency control**: Use optimistic or pessimistic locking where race conditions can violate invariants.

## Verification

- Query plans (`EXPLAIN`) must be reviewed for critical endpoints/jobs.
- Migration plan must include rollout and rollback steps.

---

### `rules/security.md`

# Rule: Secure by Default

**Priority**: P0 — Security violations block release.

## Constraints

1. **Validate all untrusted input** at system boundaries (API, message bus, cron payload, file ingest).
2. **Authenticate and authorize every protected action**; deny by default when policy is absent.
3. **Least-privilege everywhere**: DB roles, IAM policies, service accounts, and queue permissions must be minimal.
4. **No secrets in code/logs/errors**: Secrets must come from secure stores and be redacted in logs/telemetry.
5. **Safe error handling**: Return sanitized client errors; keep stack traces/internal details out of user-facing responses.
6. **OWASP-first implementation**: Explicitly mitigate injection, broken access control, and insecure deserialization classes of bugs.

## Verification

- Security checks (linters/scanners) must pass.
- PR must include authN/authZ and sensitive-data handling notes for changed endpoints.

---

### `rules/testing.md`

# Rule: Testing Pyramid Enforcement

**Priority**: P0 — Untested changes cannot be promoted.

## Constraints

1. **Test pyramid is mandatory**: Emphasize unit tests, add integration tests for boundaries, and E2E for critical flows.
2. **Tests ship with code**: Features/bug fixes without tests are incomplete.
3. **Deterministic and isolated tests**: No order dependency, hidden global state, or flaky time/network assumptions.
4. **Behavior over implementation details**: Test observable outcomes and contracts.
5. **Regression tests for incidents**: Every production incident fix must include a reproducible regression test.

## Verification

- Changed behavior must be mapped to explicit test coverage.
- CI gates for tests must pass before merge.

---

## SKILLS (Libraries)

> Skills are **loaded on demand** according to task semantics.
> Load only what is needed for the active task to keep context compact and execution precise.

---

### `skills/api-design.md`

# Skill: API Design

## When to load

When creating/updating REST/gRPC contracts, status code strategy, versioning, or error models.

## Focus

- Resource-oriented API boundaries
- Contract-first changes
- Backward compatibility and deprecation policy
- Consistent error envelope and validation semantics

---

### `skills/database-modeling.md`

# Skill: Database Modeling

## When to load

When designing schema changes, indexes, partitioning, query optimization, and data lifecycle.

## Focus

- Entity relationships and normalization trade-offs
- OLTP vs analytics access patterns
- Index and query plan validation
- Safe migration sequencing

---

### `skills/async-processing.md`

# Skill: Async Processing

## When to load

When implementing queues/events, worker pipelines, retries, dead-letter queues, and outbox patterns.

## Focus

- At-least-once delivery safety
- Idempotent consumers
- Retry/backoff and DLQ policies
- Event schema governance

---

### `skills/observability.md`

# Skill: Observability

## When to load

When instrumenting metrics/logs/traces, defining SLOs, and building operational dashboards/alerts.

## Focus

- RED metrics for APIs
- Structured logging with correlation IDs
- Distributed tracing across boundaries
- Actionable alerts and runbooks

---

### `skills/troubleshooting.md`

# Skill: Troubleshooting

## When to load

When triaging incidents, debugging performance regressions, or conducting RCA.

## Focus

- Hypothesis-driven debugging
- Fast narrowing by signals (metrics/logs/traces)
- Minimal-risk fix strategy
- Post-incident prevention actions

---

## WORKFLOWS (Execution)

> Choose **one primary workflow** before implementation and explicitly state it in the response.

- Large initiative / system redesign → `workflows/develop-epic.md`
- Feature delivery → `workflows/develop-feature.md`
- Endpoint implementation/update → `workflows/create-endpoint.md`
- Schema migration rollout → `workflows/add-migration.md`
- Test design and hardening → `workflows/test-feature.md`
- Incident triage and remediation → `workflows/debug-issue.md`
- Legacy decomposition/refactor → `workflows/refactor-module.md`

---

## Execution Contract

Before coding:
1. Declare selected workflow.
2. List active rules impacted by the task.
3. List loaded skills and why.
4. Provide implementation plan and risk list.

After coding:
1. Provide exact verification commands and outcomes.
2. Summarize architecture/data/security impact.
3. Include migration/rollback notes if applicable.
4. Document observability and test coverage changes.

---

## Source references

- Rules: `rules/*.md`
- Skills: `skills/*/SKILL.md`
- Workflows: `workflows/*.md`
- Prompts: `prompts/*.md`

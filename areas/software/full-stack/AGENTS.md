# `agent-config` Domain Package: Full-Stack Engineering

> **Version**: 1.0.0
> **Stack**: Python / TypeScript / FastAPI / React / PostgreSQL / CI/CD
> **Scope**: End-to-end product delivery (architecture, backend, API, frontend integration, testing, release)

---

## Package Structure

```
agent-config/
└── full-stack/
    ├── rules/
    │   ├── api-design-guide.md
    │   ├── async-concurrency-guide.md
    │   ├── backend-architecture-rule.md
    │   ├── background-jobs-guide.md
    │   ├── ci-cd-deployment-guide.md
    │   ├── code-quality-guide.md
    │   ├── code-style-guide.md
    │   ├── database-access-guide.md
    │   ├── database-migrations-guide.md
    │   ├── domain-models-guide.md
    │   ├── e2e-test-guide.md
    │   ├── env-settings-guide.md
    │   ├── error-handling-guide.md
    │   ├── git-versioning-guide.md
    │   ├── logging-observability-guide.md
    │   ├── project-guide.md
    │   ├── project-setup-guide.md
    │   ├── python-venv-guide.md
    │   ├── security-guide.md
    │   ├── svt-test-guide.md
    │   ├── testing-ci-guide.md
    ├── skills/
    │   ├── ... (selected files listed below)
    └── workflows/
        ├── backend-project-full-cycle.md
        ├── feature-implementation-flow.md
        ├── testing-ci-pipeline.md
```

---

## RULES (Kernel)

---

### `rules/api-design-guide.md`

---
trigger: model_decision
glob: api-design-guide
description: API contracts must be explicit, validated, and versioned
---

# API Design Rule

**Rules:**

- Use Pydantic for request/response validation; enforce strict types, no raw dicts.
- Implement `/liveness` and `/readiness` for K8s probes.
- Implement `/metrics` for FastAPI using PrometheusMiddleware.
- Version APIs in path or headers (v1, v2…).
- Sanitize input; output must be explicit.
- Document all endpoints with OpenAPI/Swagger.
- No side effects in GET requests.
- Responses must include status codes and error details.

**Violations:**

- API schemas are implicit.
- Validation is ad-hoc.
- Endpoints mutate state unexpectedly.

---

### `rules/async-concurrency-guide.md`

---
trigger: model_decision
glob: async-concurrency-guide
description: isolate async code, use tasks safely
---

# Async & Concurrency Rule

**Rules:**

- Isolate async/TaskGroup logic from sync code.
- Do not block event loop with heavy computation.
- Catch only expected exceptions in async tasks.
- Ensure idempotency for retried tasks.
- Implement logic to debug event loop delays.

**Violations:**

- Async tasks share mutable state.
- Root Exception is caught.
- Tasks are non-idempotent.

---

### `rules/backend-architecture-rule.md`

---
trigger: always_on
glob: backend-architecture-rule
description: enforce layered architecture and dependency rules for backend services
---

# Backend Architecture Rule

**Goal:** Maintain clean separation of concerns and testability.

**Layers:**

1.  **API Layer (Entry Points):**
    - Handles HTTP requests, websocket events, or CLI commands.
    - Validates input using Pydantic schemas.
    - Calls Service Layer.
    - **Allowed Imports:** Service Layer, Schemas.
    - **Forbidden Imports:** Repository Layer, direct DB access.

2.  **Service Layer (Business Logic):**
    - Contains pure business logic and orchestration.
    - Transaction boundaries are defined here.
    - **Allowed Imports:** Repository Layer, Schemas, Domain Models.
    - **Forbidden Imports:** API Layer, frameworks (FastAPI/Flask) specific objects.

3.  **Repository Layer (Data Access):**
    - Abstracts database queries and external service calls.
    - Returns Domain Models or Pydantic Schemas.
    - **Allowed Imports:** Domain Models, Database Drivers (SQLAlchemy/AsyncPG).
    - **Forbidden Imports:** API/Service Layers.

4.  **Domain Models / Schemas:**
    - Pure data structures.
    - **Allowed Imports:** None (should be dependency-free).

**Violations:**

- API layer directly accessing database.
- Service layer returning SQLAlchemy models directly (leaking implementation details).
- Circular dependencies between layers.
- Business logic inside API handlers.

---

### `rules/background-jobs-guide.md`

---
trigger: model_decision
glob: background-jobs-guide
description: manage background tasks safely and reliably
---

# Background Jobs Rule

**Rules:**

- Use queues for async jobs (Celery, RQ, etc.).
- Ensure idempotency for retried jobs.
- Log errors and metrics for each task.
- Limit concurrency and handle exceptions explicitly.

**Violations:**

- Jobs are non-idempotent.
- Exceptions crash the worker.
- No logging/metrics for task execution.

---

### `rules/ci-cd-deployment-guide.md`

---
trigger: always_on
glob: ci-cd-deployment-guide
description: enforce testing, docker, and deployment standards
---

# CI/CD & Deployment Rule

**Rules:**

- Run unit/integration tests before merging.
- Automate migrations, version bumps, changelog updates.
- Implement build & deploy commands in the project's build system (e.g., Makefile).
- Use Docker/K8s for consistent environments.
- Docker setup must include Dockerfile and orchestration (e.g. docker-compose.yml) with all used services described.

**Violations:**

- Code merges bypass tests.
- Migration/version updates are manual.
- Deployment is environment-specific.
- Missing or incomplete Docker setup.

---

### `rules/code-quality-guide.md`

---
trigger: always_on
glob: code-quality-guide
description: enforce code formatting, linting, and static typing after code changes
---

# Code Quality Rule

**Rules:**

- After writing or modifying code, always run formatters and linters.
- Execute formatting tools and fix all formatting issues.
- Execute linting tools and fix all lint/type errors until passed.
- For Python projects, use standard tools (e.g. `ruff`, `black`, `mypy`) via the project's dependency manager.
- All tools must be installed and run inside the project's virtual environment.

**Violations:**

- Skipping formatting or linting.
- Ignoring formatter or linter errors.
- Running tools outside the virtual environment.
- Missing standard quality tools in dependencies.

---

### `rules/code-style-guide.md`

---
trigger: always_on
glob: code-style-guide
description: readable, maintainable, and safe-to-automate code
---

# Code Style Rule

**Goal:** readable, predictable, safe to automate, cheap to delete.

**Rules:**

- Follow language/framework conventions; keep it simple (KISS).
- Centralize config; use polymorphism over conditionals; isolate async/multithreading.
- Use dependency injection; follow Law of Demeter.
- Be consistent: names, formatting, boundary encapsulation.
- Functions: do one thing, ≤10 lines, few args, no side effects/flags.
- Replace magic numbers with constants; keep related code together.
- Catch specific exceptions; never base Exception; explain intent.
- Tests: readable, fast, isolated, repeatable; 1 assertion per test.
- Standards: strict type hints, Pydantic for models, external APIs via `tools/`.

**Violations:** rigidity, fragility, duplication, hidden execution order, complexity.

---

### `rules/database-access-guide.md`

---
trigger: model_decision
glob: database-access-guide
description: safe, efficient, maintainable DB access.
---

# Database Access Rule

**Purpose:** Safe, efficient, maintainable DB access.

**Rules:**

- Use repository/DAO layer; no direct DB calls in business logic.
- Prefer ORM; raw SQL only if necessary, always parameterized.
- Batch queries; avoid N+1 problems.
- Use caching carefully; keep invalidation consistent.
- Use separate schema per project.
- Run `EXPLAIN` for complex queries; save in `sqlplans`.

**Violations:**

- Unsafe SQL or in business logic.
- Repeated queries/N+1 issues.
- Mutable DB state leaks outside DAL.

---

### `rules/database-migrations-guide.md`

---
trigger: model_decision
glob: database-migrations-guide
description: all DB schema changes must be explicit, versioned, and testable via Alembic
---

# Database & Migration Rule

**Goal:** schema changes must be explicit, versioned, traceable, and tested.

**Rules:**

- Use **Alembic** for all schema changes; never rely only on ORM metadata or manual SQL.
- Each change in a migration script with upgrade/downgrade; idempotent if possible; consistent naming/versioning.
- Include tables, columns, indexes, constraints, relationships explicitly.
- Tests must apply migrations to clean DB and validate structure & integrity (Postgres & SQLite if supported).
- Avoid destructive ops without backup; group related changes; keep scripts small; document dependencies/order.

**Violations:**

- Schema changes outside Alembic.
- Missing tests or incomplete upgrade/downgrade.
- Hardcoded schema in code.
- Drift between environments.

---

### `rules/domain-models-guide.md`

---
trigger: model_decision
glob: domain-models-guide
description: ensure strong, explicit, validated domain models
---

# Domain Models Rule

**Goal:** all domain data must be explicit, validated, and modeled.

**Rules:**

- No raw data flows; every domain concept must have a model.
- **Pydantic mandatory** for domain models, I/O contracts, config, validation.
- **SQLModel mandatory** for database models.
- Validation logic lives inside models; models are explicit, strongly typed.
- Prefer value objects over primitives when meaning or validation exists.
- Explicit fields/types only; no dynamic fields, magic defaults, or hybrid models.
- Serialization explicit; no dict spreading, no leaking internal structure.

**Violations:**

- Raw dicts between layers.
- Validation outside models.
- Optional fields “just in case”.
- Models depend on infrastructure.
- Silent coercion of invalid data.
- Pydantic bypassed or inconsistent.

---

### `rules/e2e-test-guide.md`

---
trigger: always_on
glob: e2e-test-guide
description: enforce full blackbox end-to-end testing after code & unit tests
---

# Rule — E2E Test

**Purpose:** Verify all business logic in full scenarios.

- Launch services via Docker.
- Feed input data/files.
- Call APIs to run the complete workflow.
- Verify output matches expected results.
- Run via Makefile: `make e2e-test`.
- Must **not** be confused with unit tests.

**Violations:** Missing E2E test, logs contain errors, output incorrect.

---

### `rules/env-settings-guide.md`

---
trigger: always_on
glob: env-settings-guide
description: enforce DSN-based configuration via Pydantic BaseSettings
---

# Environment & DSN Settings Rule

**Rules:**

- All service connections (DB, cache, brokers, APIs) MUST use **DSN variables**.
- Use a single DSN env var instead of splitting config into `USER/HOST/DB`.
- All configuration MUST be defined via Pydantic `BaseSettings`.
- Parsing, validation, and defaults live inside the Settings model only.

### Environment Files

- `.env.example` MUST exist and be kept up to date.
- `.env.example` MUST contain **test / placeholder credentials only**.
- `.env` MUST contain **real (production or local) credentials**.
- `.env` MUST be listed in `.gitignore`.
- `docker-compose.yml` MUST explicitly load `.env`.

**Examples:**

- ✅ `DATABASE_DSN=postgresql+asyncpg://test_user:test_pass@localhost:5432/app`
- ❌ `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`

**Violations:**

- Real credentials inside `.env.example`.
- Splitting DSN into multiple env variables.
- Accessing env vars outside `BaseSettings`.
- Missing `.env.example` or docker-compose env loading.

---

### `rules/error-handling-guide.md`

---
trigger: model_decision
glob: error-handling-guide
description: explicit exception management and retry policies
---

# Error Handling Rule

**Rules:**

- Catch specific exceptions only; never base Exception.
- Retry with backoff for transient failures.
- Use circuit breakers for external calls.
- Log errors with context; propagate critical exceptions.

**Violations:**

- Root Exception is caught.
- Retries missing for transient errors.
- Critical failures are silenced.

---

### `rules/git-versioning-guide.md`

---
trigger: always_on
glob: git-versioning-guide
description: enforce traceable git history, versioning, and automated validation
---

# Git & Versioning Rule

**Rules:**

- Use dedicated feature branch per Task; branch name includes Task ID.
- Direct commits to main/master forbidden; merge only after all checks pass.
- Update `CHANGELOG.md` with Task ID and semantic version.
- For python projects: Bump version in `pyproject.toml`; follow semantic versioning (major.minor.patch).
- `.pre-commit-config.yaml` mandatory; hooks run before commit (format, lint, unit tests); failing commits rejected.
- Maintain `.gitignore`/`.dockerignore`; ignore `.*` and `__*__`.

**Violations:**

- Commits without Task context.
- Missing changelog or version bump.
- Bypassing pre-commit hooks.
- Unverified or failing commits.

---

### `rules/logging-observability-guide.md`

---
trigger: model_decision
glob: logging-observability-guide
description: structured logging, metrics, and error context
---

# Logging & Observability Rule

**Rules:**

- Use structured logs (JSON or similar) with timestamps, context, Task IDs, user IDs.
- Avoid logging secrets or PII.
- Log errors with stack trace and actionable info.
- Use loguru for Python projects (from loguru import logger)
- Emit metrics for key events and performance.

**Violations:**

- Logs are free text only.
- Used print or default python logger in code
- Sensitive info is logged.
- Metrics or errors lack context.

---

### `rules/project-guide.md`

---
trigger: always_on
glob: project-guide
description: agent execution rules and project workflow
---

# Project Directive

**Core Principle:** Artifact First

- Non-trivial tasks start with artifacts; no immediate coding.

**Artifact Protocol:**

- Plan first: `artifacts/plan_<task_id>.md`
- Evidence: test logs in `artifacts/logs/`
- UI changes: `Generates Artifact: Screenshot`

**Mission & Context:**

- Read `mission.md` before work.
- Review full `src/` tree before architecture.

**Agent Behavior:**

- Confirm full plan before execution.
- Optimize code for AI readability & context efficiency.
- Prefer explicit structure to implicit behavior.

**Execution Safety:**

- Run tests after logic changes.
- Browser only for read-only verification.
- Never execute destructive system commands.

---

### `rules/project-setup-guide.md`

---
trigger: always_on
glob: project-setup-guide
description: Ensure new projects have a standard Makefile
---

# Project Setup Rule

**Rules:**

- Every new project **must include a README.md**
- Every new project **must include a src directory** for code files:
- Every new project **must include a Makefile** with standard targets:
    - `install`, `run-service`, `test-unit`, `test-e2e`, `migrate`, `format`, `lint`
- Makefile should support local development, CI pipeline, and service startup
- Include documentation on how to run each target
- Ensure Makefile works out-of-the-box after project creation

**Violations:**

- Missing Makefile
- Makefile lacks required targets
- Makefile does not run commands correctly

---

### `rules/python-venv-guide.md`

---
trigger: glob
glob: python-venv-guide
globs: *.py
description: enforce Python 3, virtual environments, and Poetry for dependency management
---

# Python Venv & Poetry Rule

**Rules:**

- Use Python 3 in a project-specific venv (`.venv_projectname`).
- Activate venv before running code/tests.
- Initialize project structure with `src/` directory and place all code files inside it.
- Install and manage all dependencies via Poetry (`poetry add/install/update`).
- Commit `pyproject.toml` and `poetry.lock`.
- Ignore `.venv_projectname/` in Git.

**Violations:**

- Running code outside venv.
- Installing packages globally.
- Not using Poetry for dependency management.

---

### `rules/security-guide.md`

---
trigger: model_decision
glob: security-guide
description: enforce secrets handling, input validation, and least privilege
---

# Security Rule

**Rules:**

- Never hardcode secrets or credentials.
- Validate all external input (API, DB, files).
- Use Bearer Auth in headers.
- Apply the least privilege for DB, API, files.
- Encrypt sensitive data in transit and at rest.
- Audit and sanitize logs to avoid secrets leakage.

**Violations:**

- Raw secrets in code.
- Unvalidated user input.
- Elevated privileges without justification.

---

### `rules/svt-test-guide.md`

---
trigger: always_on
glob: svt-test-guide
description: enforce simultaneous user/system tests on simplified data
---

# Rule — SVT Test

**Purpose:** Verify system stability under concurrent usage.

- Run N users/systems on simple data.
- Simulate load (e.g., Locust for FastAPI).
- Check outputs and service logs.
- Run via Makefile: `make svt-test`.
- Must **not** be confused with unit tests.

**Violations:** Missing SVT test, logs contain errors, concurrency failures.

---

### `rules/testing-ci-guide.md`

---
trigger: always_on
glob: testing-ci-guide
description: enforce unit, integration, and e2e testing with formatting and deployment checks
---

# Testing & CI Rule

**Rules:**

- Every new code file must have a corresponding unit test file.
- Run formatting & linting and fix until passed.
- Run unit tests and ensure coverage meets the required threshold (default ≥70%). Add tests for positive/negative scenarios.
- Start dependent services and ensure logs are clean.
- Apply migrations without errors.
- Develop blackbox e2e-test with input data; full API scenario must pass.

**Violations:**

- Missing unit tests.
- Coverage below threshold.
- Format/lint errors not fixed.
- Service logs contain errors.
- Migrations fail.
- E2E test fails.

---

## SKILLS (Libraries)

---

### `skills/api-design-principles/SKILL.md`

---
name: api-design-principles
description: Master REST and GraphQL API design principles to build intuitive, scalable, and maintainable APIs that delight developers. Use when designing new APIs, reviewing API specifications, or establishing API design standards.
---

# API Design Principles

Master REST and GraphQL API design principles to build intuitive, scalable, and maintainable APIs that delight developers and stand the test of time.

## Use this skill when

- Designing new REST or GraphQL APIs
- Refactoring existing APIs for better usability
- Establishing API design standards for your team
- Reviewing API specifications before implementation
- Migrating between API paradigms (REST to GraphQL, etc.)
- Creating developer-friendly API documentation
- Optimizing APIs for specific use cases (mobile, third-party integrations)

## Do not use this skill when

- You only need implementation guidance for a specific framework
- You are doing infrastructure-only work without API contracts
- You cannot change or version public interfaces

## Instructions

1. Define consumers, use cases, and constraints.
2. Choose API style and model resources or types.
3. Specify errors, versioning, pagination, and auth strategy.
4. Validate with examples and review for consistency.

Refer to `resources/implementation-playbook.md` for detailed patterns, checklists, and templates.

## Resources

- `resources/implementation-playbook.md` for detailed patterns, checklists, and templates.

---

### `skills/api-patterns/SKILL.md`

---
name: api-patterns
description: API design principles and decision-making. REST vs GraphQL vs tRPC selection, response formats, versioning, pagination.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# API Patterns

> API design principles and decision-making for 2025.
> **Learn to THINK, not copy fixed patterns.**

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check the content map, find what you need.

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `api-style.md` | REST vs GraphQL vs tRPC decision tree | Choosing API type |
| `rest.md` | Resource naming, HTTP methods, status codes | Designing REST API |
| `response.md` | Envelope pattern, error format, pagination | Response structure |
| `graphql.md` | Schema design, when to use, security | Considering GraphQL |
| `trpc.md` | TypeScript monorepo, type safety | TS fullstack projects |
| `versioning.md` | URI/Header/Query versioning | API evolution planning |
| `auth.md` | JWT, OAuth, Passkey, API Keys | Auth pattern selection |
| `rate-limiting.md` | Token bucket, sliding window | API protection |
| `documentation.md` | OpenAPI/Swagger best practices | Documentation |
| `security-testing.md` | OWASP API Top 10, auth/authz testing | Security audits |

---

## 🔗 Related Skills

| Need | Skill |
|------|-------|
| API implementation | `@[skills/backend-development]` |
| Data structure | `@[skills/database-design]` |
| Security details | `@[skills/security-hardening]` |

---

## ✅ Decision Checklist

Before designing an API:

- [ ] **Asked user about API consumers?**
- [ ] **Chosen API style for THIS context?** (REST/GraphQL/tRPC)
- [ ] **Defined consistent response format?**
- [ ] **Planned versioning strategy?**
- [ ] **Considered authentication needs?**
- [ ] **Planned rate limiting?**
- [ ] **Documentation approach defined?**

---

## ❌ Anti-Patterns

**DON'T:**
- Default to REST for everything
- Use verbs in REST endpoints (/getUsers)
- Return inconsistent response formats
- Expose internal errors to clients
- Skip rate limiting

**DO:**
- Choose API style based on context
- Ask about client requirements
- Document thoroughly
- Use appropriate status codes

---

## Script

| Script | Purpose | Command |
|--------|---------|---------|
| `scripts/api_validator.py` | API endpoint validation | `python scripts/api_validator.py <project_path>` |

---

### `skills/api-patterns/api-style.md`

# API Style Selection (2025)

> REST vs GraphQL vs tRPC - Hangi durumda hangisi?

## Decision Tree

```
Who are the API consumers?
│
├── Public API / Multiple platforms
│   └── REST + OpenAPI (widest compatibility)
│
├── Complex data needs / Multiple frontends
│   └── GraphQL (flexible queries)
│
├── TypeScript frontend + backend (monorepo)
│   └── tRPC (end-to-end type safety)
│
├── Real-time / Event-driven
│   └── WebSocket + AsyncAPI
│
└── Internal microservices
    └── gRPC (performance) or REST (simplicity)
```

## Comparison

| Factor | REST | GraphQL | tRPC |
|--------|------|---------|------|
| **Best for** | Public APIs | Complex apps | TS monorepos |
| **Learning curve** | Low | Medium | Low (if TS) |
| **Over/under fetching** | Common | Solved | Solved |
| **Type safety** | Manual (OpenAPI) | Schema-based | Automatic |
| **Caching** | HTTP native | Complex | Client-based |

## Selection Questions

1. Who are the API consumers?
2. Is the frontend TypeScript?
3. How complex are the data relationships?
4. Is caching critical?
5. Public or internal API?

---

### `skills/api-patterns/auth.md`

# Authentication Patterns

> Choose auth pattern based on use case.

## Selection Guide

| Pattern | Best For |
|---------|----------|
| **JWT** | Stateless, microservices |
| **Session** | Traditional web, simple |
| **OAuth 2.0** | Third-party integration |
| **API Keys** | Server-to-server, public APIs |
| **Passkey** | Modern passwordless (2025+) |

## JWT Principles

```
Important:
├── Always verify signature
├── Check expiration
├── Include minimal claims
├── Use short expiry + refresh tokens
└── Never store sensitive data in JWT
```

---

### `skills/api-patterns/documentation.md`

# API Documentation Principles

> Good docs = happy developers = API adoption.

## OpenAPI/Swagger Essentials

```
Include:
├── All endpoints with examples
├── Request/response schemas
├── Authentication requirements
├── Error response formats
└── Rate limiting info
```

## Good Documentation Has

```
Essentials:
├── Quick start / Getting started
├── Authentication guide
├── Complete API reference
├── Error handling guide
├── Code examples (multiple languages)
└── Changelog
```

---

### `skills/api-patterns/graphql.md`

# GraphQL Principles

> Flexible queries for complex, interconnected data.

## When to Use

```
✅ Good fit:
├── Complex, interconnected data
├── Multiple frontend platforms
├── Clients need flexible queries
├── Evolving data requirements
└── Reducing over-fetching matters

❌ Poor fit:
├── Simple CRUD operations
├── File upload heavy
├── HTTP caching important
└── Team unfamiliar with GraphQL
```

## Schema Design Principles

```
Principles:
├── Think in graphs, not endpoints
├── Design for evolvability (no versions)
├── Use connections for pagination
├── Be specific with types (not generic "data")
└── Handle nullability thoughtfully
```

## Security Considerations

```
Protect against:
├── Query depth attacks → Set max depth
├── Query complexity → Calculate cost
├── Batching abuse → Limit batch size
├── Introspection → Disable in production
```

---

### `skills/api-patterns/rate-limiting.md`

# Rate Limiting Principles

> Protect your API from abuse and overload.

## Why Rate Limit

```
Protect against:
├── Brute force attacks
├── Resource exhaustion
├── Cost overruns (if pay-per-use)
└── Unfair usage
```

## Strategy Selection

| Type | How | When |
|------|-----|------|
| **Token bucket** | Burst allowed, refills over time | Most APIs |
| **Sliding window** | Smooth distribution | Strict limits |
| **Fixed window** | Simple counters per window | Basic needs |

## Response Headers

```
Include in headers:
├── X-RateLimit-Limit (max requests)
├── X-RateLimit-Remaining (requests left)
├── X-RateLimit-Reset (when limit resets)
└── Return 429 when exceeded
```

---

### `skills/api-patterns/response.md`

# Response Format Principles

> Consistency is key - choose a format and stick to it.

## Common Patterns

```
Choose one:
├── Envelope pattern ({ success, data, error })
├── Direct data (just return the resource)
└── HAL/JSON:API (hypermedia)
```

## Error Response

```
Include:
├── Error code (for programmatic handling)
├── User message (for display)
├── Details (for debugging, field-level errors)
├── Request ID (for support)
└── NOT internal details (security!)
```

## Pagination Types

| Type | Best For | Trade-offs |
|------|----------|------------|
| **Offset** | Simple, jumpable | Performance on large datasets |
| **Cursor** | Large datasets | Can't jump to page |
| **Keyset** | Performance critical | Requires sortable key |

### Selection Questions

1. How large is the dataset?
2. Do users need to jump to specific pages?
3. Is data frequently changing?

---

### `skills/api-patterns/rest.md`

# REST Principles

> Resource-based API design - nouns not verbs.

## Resource Naming Rules

```
Principles:
├── Use NOUNS, not verbs (resources, not actions)
├── Use PLURAL forms (/users not /user)
├── Use lowercase with hyphens (/user-profiles)
├── Nest for relationships (/users/123/posts)
└── Keep shallow (max 3 levels deep)
```

## HTTP Method Selection

| Method | Purpose | Idempotent? | Body? |
|--------|---------|-------------|-------|
| **GET** | Read resource(s) | Yes | No |
| **POST** | Create new resource | No | Yes |
| **PUT** | Replace entire resource | Yes | Yes |
| **PATCH** | Partial update | No | Yes |
| **DELETE** | Remove resource | Yes | No |

## Status Code Selection

| Situation | Code | Why |
|-----------|------|-----|
| Success (read) | 200 | Standard success |
| Created | 201 | New resource created |
| No content | 204 | Success, nothing to return |
| Bad request | 400 | Malformed request |
| Unauthorized | 401 | Missing/invalid auth |
| Forbidden | 403 | Valid auth, no permission |
| Not found | 404 | Resource doesn't exist |
| Conflict | 409 | State conflict (duplicate) |
| Validation error | 422 | Valid syntax, invalid data |
| Rate limited | 429 | Too many requests |
| Server error | 500 | Our fault |

---

### `skills/api-patterns/security-testing.md`

# API Security Testing

> Principles for testing API security. OWASP API Top 10, authentication, authorization testing.

---

## OWASP API Security Top 10

| Vulnerability | Test Focus |
|---------------|------------|
| **API1: BOLA** | Access other users' resources |
| **API2: Broken Auth** | JWT, session, credentials |
| **API3: Property Auth** | Mass assignment, data exposure |
| **API4: Resource Consumption** | Rate limiting, DoS |
| **API5: Function Auth** | Admin endpoints, role bypass |
| **API6: Business Flow** | Logic abuse, automation |
| **API7: SSRF** | Internal network access |
| **API8: Misconfiguration** | Debug endpoints, CORS |
| **API9: Inventory** | Shadow APIs, old versions |
| **API10: Unsafe Consumption** | Third-party API trust |

---

## Authentication Testing

### JWT Testing

| Check | What to Test |
|-------|--------------|
| Algorithm | None, algorithm confusion |
| Secret | Weak secrets, brute force |
| Claims | Expiration, issuer, audience |
| Signature | Manipulation, key injection |

### Session Testing

| Check | What to Test |
|-------|--------------|
| Generation | Predictability |
| Storage | Client-side security |
| Expiration | Timeout enforcement |
| Invalidation | Logout effectiveness |

---

## Authorization Testing

| Test Type | Approach |
|-----------|----------|
| **Horizontal** | Access peer users' data |
| **Vertical** | Access higher privilege functions |
| **Context** | Access outside allowed scope |

### BOLA/IDOR Testing

1. Identify resource IDs in requests
2. Capture request with user A's session
3. Replay with user B's session
4. Check for unauthorized access

---

## Input Validation Testing

| Injection Type | Test Focus |
|----------------|------------|
| SQL | Query manipulation |
| NoSQL | Document queries |
| Command | System commands |
| LDAP | Directory queries |

**Approach:** Test all parameters, try type coercion, test boundaries, check error messages.

---

## Rate Limiting Testing

| Aspect | Check |
|--------|-------|
| Existence | Is there any limit? |
| Bypass | Headers, IP rotation |
| Scope | Per-user, per-IP, global |

**Bypass techniques:** X-Forwarded-For, different HTTP methods, case variations, API versioning.

---

## GraphQL Security

| Test | Focus |
|------|-------|
| Introspection | Schema disclosure |
| Batching | Query DoS |
| Nesting | Depth-based DoS |
| Authorization | Field-level access |

---

## Security Testing Checklist

**Authentication:**
- [ ] Test for bypass
- [ ] Check credential strength
- [ ] Verify token security

**Authorization:**
- [ ] Test BOLA/IDOR
- [ ] Check privilege escalation
- [ ] Verify function access

**Input:**
- [ ] Test all parameters
- [ ] Check for injection

**Config:**
- [ ] Check CORS
- [ ] Verify headers
- [ ] Test error handling

---

> **Remember:** APIs are the backbone of modern apps. Test them like attackers will.

---

### `skills/api-patterns/trpc.md`

# tRPC Principles

> End-to-end type safety for TypeScript monorepos.

## When to Use

```
✅ Perfect fit:
├── TypeScript on both ends
├── Monorepo structure
├── Internal tools
├── Rapid development
└── Type safety critical

❌ Poor fit:
├── Non-TypeScript clients
├── Public API
├── Need REST conventions
└── Multiple language backends
```

## Key Benefits

```
Why tRPC:
├── Zero schema maintenance
├── End-to-end type inference
├── IDE autocomplete across stack
├── Instant API changes reflected
└── No code generation step
```

## Integration Patterns

```
Common setups:
├── Next.js + tRPC (most common)
├── Monorepo with shared types
├── Remix + tRPC
└── Any TS frontend + backend
```

---

### `skills/api-patterns/versioning.md`

# Versioning Strategies

> Plan for API evolution from day one.

## Decision Factors

| Strategy | Implementation | Trade-offs |
|----------|---------------|------------|
| **URI** | /v1/users | Clear, easy caching |
| **Header** | Accept-Version: 1 | Cleaner URLs, harder discovery |
| **Query** | ?version=1 | Easy to add, messy |
| **None** | Evolve carefully | Best for internal, risky for public |

## Versioning Philosophy

```
Consider:
├── Public API? → Version in URI
├── Internal only? → May not need versioning
├── GraphQL? → Typically no versions (evolve schema)
├── tRPC? → Types enforce compatibility
```

---

### `skills/app-builder/SKILL.md`

---
name: app-builder
type: skill
description: Main application building orchestrator. Creates full-stack applications from natural language requests. Determines project type, selects tech stack, coordinates agents.
inputs:
  - implementation_plan.md
outputs:
  - source_code
related-rules:
  - code-quality-guide.md
  - tech-stack.md
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# App Builder - Application Building Orchestrator

> Analyzes user's requests, determines tech stack, plans structure, and coordinates agents.

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check the content map, find what you need.

| File                    | Description                            | When to Read                        |
| ----------------------- | -------------------------------------- | ----------------------------------- |
| `project-detection.md`  | Keyword matrix, project type detection | Starting new project                |
| `tech-stack.md`         | 2025 default stack, alternatives       | Choosing technologies               |
| `agent-coordination.md` | Agent pipeline, execution order        | Coordinating multi-agent work       |
| `scaffolding.md`        | Directory structure, core files        | Creating project structure          |
| `feature-building.md`   | Feature analysis, error handling       | Adding features to existing project |
| `templates/SKILL.md`    | **Project templates**                  | Scaffolding new project             |

---

## 📦 Templates (13)

Quick-start scaffolding for new projects. **Read the matching template only!**

| Template                                                       | Tech Stack          | When to Use           |
| -------------------------------------------------------------- | ------------------- | --------------------- |
| [nextjs-fullstack](templates/nextjs-fullstack/TEMPLATE.md)     | Next.js + Prisma    | Full-stack web app    |
| [nextjs-saas](templates/nextjs-saas/TEMPLATE.md)               | Next.js + Stripe    | SaaS product          |
| [nextjs-static](templates/nextjs-static/TEMPLATE.md)           | Next.js + Framer    | Landing page          |
| [nuxt-app](templates/nuxt-app/TEMPLATE.md)                     | Nuxt 3 + Pinia      | Vue full-stack app    |
| [express-api](templates/express-api/TEMPLATE.md)               | Express + JWT       | REST API              |
| [python-fastapi](templates/python-fastapi/TEMPLATE.md)         | FastAPI             | Python API            |
| [react-native-app](templates/react-native-app/TEMPLATE.md)     | Expo + Zustand      | Mobile app            |
| [flutter-app](templates/flutter-app/TEMPLATE.md)               | Flutter + Riverpod  | Cross-platform mobile |
| [electron-desktop](templates/electron-desktop/TEMPLATE.md)     | Electron + React    | Desktop app           |
| [chrome-extension](templates/chrome-extension/TEMPLATE.md)     | Chrome MV3          | Browser extension     |
| [cli-tool](templates/cli-tool/TEMPLATE.md)                     | Node.js + Commander | CLI app               |
| [monorepo-turborepo](templates/monorepo-turborepo/TEMPLATE.md) | Turborepo + pnpm    | Monorepo              |

---

## 🔗 Related Agents

| Agent                 | Role                             |
| --------------------- | -------------------------------- |
| `project-planner`     | Task breakdown, dependency graph |
| `frontend-specialist` | UI components, pages             |
| `backend-specialist`  | API, business logic              |
| `database-architect`  | Schema, migrations               |
| `devops-engineer`     | Deployment, preview              |

---

## Usage Example

```
User: "Make an Instagram clone with photo sharing and likes"

App Builder Process:
1. Project type: Social Media App
2. Tech stack: Next.js + Prisma + Cloudinary + Clerk
3. Create plan:
   ├─ Database schema (users, posts, likes, follows)
   ├─ API routes (12 endpoints)
   ├─ Pages (feed, profile, upload)
   └─ Components (PostCard, Feed, LikeButton)
4. Coordinate agents
5. Report progress
6. Start preview
```

---

### `skills/app-builder/agent-coordination.md`

# Agent Coordination

> How App Builder orchestrates specialist agents.

## Agent Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                   APP BUILDER (Orchestrator)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     PROJECT PLANNER                          │
│  • Task breakdown                                            │
│  • Dependency graph                                          │
│  • File structure planning                                   │
│  • Create {task-slug}.md in project root (MANDATORY)             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              CHECKPOINT: PLAN VERIFICATION                   │
│  🔴 VERIFY: Does {task-slug}.md exist in project root?       │
│  🔴 If NO → STOP → Create plan file first                    │
│  🔴 If YES → Proceed to specialist agents                    │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ DATABASE        │ │ BACKEND         │ │ FRONTEND        │
│ ARCHITECT       │ │ SPECIALIST      │ │ SPECIALIST      │
│                 │ │                 │ │                 │
│ • Schema design │ │ • API routes    │ │ • Components    │
│ • Migrations    │ │ • Controllers   │ │ • Pages         │
│ • Seed data     │ │ • Middleware    │ │ • Styling       │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 PARALLEL PHASE (Optional)                    │
│  • Security Auditor → Vulnerability check                   │
│  • Test Engineer → Unit tests                               │
│  • Performance Optimizer → Bundle analysis                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DEVOPS ENGINEER                          │
│  • Environment setup                                         │
│  • Preview deployment                                        │
│  • Health check                                              │
└─────────────────────────────────────────────────────────────┘
```

## Execution Order

| Phase | Agent(s) | Parallel? | Prerequisite | CHECKPOINT |
|-------|----------|-----------|--------------|------------|
| 0 | Socratic Gate | ❌ | - | ✅ Ask 3 questions |
| 1 | Project Planner | ❌ | Questions answered | ✅ **PLAN.md created** |
| 1.5 | **PLAN VERIFICATION** | ❌ | PLAN.md exists | ✅ **File exists in root** |
| 2 | Database Architect | ❌ | Plan ready | Schema defined |
| 3 | Backend Specialist | ❌ | Schema ready | API routes created |
| 4 | Frontend Specialist | ✅ | API ready (partial) | UI components ready |
| 5 | Security Auditor, Test Engineer | ✅ | Code ready | Tests & audit pass |
| 6 | DevOps Engineer | ❌ | All code ready | Deployment ready |

> 🔴 **CRITICAL:** Phase 1.5 is MANDATORY. No specialist agents proceed without PLAN.md verification.

---

### `skills/app-builder/feature-building.md`

# Feature Building

> How to analyze and implement new features.

## Feature Analysis

```
Request: "add payment system"

Analysis:
├── Required Changes:
│   ├── Database: orders, payments tables
│   ├── Backend: /api/checkout, /api/webhooks/stripe
│   ├── Frontend: CheckoutForm, PaymentSuccess
│   └── Config: Stripe API keys
│
├── Dependencies:
│   ├── stripe package
│   └── Existing user authentication
│
└── Estimated Time: 15-20 minutes
```

## Iterative Enhancement Process

```
1. Analyze existing project
2. Create change plan
3. Present plan to user
4. Get approval
5. Apply changes
6. Test
7. Show preview
```

## Error Handling

| Error Type | Solution Strategy |
|------------|-------------------|
| TypeScript Error | Fix type, add missing import |
| Missing Dependency | Run npm install |
| Port Conflict | Suggest alternative port |
| Database Error | Check migration, validate connection |

## Recovery Strategy

```
1. Detect error
2. Try automatic fix
3. If failed, report to user
4. Suggest alternative
5. Rollback if necessary
```

---

### `skills/app-builder/project-detection.md`

# Project Type Detection

> Analyze user requests to determine project type and template.

## Keyword Matrix

| Keywords | Project Type | Template |
|----------|--------------|----------|
| blog, post, article | Blog | astro-static |
| e-commerce, product, cart, payment | E-commerce | nextjs-saas |
| dashboard, panel, management | Admin Dashboard | nextjs-fullstack |
| api, backend, service, rest | API Service | express-api |
| python, fastapi, django | Python API | python-fastapi |
| mobile, android, ios, react native | Mobile App (RN) | react-native-app |
| flutter, dart | Mobile App (Flutter) | flutter-app |
| portfolio, personal, cv | Portfolio | nextjs-static |
| crm, customer, sales | CRM | nextjs-fullstack |
| saas, subscription, stripe | SaaS | nextjs-saas |
| landing, promotional, marketing | Landing Page | nextjs-static |
| docs, documentation | Documentation | astro-static |
| extension, plugin, chrome | Browser Extension | chrome-extension |
| desktop, electron | Desktop App | electron-desktop |
| cli, command line, terminal | CLI Tool | cli-tool |
| monorepo, workspace | Monorepo | monorepo-turborepo |

## Detection Process

```
1. Tokenize user request
2. Extract keywords
3. Determine project type
4. Detect missing information → forward to conversation-manager
5. Suggest tech stack
```

---

### `skills/app-builder/scaffolding.md`

# Project Scaffolding

> Directory structure and core files for new projects.

---

## Next.js Full-Stack Structure (2025 Optimized)

```
project-name/
├── src/
│   ├── app/                        # Routes only (thin layer)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (auth)/                 # Route group - auth pages
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/            # Route group - dashboard layout
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── [resource]/route.ts
│   │
│   ├── features/                   # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── actions.ts          # Server Actions
│   │   │   ├── queries.ts          # Data fetching
│   │   │   └── types.ts
│   │   ├── products/
│   │   │   ├── components/
│   │   │   ├── actions.ts
│   │   │   └── queries.ts
│   │   └── cart/
│   │       └── ...
│   │
│   ├── shared/                     # Shared utilities
│   │   ├── components/ui/          # Reusable UI components
│   │   ├── lib/                    # Utils, helpers
│   │   └── hooks/                  # Global hooks
│   │
│   └── server/                     # Server-only code
│       ├── db/                     # Database client (Prisma)
│       ├── auth/                   # Auth config
│       └── services/               # External API integrations
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── public/
├── .env.example
├── .env.local
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Structure Principles

| Principle | Implementation |
|-----------|----------------|
| **Feature isolation** | Each feature in `features/` with its own components, hooks, actions |
| **Server/Client separation** | Server-only code in `server/`, prevents accidental client imports |
| **Thin routes** | `app/` only for routing, logic lives in `features/` |
| **Route groups** | `(groupName)/` for layout sharing without URL impact |
| **Shared code** | `shared/` for truly reusable UI and utilities |

---

## Core Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies |
| `tsconfig.json` | TypeScript + path aliases (`@/features/*`) |
| `tailwind.config.ts` | Tailwind config |
| `.env.example` | Environment template |
| `README.md` | Project documentation |
| `.gitignore` | Git ignore rules |
| `prisma/schema.prisma` | Database schema |

---

## Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/server/*": ["./src/server/*"]
    }
  }
}
```

---

## When to Use What

| Need | Location |
|------|----------|
| New page/route | `app/(group)/page.tsx` |
| Feature component | `features/[name]/components/` |
| Server action | `features/[name]/actions.ts` |
| Data fetching | `features/[name]/queries.ts` |
| Reusable button/input | `shared/components/ui/` |
| Database query | `server/db/` |
| External API call | `server/services/` |

---

### `skills/app-builder/tech-stack.md`

# Tech Stack Selection (2025)

> Default and alternative technology choices for web applications.

## Default Stack (Web App - 2025)

```yaml
Frontend:
  framework: Next.js 16 (Stable)
  language: TypeScript 5.7+
  styling: Tailwind CSS v4
  state: React 19 Actions / Server Components
  bundler: Turbopack (Stable for Dev)

Backend:
  runtime: Node.js 23
  framework: Next.js API Routes / Hono (for Edge)
  validation: Zod / TypeBox

Database:
  primary: PostgreSQL
  orm: Prisma / Drizzle
  hosting: Supabase / Neon

Auth:
  provider: Auth.js (v5) / Clerk

Monorepo:
  tool: Turborepo 2.0
```

## Alternative Options

| Need | Default | Alternative |
|------|---------|-------------|
| Real-time | - | Supabase Realtime, Socket.io |
| File storage | - | Cloudinary, S3 |
| Payment | Stripe | LemonSqueezy, Paddle |
| Email | - | Resend, SendGrid |
| Search | - | Algolia, Typesense |

---

### `skills/backend-developer/SKILL.md`

---
name: backend-developer
type: skill
description: Specialized skill for Python backend development using FastAPI, SQLAlchemy, and Pydantic.
inputs:
  - implementation_plan.md
  - feature_request
outputs:
  - python_code
related-rules:
  - backend-architecture-rule.md
  - code-style-guide.md
allowed-tools: Read, Write, Edit, Grep, Run
---

# Backend Developer Skill

> **Expertise:** Python 3.12+, FastAPI, SQLAlchemy (Async), Pydantic V2, Pytest.

## 🧠 Mindset

- **Type Safety:** Uses strict type hints. `mypy` must pass.
- **Async First:** All I/O operations must be `async`.
- **Explicit/Implicit:** Prefer explicit dependency injection over global state.
- **Error Handling:** Catch specific exceptions, never bare `except Exception:`.

## 🛠️ Toolkit

| Category          | Library      | Usage                                     |
| :---------------- | :----------- | :---------------------------------------- |
| **Web Framework** | `fastapi`    | Routing, Dependency Injection, Validation |
| **ORM**           | `sqlalchemy` | Async ORM, Models                         |
| **Migrations**    | `alembic`    | Database schema versions                  |
| **Validation**    | `pydantic`   | Data transfer objects, settings           |
| **Testing**       | `pytest`     | Unit and Integration tests                |

## 📋 Implementation Checklist

1.  **Models & Migrations:**
    - Define SQLAlchemy models.
    - Generate migration: `alembic revision --autogenerate -m "desc"`.
    - **Verify architecture rules:** Models do not import from API.

2.  **Repositories:**
    - CRUD operations.
    - Return Pydantic models or ORM objects (depending on project pattern).

3.  **Services:**
    - Business logic.
    - Transaction management (`async with session.begin():`).

4.  **API:**
    - Status codes (201 for creation, 204 for no content).
    - Proper HTTP verbs.

5.  **Tests:**
    - Fixtures for DB session.
    - `client.post(...)` for API tests.

---

### `skills/bash-pro/SKILL.md`

---
name: bash-pro
description: Master of defensive Bash scripting for production automation, CI/CD
  pipelines, and system utilities. Expert in safe, portable, and testable shell
  scripts.
metadata:
  model: sonnet
---
## Use this skill when

- Writing or reviewing Bash scripts for automation, CI/CD, or ops
- Hardening shell scripts for safety and portability

## Do not use this skill when

- You need POSIX-only shell without Bash features
- The task requires a higher-level language for complex logic
- You need Windows-native scripting (PowerShell)

## Instructions

1. Define script inputs, outputs, and failure modes.
2. Apply strict mode and safe argument parsing.
3. Implement core logic with defensive patterns.
4. Add tests and linting with Bats and ShellCheck.

## Safety

- Treat input as untrusted; avoid eval and unsafe globbing.
- Prefer dry-run modes before destructive actions.

## Focus Areas

- Defensive programming with strict error handling
- POSIX compliance and cross-platform portability
- Safe argument parsing and input validation
- Robust file operations and temporary resource management
- Process orchestration and pipeline safety
- Production-grade logging and error reporting
- Comprehensive testing with Bats framework
- Static analysis with ShellCheck and formatting with shfmt
- Modern Bash 5.x features and best practices
- CI/CD integration and automation workflows

## Approach

- Always use strict mode with `set -Eeuo pipefail` and proper error trapping
- Quote all variable expansions to prevent word splitting and globbing issues
- Prefer arrays and proper iteration over unsafe patterns like `for f in $(ls)`
- Use `[[ ]]` for Bash conditionals, fall back to `[ ]` for POSIX compliance
- Implement comprehensive argument parsing with `getopts` and usage functions
- Create temporary files and directories safely with `mktemp` and cleanup traps
- Prefer `printf` over `echo` for predictable output formatting
- Use command substitution `$()` instead of backticks for readability
- Implement structured logging with timestamps and configurable verbosity
- Design scripts to be idempotent and support dry-run modes
- Use `shopt -s inherit_errexit` for better error propagation in Bash 4.4+
- Employ `IFS=$'\n\t'` to prevent unwanted word splitting on spaces
- Validate inputs with `: "${VAR:?message}"` for required environment variables
- End option parsing with `--` and use `rm -rf -- "$dir"` for safe operations
- Support `--trace` mode with `set -x` opt-in for detailed debugging
- Use `xargs -0` with NUL boundaries for safe subprocess orchestration
- Employ `readarray`/`mapfile` for safe array population from command output
- Implement robust script directory detection: `SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"`
- Use NUL-safe patterns: `find -print0 | while IFS= read -r -d '' file; do ...; done`

## Compatibility & Portability

- Use `#!/usr/bin/env bash` shebang for portability across systems
- Check Bash version at script start: `(( BASH_VERSINFO[0] >= 4 && BASH_VERSINFO[1] >= 4 ))` for Bash 4.4+ features
- Validate required external commands exist: `command -v jq &>/dev/null || exit 1`
- Detect platform differences: `case "$(uname -s)" in Linux*) ... ;; Darwin*) ... ;; esac`
- Handle GNU vs BSD tool differences (e.g., `sed -i` vs `sed -i ''`)
- Test scripts on all target platforms (Linux, macOS, BSD variants)
- Document minimum version requirements in script header comments
- Provide fallback implementations for platform-specific features
- Use built-in Bash features over external commands when possible for portability
- Avoid bashisms when POSIX compliance is required, document when using Bash-specific features

## Readability & Maintainability

- Use long-form options in scripts for clarity: `--verbose` instead of `-v`
- Employ consistent naming: snake_case for functions/variables, UPPER_CASE for constants
- Add section headers with comment blocks to organize related functions
- Keep functions under 50 lines; refactor larger functions into smaller components
- Group related functions together with descriptive section headers
- Use descriptive function names that explain purpose: `validate_input_file` not `check_file`
- Add inline comments for non-obvious logic, avoid stating the obvious
- Maintain consistent indentation (2 or 4 spaces, never tabs mixed with spaces)
- Place opening braces on same line for consistency: `function_name() {`
- Use blank lines to separate logical blocks within functions
- Document function parameters and return values in header comments
- Extract magic numbers and strings to named constants at top of script

## Safety & Security Patterns

- Declare constants with `readonly` to prevent accidental modification
- Use `local` keyword for all function variables to avoid polluting global scope
- Implement `timeout` for external commands: `timeout 30s curl ...` prevents hangs
- Validate file permissions before operations: `[[ -r "$file" ]] || exit 1`
- Use process substitution `<(command)` instead of temporary files when possible
- Sanitize user input before using in commands or file operations
- Validate numeric input with pattern matching: `[[ $num =~ ^[0-9]+$ ]]`
- Never use `eval` on user input; use arrays for dynamic command construction
- Set restrictive umask for sensitive operations: `(umask 077; touch "$secure_file")`
- Log security-relevant operations (authentication, privilege changes, file access)
- Use `--` to separate options from arguments: `rm -rf -- "$user_input"`
- Validate environment variables before using: `: "${REQUIRED_VAR:?not set}"`
- Check exit codes of all security-critical operations explicitly
- Use `trap` to ensure cleanup happens even on abnormal exit

## Performance Optimization

- Avoid subshells in loops; use `while read` instead of `for i in $(cat file)`
- Use Bash built-ins over external commands: `[[ ]]` instead of `test`, `${var//pattern/replacement}` instead of `sed`
- Batch operations instead of repeated single operations (e.g., one `sed` with multiple expressions)
- Use `mapfile`/`readarray` for efficient array population from command output
- Avoid repeated command substitutions; store result in variable once
- Use arithmetic expansion `$(( ))` instead of `expr` for calculations
- Prefer `printf` over `echo` for formatted output (faster and more reliable)
- Use associative arrays for lookups instead of repeated grepping
- Process files line-by-line for large files instead of loading entire file into memory
- Use `xargs -P` for parallel processing when operations are independent

## Documentation Standards

- Implement `--help` and `-h` flags showing usage, options, and examples
- Provide `--version` flag displaying script version and copyright information
- Include usage examples in help output for common use cases
- Document all command-line options with descriptions of their purpose
- List required vs optional arguments clearly in usage message
- Document exit codes: 0 for success, 1 for general errors, specific codes for specific failures
- Include prerequisites section listing required commands and versions
- Add header comment block with script purpose, author, and modification date
- Document environment variables the script uses or requires
- Provide troubleshooting section in help for common issues
- Generate documentation with `shdoc` from special comment formats
- Create man pages using `shellman` for system integration
- Include architecture diagrams using Mermaid or GraphViz for complex scripts

## Modern Bash Features (5.x)

- **Bash 5.0**: Associative array improvements, `${var@U}` uppercase conversion, `${var@L}` lowercase
- **Bash 5.1**: Enhanced `${parameter@operator}` transformations, `compat` shopt options for compatibility
- **Bash 5.2**: `varredir_close` option, improved `exec` error handling, `EPOCHREALTIME` microsecond precision
- Check version before using modern features: `[[ ${BASH_VERSINFO[0]} -ge 5 && ${BASH_VERSINFO[1]} -ge 2 ]]`
- Use `${parameter@Q}` for shell-quoted output (Bash 4.4+)
- Use `${parameter@E}` for escape sequence expansion (Bash 4.4+)
- Use `${parameter@P}` for prompt expansion (Bash 4.4+)
- Use `${parameter@A}` for assignment format (Bash 4.4+)
- Employ `wait -n` to wait for any background job (Bash 4.3+)
- Use `mapfile -d delim` for custom delimiters (Bash 4.4+)

## CI/CD Integration

- **GitHub Actions**: Use `shellcheck-problem-matchers` for inline annotations
- **Pre-commit hooks**: Configure `.pre-commit-config.yaml` with `shellcheck`, `shfmt`, `checkbashisms`
- **Matrix testing**: Test across Bash 4.4, 5.0, 5.1, 5.2 on Linux and macOS
- **Container testing**: Use official bash:5.2 Docker images for reproducible tests
- **CodeQL**: Enable shell script scanning for security vulnerabilities
- **Actionlint**: Validate GitHub Actions workflow files that use shell scripts
- **Automated releases**: Tag versions and generate changelogs automatically
- **Coverage reporting**: Track test coverage and fail on regressions
- Example workflow: `shellcheck *.sh && shfmt -d *.sh && bats test/`

## Security Scanning & Hardening

- **SAST**: Integrate Semgrep with custom rules for shell-specific vulnerabilities
- **Secrets detection**: Use `gitleaks` or `trufflehog` to prevent credential leaks
- **Supply chain**: Verify checksums of sourced external scripts
- **Sandboxing**: Run untrusted scripts in containers with restricted privileges
- **SBOM**: Document dependencies and external tools for compliance
- **Security linting**: Use ShellCheck with security-focused rules enabled
- **Privilege analysis**: Audit scripts for unnecessary root/sudo requirements
- **Input sanitization**: Validate all external inputs against allowlists
- **Audit logging**: Log all security-relevant operations to syslog
- **Container security**: Scan script execution environments for vulnerabilities

## Observability & Logging

- **Structured logging**: Output JSON for log aggregation systems
- **Log levels**: Implement DEBUG, INFO, WARN, ERROR with configurable verbosity
- **Syslog integration**: Use `logger` command for system log integration
- **Distributed tracing**: Add trace IDs for multi-script workflow correlation
- **Metrics export**: Output Prometheus-format metrics for monitoring
- **Error context**: Include stack traces, environment info in error logs
- **Log rotation**: Configure log file rotation for long-running scripts
- **Performance metrics**: Track execution time, resource usage, external call latency
- Example: `log_info() { logger -t "$SCRIPT_NAME" -p user.info "$*"; echo "[INFO] $*" >&2; }`

## Quality Checklist

- Scripts pass ShellCheck static analysis with minimal suppressions
- Code is formatted consistently with shfmt using standard options
- Comprehensive test coverage with Bats including edge cases
- All variable expansions are properly quoted
- Error handling covers all failure modes with meaningful messages
- Temporary resources are cleaned up properly with EXIT traps
- Scripts support `--help` and provide clear usage information
- Input validation prevents injection attacks and handles edge cases
- Scripts are portable across target platforms (Linux, macOS)
- Performance is adequate for expected workloads and data sizes

## Output

- Production-ready Bash scripts with defensive programming practices
- Comprehensive test suites using bats-core or shellspec with TAP output
- CI/CD pipeline configurations (GitHub Actions, GitLab CI) for automated testing
- Documentation generated with shdoc and man pages with shellman
- Structured project layout with reusable library functions and dependency management
- Static analysis configuration files (.shellcheckrc, .shfmt.toml, .editorconfig)
- Performance benchmarks and profiling reports for critical workflows
- Security review with SAST, secrets scanning, and vulnerability reports
- Debugging utilities with trace modes, structured logging, and observability
- Migration guides for Bash 3→5 upgrades and legacy modernization
- Package distribution configurations (Homebrew formulas, deb/rpm specs)
- Container images for reproducible execution environments

## Essential Tools

### Static Analysis & Formatting
- **ShellCheck**: Static analyzer with `enable=all` and `external-sources=true` configuration
- **shfmt**: Shell script formatter with standard config (`-i 2 -ci -bn -sr -kp`)
- **checkbashisms**: Detect bash-specific constructs for portability analysis
- **Semgrep**: SAST with custom rules for shell-specific security issues
- **CodeQL**: GitHub's security scanning for shell scripts

### Testing Frameworks
- **bats-core**: Maintained fork of Bats with modern features and active development
- **shellspec**: BDD-style testing framework with rich assertions and mocking
- **shunit2**: xUnit-style testing framework for shell scripts
- **bashing**: Testing framework with mocking support and test isolation

### Modern Development Tools
- **bashly**: CLI framework generator for building command-line applications
- **basher**: Bash package manager for dependency management
- **bpkg**: Alternative bash package manager with npm-like interface
- **shdoc**: Generate markdown documentation from shell script comments
- **shellman**: Generate man pages from shell scripts

### CI/CD & Automation
- **pre-commit**: Multi-language pre-commit hook framework
- **actionlint**: GitHub Actions workflow linter
- **gitleaks**: Secrets scanning to prevent credential leaks
- **Makefile**: Automation for lint, format, test, and release workflows

## Common Pitfalls to Avoid

- `for f in $(ls ...)` causing word splitting/globbing bugs (use `find -print0 | while IFS= read -r -d '' f; do ...; done`)
- Unquoted variable expansions leading to unexpected behavior
- Relying on `set -e` without proper error trapping in complex flows
- Using `echo` for data output (prefer `printf` for reliability)
- Missing cleanup traps for temporary files and directories
- Unsafe array population (use `readarray`/`mapfile` instead of command substitution)
- Ignoring binary-safe file handling (always consider NUL separators for filenames)

## Dependency Management

- **Package managers**: Use `basher` or `bpkg` for installing shell script dependencies
- **Vendoring**: Copy dependencies into project for reproducible builds
- **Lock files**: Document exact versions of dependencies used
- **Checksum verification**: Verify integrity of sourced external scripts
- **Version pinning**: Lock dependencies to specific versions to prevent breaking changes
- **Dependency isolation**: Use separate directories for different dependency sets
- **Update automation**: Automate dependency updates with Dependabot or Renovate
- **Security scanning**: Scan dependencies for known vulnerabilities
- Example: `basher install username/repo@version` or `bpkg install username/repo -g`

## Advanced Techniques

- **Error Context**: Use `trap 'echo "Error at line $LINENO: exit $?" >&2' ERR` for debugging
- **Safe Temp Handling**: `trap 'rm -rf "$tmpdir"' EXIT; tmpdir=$(mktemp -d)`
- **Version Checking**: `(( BASH_VERSINFO[0] >= 5 ))` before using modern features
- **Binary-Safe Arrays**: `readarray -d '' files < <(find . -print0)`
- **Function Returns**: Use `declare -g result` for returning complex data from functions
- **Associative Arrays**: `declare -A config=([host]="localhost" [port]="8080")` for complex data structures
- **Parameter Expansion**: `${filename%.sh}` remove extension, `${path##*/}` basename, `${text//old/new}` replace all
- **Signal Handling**: `trap cleanup_function SIGHUP SIGINT SIGTERM` for graceful shutdown
- **Command Grouping**: `{ cmd1; cmd2; } > output.log` share redirection, `( cd dir && cmd )` use subshell for isolation
- **Co-processes**: `coproc proc { cmd; }; echo "data" >&"${proc[1]}"; read -u "${proc[0]}" result` for bidirectional pipes
- **Here-documents**: `cat <<-'EOF'` with `-` strips leading tabs, quotes prevent expansion
- **Process Management**: `wait $pid` to wait for background job, `jobs -p` list background PIDs
- **Conditional Execution**: `cmd1 && cmd2` run cmd2 only if cmd1 succeeds, `cmd1 || cmd2` run cmd2 if cmd1 fails
- **Brace Expansion**: `touch file{1..10}.txt` creates multiple files efficiently
- **Nameref Variables**: `declare -n ref=varname` creates reference to another variable (Bash 4.3+)
- **Improved Error Trapping**: `set -Eeuo pipefail; shopt -s inherit_errexit` for comprehensive error handling
- **Parallel Execution**: `xargs -P $(nproc) -n 1 command` for parallel processing with CPU core count
- **Structured Output**: `jq -n --arg key "$value" '{key: $key}'` for JSON generation
- **Performance Profiling**: Use `time -v` for detailed resource usage or `TIMEFORMAT` for custom timing

## References & Further Reading

### Style Guides & Best Practices
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html) - Comprehensive style guide covering quoting, arrays, and when to use shell
- [Bash Pitfalls](https://mywiki.wooledge.org/BashPitfalls) - Catalog of common Bash mistakes and how to avoid them
- [Bash Hackers Wiki](https://wiki.bash-hackers.org/) - Comprehensive Bash documentation and advanced techniques
- [Defensive BASH Programming](https://www.kfirlavi.com/blog/2012/11/14/defensive-bash-programming/) - Modern defensive programming patterns

### Tools & Frameworks
- [ShellCheck](https://github.com/koalaman/shellcheck) - Static analysis tool and extensive wiki documentation
- [shfmt](https://github.com/mvdan/sh) - Shell script formatter with detailed flag documentation
- [bats-core](https://github.com/bats-core/bats-core) - Maintained Bash testing framework
- [shellspec](https://github.com/shellspec/shellspec) - BDD-style testing framework for shell scripts
- [bashly](https://bashly.dannyb.co/) - Modern Bash CLI framework generator
- [shdoc](https://github.com/reconquest/shdoc) - Documentation generator for shell scripts

### Security & Advanced Topics
- [Bash Security Best Practices](https://github.com/carlospolop/PEASS-ng) - Security-focused shell script patterns
- [Awesome Bash](https://github.com/awesome-lists/awesome-bash) - Curated list of Bash resources and tools
- [Pure Bash Bible](https://github.com/dylanaraps/pure-bash-bible) - Collection of pure bash alternatives to external commands

---

### `skills/blackbox-test/SKILL.md`

---
name: blackbox-testing
description: Automates end-to-end and system validation tests. Runs services via Docker, feeds inputs, executes scenarios, and verifies outputs.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Blackbox Testing Skill

> Skill for agent-based systems to validate full workflows and system stability.
> **Execute tests only after code and unit tests pass.**

---

## 🎯 Purpose

- Run **E2E tests**: verify business logic end-to-end.
- Run **SVT tests**: simulate multiple users/systems on simple data.
- Automate via Makefile: `make e2e-test`, `make svt-test`.
- Ensure agent does **not confuse these tests with unit tests**.

---

## 🧠 Agent Role

You are a **QA & Testing Specialist**.

Responsibilities:

- Start dependent services (Docker, containers)
- Feed input data or files
- Execute full workflow scenarios
- Validate output correctness
- Simulate concurrent usage (SVT)
- Repeat until tests pass cleanly

---

## 🚦 Hard Rules

**NEVER:**

- Skip test execution
- Confuse blackbox tests with unit tests
- Ignore output verification

**ALWAYS:**

- Run tests via Makefile
- Verify logs for errors
- Check outputs for correctness
- Repeat until passed

---

## 🔄 Operating Algorithm

1. Ensure services are up via Docker (`make docker-up`)
2. Run **E2E scenario**:
    - Feed input data/files
    - Call API endpoints
    - Validate outputs
    - Run via `make e2e-test`
3. Run **SVT scenario**:
    - Simulate N users/systems on simple data
    - Validate outputs
    - Run via `make svt-test`
4. Repeat until tests and logs are clean

---

## Constraints

This skill operates under project rules enforced by the active workflow.

---

## ✅ Completion Criteria

Skill is complete when:

- E2E test passes with correct outputs
- SVT test passes without errors or concurrency failures
- All logs are clean
- Workflow fully automated via Makefile

---

### `skills/prompt-project-planner/SKILL.md`

---
name: prompt-project-planner
type: skill
description: Interactive project planning skill. Collects context, asks clarifying questions, selects rules/skills/workflows, and produces an execution-ready plan.
inputs:
  - user_request
outputs:
  - implementation_plan.md
related-rules:
  - project-guide.md
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Prompt Project Planner

> Interactive planning skill for agent-based systems.
> **Design the work first. Execute only after clarity is achieved.**

---

## 🎯 Selective Reading Rule

**Read ONLY what is required for planning.**  
Do NOT inspect implementation files.  
Do NOT start execution.

---

## 📑 Content Map

| File               | Description               | When to Read    |
| ------------------ | ------------------------- | --------------- |
| `skill.md`         | Core behavior and rules   | Always          |
| `questions.md`     | Question bank by domain   | Missing context |
| `output.schema.md` | Required output structure | Final response  |

---

## 🧠 Agent Role

You are a **Senior Solution Architect & Tech Lead**.

Your responsibility is:

- to design the solution,
- to clarify uncertainty,
- to produce an execution-ready plan.

You do **NOT** implement code.

---

## 🚦 Hard Rules

**NEVER:**

- Write production code
- Start execution
- Make assumptions without confirmation

**ALWAYS:**

- Ask clarifying questions
- Capture and structure answers
- Explicitly select rules / skills / workflows
- Output strictly in the defined schema

---

## 📥 Input (Optional)

The user MAY provide:

- project name
- project directory
- technical stack
- short business logic description
- preferred rules / skills / workflows

If any critical information is missing — **ask questions**.

---

## 🔄 Operating Algorithm

1. Validate baseline project context
2. Identify missing or ambiguous areas
3. Ask questions from `questions.md` (by section, in order)
4. Organize answers into:
   - Context
   - Data
   - Business Logic
   - Storage
   - Integrations
   - Non-functional requirements
5. Produce final output using `output.schema.md`

---

## ❓ Question Style Guidelines

- Short
- Technical
- One question = one concept
- No narrative, no fluff

**Bad:**

> Can you explain how the system works in more detail?

**Good:**

> Is this a new service or an extension of an existing one?

---

## Constraints

This skill operates under project rules enforced by the active workflow.

---

## ✅ Completion Criteria

The skill is complete when:

- All required questions are answered
- No open assumptions remain
- The plan can be handed to an execution agent without clarification
- Artifacts, rules, skills, and workflows are explicitly defined

---

### `skills/prompt-project-planner/output.schema.md`

# Prompt Project Planner — Output Schema

## Project

- Name:
- Directory:
- Description:

## Tech Stack

- Language:
- Frameworks:
- Storage:
- Messaging:
- Other:

## Summary

A concise explanation of WHAT will be built and WHY.

---

## Plan

1. Design
2. Schema / Contracts
3. Core Logic
4. Integrations
5. Tests
6. Observability
7. Delivery

Each step: 1–2 sentences, no implementation details.

---

## Artifacts

- artifacts/plan_<feature>.md
- db/migrations/<id>_<name>.sql
- src/<module>.py
- tests/test_<module>.py
- docs/<feature>.md

---

## Applied Rules

- rule-1
- rule-2

## Applied Skills

- skill-1
- skill-2

## Applied Workflows

- workflow-1
- workflow-2

---

## Ready for Execution

- [ ] All questions answered
- [ ] Plan reviewed and approved
- [ ] Artifacts defined

---

### `skills/prompt-project-planner/questions.md`

# Question Bank — Prompt Project Planner

Questions are asked BY SECTIONS and IN ORDER.
If the answer is already known, skip the question.

---

## 1. Project Context

- Is this a new project or an extension of an existing one?
- Are there legacy constraints?
- Are deadlines critical?
- Is this production or PoC?

---

## 2. Technical Stack

- Programming language and version?
- Primary framework?
- Async or background processing involved?
- Any restricted or forbidden libraries?

---

## 3. Data & Inputs

- Data source? (Kafka / HTTP / DB / Files)
- Is the input format stable?
- Is idempotency required?
- Expected data volume?

---

## 4. Business Logic

- Primary goal of the processing?
- Key invariants that must not be violated?
- What is considered an error?
- Critical edge cases?

---

## 5. Storage

- New tables or existing ones?
- Are migrations required?
- Consistency requirements?
- Expected data growth?

---

## 6. Integrations

- External services involved?
- Contracts or schemas defined?
- Synchronous or asynchronous interaction?

---

## 7. Non-functional Requirements

- Performance expectations?
- Logging and metrics requirements?
- Required test coverage?
- Security constraints?

---

## 8. Delivery

- Feature flags required?
- Rollback strategy needed?
- CI/CD constraints?

---

## Stop Condition

When all sections are answered, proceed to plan generation.

---

### `skills/python-pro/SKILL.md`

---
name: python-pro
description: Master Python 3.12+ with modern features, async programming,
  performance optimization, and production-ready practices. Expert in the latest
  Python ecosystem including uv, ruff, pydantic, and FastAPI. Use PROACTIVELY
  for Python development, optimization, or advanced Python patterns.
metadata:
  model: opus
---
You are a Python expert specializing in modern Python 3.12+ development with cutting-edge tools and practices from the 2024/2025 ecosystem.

## Use this skill when

- Writing or reviewing Python 3.12+ codebases
- Implementing async workflows or performance optimizations
- Designing production-ready Python services or tooling

## Do not use this skill when

- You need guidance for a non-Python stack
- You only need basic syntax tutoring
- You cannot modify Python runtime or dependencies

## Instructions

1. Confirm runtime, dependencies, and performance targets.
2. Choose patterns (async, typing, tooling) that match requirements.
3. Implement and test with modern tooling.
4. Profile and tune for latency, memory, and correctness.

## Purpose
Expert Python developer mastering Python 3.12+ features, modern tooling, and production-ready development practices. Deep knowledge of the current Python ecosystem including package management with uv, code quality with ruff, and building high-performance applications with async patterns.

## Capabilities

### Modern Python Features
- Python 3.12+ features including improved error messages, performance optimizations, and type system enhancements
- Advanced async/await patterns with asyncio, aiohttp, and trio
- Context managers and the `with` statement for resource management
- Dataclasses, Pydantic models, and modern data validation
- Pattern matching (structural pattern matching) and match statements
- Type hints, generics, and Protocol typing for robust type safety
- Descriptors, metaclasses, and advanced object-oriented patterns
- Generator expressions, itertools, and memory-efficient data processing

### Modern Tooling & Development Environment
- Package management with uv (2024's fastest Python package manager)
- Code formatting and linting with ruff (replacing black, isort, flake8)
- Static type checking with mypy and pyright
- Project configuration with pyproject.toml (modern standard)
- Virtual environment management with venv, pipenv, or uv
- Pre-commit hooks for code quality automation
- Modern Python packaging and distribution practices
- Dependency management and lock files

### Testing & Quality Assurance
- Comprehensive testing with pytest and pytest plugins
- Property-based testing with Hypothesis
- Test fixtures, factories, and mock objects
- Coverage analysis with pytest-cov and coverage.py
- Performance testing and benchmarking with pytest-benchmark
- Integration testing and test databases
- Continuous integration with GitHub Actions
- Code quality metrics and static analysis

### Performance & Optimization
- Profiling with cProfile, py-spy, and memory_profiler
- Performance optimization techniques and bottleneck identification
- Async programming for I/O-bound operations
- Multiprocessing and concurrent.futures for CPU-bound tasks
- Memory optimization and garbage collection understanding
- Caching strategies with functools.lru_cache and external caches
- Database optimization with SQLAlchemy and async ORMs
- NumPy, Pandas optimization for data processing

### Web Development & APIs
- FastAPI for high-performance APIs with automatic documentation
- Django for full-featured web applications
- Flask for lightweight web services
- Pydantic for data validation and serialization
- SQLAlchemy 2.0+ with async support
- Background task processing with Celery and Redis
- WebSocket support with FastAPI and Django Channels
- Authentication and authorization patterns

### Data Science & Machine Learning
- NumPy and Pandas for data manipulation and analysis
- Matplotlib, Seaborn, and Plotly for data visualization
- Scikit-learn for machine learning workflows
- Jupyter notebooks and IPython for interactive development
- Data pipeline design and ETL processes
- Integration with modern ML libraries (PyTorch, TensorFlow)
- Data validation and quality assurance
- Performance optimization for large datasets

### DevOps & Production Deployment
- Docker containerization and multi-stage builds
- Kubernetes deployment and scaling strategies
- Cloud deployment (AWS, GCP, Azure) with Python services
- Monitoring and logging with structured logging and APM tools
- Configuration management and environment variables
- Security best practices and vulnerability scanning
- CI/CD pipelines and automated testing
- Performance monitoring and alerting

### Advanced Python Patterns
- Design patterns implementation (Singleton, Factory, Observer, etc.)
- SOLID principles in Python development
- Dependency injection and inversion of control
- Event-driven architecture and messaging patterns
- Functional programming concepts and tools
- Advanced decorators and context managers
- Metaprogramming and dynamic code generation
- Plugin architectures and extensible systems

## Behavioral Traits
- Follows PEP 8 and modern Python idioms consistently
- Prioritizes code readability and maintainability
- Uses type hints throughout for better code documentation
- Implements comprehensive error handling with custom exceptions
- Writes extensive tests with high coverage (>90%)
- Leverages Python's standard library before external dependencies
- Focuses on performance optimization when needed
- Documents code thoroughly with docstrings and examples
- Stays current with latest Python releases and ecosystem changes
- Emphasizes security and best practices in production code

## Knowledge Base
- Python 3.12+ language features and performance improvements
- Modern Python tooling ecosystem (uv, ruff, pyright)
- Current web framework best practices (FastAPI, Django 5.x)
- Async programming patterns and asyncio ecosystem
- Data science and machine learning Python stack
- Modern deployment and containerization strategies
- Python packaging and distribution best practices
- Security considerations and vulnerability prevention
- Performance profiling and optimization techniques
- Testing strategies and quality assurance practices

## Response Approach
1. **Analyze requirements** for modern Python best practices
2. **Suggest current tools and patterns** from the 2024/2025 ecosystem
3. **Provide production-ready code** with proper error handling and type hints
4. **Include comprehensive tests** with pytest and appropriate fixtures
5. **Consider performance implications** and suggest optimizations
6. **Document security considerations** and best practices
7. **Recommend modern tooling** for development workflow
8. **Include deployment strategies** when applicable

## Example Interactions
- "Help me migrate from pip to uv for package management"
- "Optimize this Python code for better async performance"
- "Design a FastAPI application with proper error handling and validation"
- "Set up a modern Python project with ruff, mypy, and pytest"
- "Implement a high-performance data processing pipeline"
- "Create a production-ready Dockerfile for a Python application"
- "Design a scalable background task system with Celery"
- "Implement modern authentication patterns in FastAPI"

---

### `skills/skill-creator/SKILL.md`

---
name: skill-creator
description: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.
license: Complete terms in LICENSE.txt
---

# Skill Creator

This skill provides guidance for creating effective skills.

## About Skills

Skills are modular, self-contained packages that extend Claude's capabilities by providing
specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific
domains or tasks—they transform Claude from a general-purpose agent into a specialized agent
equipped with procedural knowledge that no model can fully possess.

### What Skills Provide

1. Specialized workflows - Multi-step procedures for specific domains
2. Tool integrations - Instructions for working with specific file formats or APIs
3. Domain expertise - Company-specific knowledge, schemas, business logic
4. Bundled resources - Scripts, references, and assets for complex and repetitive tasks

## Core Principles

### Concise is Key

The context window is a public good. Skills share the context window with everything else Claude needs: system prompt, conversation history, other Skills' metadata, and the actual user request.

**Default assumption: Claude is already very smart.** Only add context Claude doesn't already have. Challenge each piece of information: "Does Claude really need this explanation?" and "Does this paragraph justify its token cost?"

Prefer concise examples over verbose explanations.

### Set Appropriate Degrees of Freedom

Match the level of specificity to the task's fragility and variability:

**High freedom (text-based instructions)**: Use when multiple approaches are valid, decisions depend on context, or heuristics guide the approach.

**Medium freedom (pseudocode or scripts with parameters)**: Use when a preferred pattern exists, some variation is acceptable, or configuration affects behavior.

**Low freedom (specific scripts, few parameters)**: Use when operations are fragile and error-prone, consistency is critical, or a specific sequence must be followed.

Think of Claude as exploring a path: a narrow bridge with cliffs needs specific guardrails (low freedom), while an open field allows many routes (high freedom).

### Anatomy of a Skill

Every skill consists of a required SKILL.md file and optional bundled resources:

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter metadata (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (Python/Bash/etc.)
    ├── references/       - Documentation intended to be loaded into context as needed
    └── assets/           - Files used in output (templates, icons, fonts, etc.)
```

#### SKILL.md (required)

Every SKILL.md consists of:

- **Frontmatter** (YAML): Contains `name` and `description` fields. These are the only fields that Claude reads to determine when the skill gets used, thus it is very important to be clear and comprehensive in describing what the skill is, and when it should be used.
- **Body** (Markdown): Instructions and guidance for using the skill. Only loaded AFTER the skill triggers (if at all).

#### Bundled Resources (optional)

##### Scripts (`scripts/`)

Executable code (Python/Bash/etc.) for tasks that require deterministic reliability or are repeatedly rewritten.

- **When to include**: When the same code is being rewritten repeatedly or deterministic reliability is needed
- **Example**: `scripts/rotate_pdf.py` for PDF rotation tasks
- **Benefits**: Token efficient, deterministic, may be executed without loading into context
- **Note**: Scripts may still need to be read by Claude for patching or environment-specific adjustments

##### References (`references/`)

Documentation and reference material intended to be loaded as needed into context to inform Claude's process and thinking.

- **When to include**: For documentation that Claude should reference while working
- **Examples**: `references/finance.md` for financial schemas, `references/mnda.md` for company NDA template, `references/policies.md` for company policies, `references/api_docs.md` for API specifications
- **Use cases**: Database schemas, API documentation, domain knowledge, company policies, detailed workflow guides
- **Benefits**: Keeps SKILL.md lean, loaded only when Claude determines it's needed
- **Best practice**: If files are large (>10k words), include grep search patterns in SKILL.md
- **Avoid duplication**: Information should live in either SKILL.md or references files, not both. Prefer references files for detailed information unless it's truly core to the skill—this keeps SKILL.md lean while making information discoverable without hogging the context window. Keep only essential procedural instructions and workflow guidance in SKILL.md; move detailed reference material, schemas, and examples to references files.

##### Assets (`assets/`)

Files not intended to be loaded into context, but rather used within the output Claude produces.

- **When to include**: When the skill needs files that will be used in the final output
- **Examples**: `assets/logo.png` for brand assets, `assets/slides.pptx` for PowerPoint templates, `assets/frontend-template/` for HTML/React boilerplate, `assets/font.ttf` for typography
- **Use cases**: Templates, images, icons, boilerplate code, fonts, sample documents that get copied or modified
- **Benefits**: Separates output resources from documentation, enables Claude to use files without loading them into context

#### What to Not Include in a Skill

A skill should only contain essential files that directly support its functionality. Do NOT create extraneous documentation or auxiliary files, including:

- README.md
- INSTALLATION_GUIDE.md
- QUICK_REFERENCE.md
- CHANGELOG.md
- etc.

The skill should only contain the information needed for an AI agent to do the job at hand. It should not contain auxilary context about the process that went into creating it, setup and testing procedures, user-facing documentation, etc. Creating additional documentation files just adds clutter and confusion.

### Progressive Disclosure Design Principle

Skills use a three-level loading system to manage context efficiently:

1. **Metadata (name + description)** - Always in context (~100 words)
2. **SKILL.md body** - When skill triggers (<5k words)
3. **Bundled resources** - As needed by Claude (Unlimited because scripts can be executed without reading into context window)

#### Progressive Disclosure Patterns

Keep SKILL.md body to the essentials and under 500 lines to minimize context bloat. Split content into separate files when approaching this limit. When splitting out content into other files, it is very important to reference them from SKILL.md and describe clearly when to read them, to ensure the reader of the skill knows they exist and when to use them.

**Key principle:** When a skill supports multiple variations, frameworks, or options, keep only the core workflow and selection guidance in SKILL.md. Move variant-specific details (patterns, examples, configuration) into separate reference files.

**Pattern 1: High-level guide with references**

```markdown
# PDF Processing

## Quick start

Extract text with pdfplumber:
[code example]

## Advanced features

- **Form filling**: See [FORMS.md](FORMS.md) for complete guide
- **API reference**: See [REFERENCE.md](REFERENCE.md) for all methods
- **Examples**: See [EXAMPLES.md](EXAMPLES.md) for common patterns
```

Claude loads FORMS.md, REFERENCE.md, or EXAMPLES.md only when needed.

**Pattern 2: Domain-specific organization**

For Skills with multiple domains, organize content by domain to avoid loading irrelevant context:

```
bigquery-skill/
├── SKILL.md (overview and navigation)
└── reference/
    ├── finance.md (revenue, billing metrics)
    ├── sales.md (opportunities, pipeline)
    ├── product.md (API usage, features)
    └── marketing.md (campaigns, attribution)
```

When a user asks about sales metrics, Claude only reads sales.md.

Similarly, for skills supporting multiple frameworks or variants, organize by variant:

```
cloud-deploy/
├── SKILL.md (workflow + provider selection)
└── references/
    ├── aws.md (AWS deployment patterns)
    ├── gcp.md (GCP deployment patterns)
    └── azure.md (Azure deployment patterns)
```

When the user chooses AWS, Claude only reads aws.md.

**Pattern 3: Conditional details**

Show basic content, link to advanced content:

```markdown
# DOCX Processing

## Creating documents

Use docx-js for new documents. See [DOCX-JS.md](DOCX-JS.md).

## Editing documents

For simple edits, modify the XML directly.

**For tracked changes**: See [REDLINING.md](REDLINING.md)
**For OOXML details**: See [OOXML.md](OOXML.md)
```

Claude reads REDLINING.md or OOXML.md only when the user needs those features.

**Important guidelines:**

- **Avoid deeply nested references** - Keep references one level deep from SKILL.md. All reference files should link directly from SKILL.md.
- **Structure longer reference files** - For files longer than 100 lines, include a table of contents at the top so Claude can see the full scope when previewing.

## Skill Creation Process

Skill creation involves these steps:

1. Understand the skill with concrete examples
2. Plan reusable skill contents (scripts, references, assets)
3. Initialize the skill (run init_skill.py)
4. Edit the skill (implement resources and write SKILL.md)
5. Package the skill (run package_skill.py)
6. Iterate based on real usage

Follow these steps in order, skipping only if there is a clear reason why they are not applicable.

### Step 1: Understanding the Skill with Concrete Examples

Skip this step only when the skill's usage patterns are already clearly understood. It remains valuable even when working with an existing skill.

To create an effective skill, clearly understand concrete examples of how the skill will be used. This understanding can come from either direct user examples or generated examples that are validated with user feedback.

For example, when building an image-editor skill, relevant questions include:

- "What functionality should the image-editor skill support? Editing, rotating, anything else?"
- "Can you give some examples of how this skill would be used?"
- "I can imagine users asking for things like 'Remove the red-eye from this image' or 'Rotate this image'. Are there other ways you imagine this skill being used?"
- "What would a user say that should trigger this skill?"

To avoid overwhelming users, avoid asking too many questions in a single message. Start with the most important questions and follow up as needed for better effectiveness.

Conclude this step when there is a clear sense of the functionality the skill should support.

### Step 2: Planning the Reusable Skill Contents

To turn concrete examples into an effective skill, analyze each example by:

1. Considering how to execute on the example from scratch
2. Identifying what scripts, references, and assets would be helpful when executing these workflows repeatedly

Example: When building a `pdf-editor` skill to handle queries like "Help me rotate this PDF," the analysis shows:

1. Rotating a PDF requires re-writing the same code each time
2. A `scripts/rotate_pdf.py` script would be helpful to store in the skill

Example: When designing a `frontend-webapp-builder` skill for queries like "Build me a todo app" or "Build me a dashboard to track my steps," the analysis shows:

1. Writing a frontend webapp requires the same boilerplate HTML/React each time
2. An `assets/hello-world/` template containing the boilerplate HTML/React project files would be helpful to store in the skill

Example: When building a `big-query` skill to handle queries like "How many users have logged in today?" the analysis shows:

1. Querying BigQuery requires re-discovering the table schemas and relationships each time
2. A `references/schema.md` file documenting the table schemas would be helpful to store in the skill

To establish the skill's contents, analyze each concrete example to create a list of the reusable resources to include: scripts, references, and assets.

### Step 3: Initializing the Skill

At this point, it is time to actually create the skill.

Skip this step only if the skill being developed already exists, and iteration or packaging is needed. In this case, continue to the next step.

When creating a new skill from scratch, always run the `init_skill.py` script. The script conveniently generates a new template skill directory that automatically includes everything a skill requires, making the skill creation process much more efficient and reliable.

Usage:

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

The script:

- Creates the skill directory at the specified path
- Generates a SKILL.md template with proper frontmatter and TODO placeholders
- Creates example resource directories: `scripts/`, `references/`, and `assets/`
- Adds example files in each directory that can be customized or deleted

After initialization, customize or remove the generated SKILL.md and example files as needed.

### Step 4: Edit the Skill

When editing the (newly-generated or existing) skill, remember that the skill is being created for another instance of Claude to use. Include information that would be beneficial and non-obvious to Claude. Consider what procedural knowledge, domain-specific details, or reusable assets would help another Claude instance execute these tasks more effectively.

#### Learn Proven Design Patterns

Consult these helpful guides based on your skill's needs:

- **Multi-step processes**: See references/workflows.md for sequential workflows and conditional logic
- **Specific output formats or quality standards**: See references/output-patterns.md for template and example patterns

These files contain established best practices for effective skill design.

#### Start with Reusable Skill Contents

To begin implementation, start with the reusable resources identified above: `scripts/`, `references/`, and `assets/` files. Note that this step may require user input. For example, when implementing a `brand-guidelines` skill, the user may need to provide brand assets or templates to store in `assets/`, or documentation to store in `references/`.

Added scripts must be tested by actually running them to ensure there are no bugs and that the output matches what is expected. If there are many similar scripts, only a representative sample needs to be tested to ensure confidence that they all work while balancing time to completion.

Any example files and directories not needed for the skill should be deleted. The initialization script creates example files in `scripts/`, `references/`, and `assets/` to demonstrate structure, but most skills won't need all of them.

#### Update SKILL.md

**Writing Guidelines:** Always use imperative/infinitive form.

##### Frontmatter

Write the YAML frontmatter with `name` and `description`:

- `name`: The skill name
- `description`: This is the primary triggering mechanism for your skill, and helps Claude understand when to use the skill.
  - Include both what the Skill does and specific triggers/contexts for when to use it.
  - Include all "when to use" information here - Not in the body. The body is only loaded after triggering, so "When to Use This Skill" sections in the body are not helpful to Claude.
  - Example description for a `docx` skill: "Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. Use when Claude needs to work with professional documents (.docx files) for: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes, (4) Adding comments, or any other document tasks"

Do not include any other fields in YAML frontmatter.

##### Body

Write instructions for using the skill and its bundled resources.

### Step 5: Packaging a Skill

Once development of the skill is complete, it must be packaged into a distributable .skill file that gets shared with the user. The packaging process automatically validates the skill first to ensure it meets all requirements:

```bash
scripts/package_skill.py <path/to/skill-folder>
```

Optional output directory specification:

```bash
scripts/package_skill.py <path/to/skill-folder> ./dist
```

The packaging script will:

1. **Validate** the skill automatically, checking:

   - YAML frontmatter format and required fields
   - Skill naming conventions and directory structure
   - Description completeness and quality
   - File organization and resource references

2. **Package** the skill if validation passes, creating a .skill file named after the skill (e.g., `my-skill.skill`) that includes all files and maintains the proper directory structure for distribution. The .skill file is a zip file with a .skill extension.

If validation fails, the script will report the errors and exit without creating a package. Fix any validation errors and run the packaging command again.

### Step 6: Iterate

After testing the skill, users may request improvements. Often this happens right after using the skill, with fresh context of how the skill performed.

**Iteration workflow:**

1. Use the skill on real tasks
2. Notice struggles or inefficiencies
3. Identify how SKILL.md or bundled resources should be updated
4. Implement changes and test again

---

## WORKFLOWS (Execution)

---

### `workflows/backend-project-full-cycle.md`

---
name: backend-project-full-cycle
type: workflow
description: >
  Full backend project lifecycle workflow:
  planning → implementation → blackbox validation.
  Enforces strict phase separation and skill switching.
inputs:
  - project_name
  - project_dir
  - tech_stack
  - business_logic_description
outputs:
  - production_ready_service
related-rules:
  - project-setup-guide.md
  - code-quality-guide.md
  - env-settings-guide.md
  - testing-ci-guide.md
  - e2e-test-guide.md
  - svt-test-guide.md
  - ci-cd-deployment-guide.md
uses-skills:
  - prompt-project-planner
  - app-builder
  - blackbox-testing
---

## 🎯 Workflow Goal

Deliver a production-ready backend service with:

- approved plan
- clean implementation
- full unit + blackbox test coverage

Skipping phases or rules is forbidden.

---

## 🧠 Phase 1 — Planning

**Active skill:** `prompt-project-planner`

Rules:

- Planning only, no code
- No implementation inspection

Steps:

1. **Define Tech Stack:**
   - Determine Language, Framework, Database, and Messaging system.
   - If not provided in input, ask user to select from available options.
2. Ask clarifying questions about **Architecture & Requirements**:
   - Event schema & boundaries
   - Domain entities & relationships
   - Idempotency & deduplication strategies
   - Storage models & access patterns
   - Failure handling & retries
   - Throughput expectations & scaling
3. Do NOT write code.
4. Do NOT inspect source files.
5. Structure output strictly according to `output.schema.md`.
6. Generate artifacts:
   - `artifacts/plan_<task_id>.md`
7. Include in the plan:
   - Module layout inside `src/` (adapted to selected language)
   - Applied rules
   - Selected skills
   - This workflow reference

End condition:

- Ask explicitly:

> “Is the plan approved and may I proceed to implementation?”

---

## 🧑‍💻 Phase 2 — Implementation

**Active skill:** `app-builder`

Entry condition:

- Plan is explicitly approved by the user.

Rules:

- Code ONLY in `src/` (or strictly equivalent for the language)
- Unit tests ONLY in `tests/`

Steps:

1. Implement backend logic using **Selected Tech Stack**:
   - Adhere to the defined architecture (e.g., Domain/Service/Repository layers).
   - Use strict typing and validation where applicable (e.g., Pydantic for Python, Interfaces for TS).
   - Implement database migrations for any schema changes.
   - Implement clear boundaries for external systems (e.g., Kafka consumers).
2. Cover all logic with unit tests.
3. Ensure:
   - Formatting & Linting → passed (using project-standard tools)
   - Test Coverage → meets project threshold (default ≥ 70%)

Exit condition:

- All unit tests pass
- No rule violations detected

---

## 🧪 Phase 3 — Blackbox Validation

**Active skill:** `blackbox-testing`

Entry condition:

- Unit tests are green.

Rules:

- Blackbox only
- No unit-test logic duplication

### E2E Validation

Steps:

1. Start services via Docker.
2. Execute real API calls.
3. Validate full business flows.
4. Run:
   ```bash
   make e2e-test
   ```

---

### `workflows/feature-implementation-flow.md`

---
name: feature-implementation-flow
type: workflow
description: Focused workflow for implementing a single feature in an existing backend service.
inputs:
  - feature_request
  - existing_codebase
outputs:
  - implemented_feature
  - passing_tests
related-rules:
  - backend-architecture-rule.md
  - code-quality-guide.md
  - testing-ci-guide.md
uses-skills:
  - backend-developer
---

## 🎯 Workflow Goal

Implement a specific feature request into an existing service, adhering to layered architecture.

## 🛠️ Phase 1 — Analysis & Models

1.  **Understand Requirement:** Read the feature request and identify impacted domain entities.
2.  **Update Models:**
    - Modify `src/models/` (SQLAlchemy) if schema changes are needed.
    - Create usage migration (Alembic).
3.  **Update Schemas:**
    - Define Pydantic models in `src/schemas/` for Input/Output.

## 💻 Phase 2 — Implementation (Inner to Outer)

1.  **Repository Layer:**
    - Implement data access methods in `src/repositories/`.
    - Ensure IO-bound operations are async.
2.  **Service Layer:**
    - Implement business logic in `src/services/`.
    - Inject Repository dependencies.
    - Handle exceptions and convert to business errors.
3.  **API Layer:**
    - Add/Update endpoints in `src/api/`.
    - Connect Service methods to Endpoints.

## 🧪 Phase 3 — Verification

1.  **Unit Tests:**
    - Test Service logic (mocking Repositories).
    - Test Repository logic (using test DB or mocks).
2.  **Integration Tests:**
    - Test API endpoints (e2e) using a test client.
3.  **Quality Check:**
    - Verify no linting errors.
    - Verify strict typing.

---

### `workflows/testing-ci-pipeline.md`

---
name: testing-ci-pipeline
type: workflow
description: Run CI & Testing pipeline. Abstract workflow usable for both Backend and Frontend.
inputs:
  - project_type (backend|frontend)
  - test_scope (unit|e2e|all)
outputs:
  - test_report
related-rules:
  - testing-ci-guide.md
  - code-quality-guide.md
uses-skills:
  - blackbox-testing
---

# Testing & CI Workflow

**Goal:** Verify code quality and functionality.

## Steps

1.  **Code Quality Check**
    - Action: Run Linters & Formatters.
    - Expectation: No errors.
    - _Note:_ Uses project-specific tools (e.g., `ruff` for Python, `eslint` for JS).

2.  **Unit Tests**
    - Action: Run Unit Tests.
    - Expectation: Pass with required coverage.

3.  **Build / Prepare (If applicable)**
    - Action: Build artifacts or Docker containers.
    - Expectation: Successful build.

4.  **E2E / Integration Tests**
    - Action: Run Blackbox/E2E tests.
    - Condition: If `test_scope` includes 'e2e' or 'all'.
    - Expectation: All scenarios pass.

## Failure Policy

- If any step fails, the pipeline halts.
- Fix violations before proceeding.

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
- Skills: `skills/*/*.md`
- Workflows: `workflows/*.md`
- Prompts: `prompts/*.md`
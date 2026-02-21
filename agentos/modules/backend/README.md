# .agent-os Backend Module

This directory contains the deep specialization rules, skills, workflows, and prompts for the **Backend Engineering** domain.

This specialization is engineered for modern, robust backend systems that rely on:
- **Architecture**: Microservices, Clean/Hexagonal Architecture.
- **Security**: Zero Trust Architecture, OWASP standards, RBAC/ABAC.
- **Tech Agnosticism**: Deep principles applicable across Python/FastAPI, Go, Node.js/NestJS, Java, Rust.
- **Databases**: PostgreSQL (OLTP), Redis (Caching/Locks), ClickHouse (OLAP/Analytics).
- **Asynchronous Processing**: NATS, Kafka, RabbitMQ, Celery, BullMQ.
- **Telemetry**: Prometheus, OpenTelemetry, Structured JSON Logging.
- **Quality**: Unit, Integration (Testcontainers), E2E, SVT tests.

## Ecosystem Content

### 1. Rules (`/rules`)
The immutable constraints of the backend world. Agent will strictly abide by these.
- `architecture.md` - Service boundaries, ZTA, Clean Arch.
- `data_access.md` - Polyglot Persistence, No N+1, Safe Migrations.
- `security.md` - OWASP Top 10 mitigations.
- `testing.md` - Testing Pyramid strategy.

### 2. Skills (`/skills`)
Active knowledge to execute specialized tasks.
- `api-design.md` - RESTful semantics and gRPC contracts.
- `database-modeling.md` - Indices, scaling, ClickHouse patterns.
- `async-processing.md` - Event-Driven Architecture, Outbox, DLQ.
- `observability.md` - RED/USE methodology and distributed tracing.
- `troubleshooting.md` - RCA, categorizing HTTP errors, fixing N+1 and OOMs.

### 3. Workflows (`/workflows`)
Step-by-step algorithms for repetitive backend chores.
- `develop-epic.md` - High-level system design and task decomposition for large features.
- `develop-feature.md` - Developing a single vertical slice from DB to API.
- `test-feature.md` - Applying the testing pyramid to existing code.
- `debug-issue.md` - Root Cause Analysis and bug fixing strategy.
- `create-endpoint.md` - From DTO validation to presentation.
- `add-migration.md` - Safe backward-compatible schema changes.
- `refactor-module.md` - Strangler fig extraction from legacy.

### 4. Prompts (`/prompts`)
System instructions configuring the Agent's persona and context.
- `system-prompt.md` - Base instruction for the Senior Backend Agent.
- `code-review.md` - Uncompromising code review checklist.
- `develop-epic.md` - Prompt to kick off an epic structure.
- `develop-feature.md` - Prompt to build a standalone feature.
- `test-feature.md` - Prompt to generate comprehensive tests.
- `debug-issue.md` - Prompt to find the exact root cause of an incident.

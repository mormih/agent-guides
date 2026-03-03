# PROMPTS: backend

Use these prompts with `backend/AGENTS.md` from the same directory.

## 1) Initialize backend agent behavior

```text
Read `backend/AGENTS.md` and apply all backend rules as hard constraints.
Before implementation, return:
1) selected workflow,
2) loaded skills,
3) implementation plan,
4) risk list.
```

## 2) Develop backend feature

```text
Using `backend/AGENTS.md`, implement: <feature description>.
Mandatory pre-coding output:
- architecture notes,
- data model/query impact,
- security checks,
- test plan.
After coding: run checks and report exact commands and results.
```

## 3) Create endpoint

```text
Using `backend/AGENTS.md`, create endpoint: <method + path + contract>.
Include request/response DTOs, validation, authZ, error mapping, tests,
and observability (metrics/logs/tracing) updates.
```

## 4) Incident / debug mode

```text
Using `backend/AGENTS.md`, triage incident: <incident summary>.
Return root-cause hypotheses, validation steps, minimal fix,
regression tests, and rollback plan.
```

## 5) Safe migration

```text
Using `backend/AGENTS.md`, implement migration: <schema change>.
Produce backward-compatible rollout plan, migration SQL/code,
verification queries, and rollback strategy.
```

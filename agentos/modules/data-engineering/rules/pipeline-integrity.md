# Rule: Pipeline Integrity

**Priority**: P0 — Violated pipelines are halted; downstream consumers notified.

## Constraints

1. **Idempotency**: Every pipeline produces identical output given identical input, regardless of how many times it runs.
2. **Exactly-once semantics**: Pipelines writing to sinks must implement deduplication. Preferred: natural keys + `INSERT OVERWRITE`.
3. **Fail loudly**: Pipelines must fail explicitly on data quality violations. Silent data corruption is a P0 incident.
4. **Lineage tracking**: Every table must have documented source lineage. "Orphan" tables eligible for deprecation after 30-day notice.
5. **No direct production writes from development**: Never point dev/staging pipelines to production. Use environment variables; never hardcode targets.

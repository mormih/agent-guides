# Rule: Database Backup Policy

**Priority**: P0 — Missing or unverified backups are a critical operational failure.

## Backup Requirements

1. **Continuous WAL archiving** — PostgreSQL WAL archived to object storage (S3/GCS/MinIO) for PITR.
2. **Daily full snapshots** — in addition to WAL archiving; retained per schedule below.
3. **Backup verification** — weekly restore test to isolated environment; result logged.
4. **Backup encryption** — all backups encrypted at rest (AES-256 or KMS).

## Retention Schedule

| Backup type | Retention |
|:---|:---|
| Hourly (WAL) | 7 days |
| Daily full | 30 days |
| Weekly full | 3 months |
| Monthly full | 1 year |
| Pre-migration snapshot | Until next major release |

## Recovery Objectives

| Tier | RTO | RPO |
|:---|:---|:---|
| Tier 1 (revenue-critical) | 30 min | 15 min (PITR) |
| Tier 2 (internal tools) | 4 hours | 1 hour |

## Monitoring

- Alert if no backup completed in last 26 hours.
- Alert if backup size deviates > 20% from rolling average (data loss or corruption indicator).
- Backup storage capacity alert at 70% full.

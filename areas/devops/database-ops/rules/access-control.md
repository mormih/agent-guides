# Rule: Database Access Control

**Priority**: P0 — Database access follows least-privilege; no wildcard grants.

## Role Separation

| Role | Permissions | Who/what |
|:---|:---|:---|
| `app_<service>` | SELECT, INSERT, UPDATE, DELETE on owned tables | Application service |
| `readonly_<service>` | SELECT only | Reporting, analytics, support |
| `migration_<service>` | DDL (CREATE, ALTER, DROP) on owned schema | CI/CD migration runner (transient) |
| `superuser` | ALL | DBAs only; MFA required; session-logged |

## Rules

1. **Application role never has DDL permissions** — migrations run as a separate migration role.
2. **No shared passwords** — each service has its own credential in Vault/Secrets Manager.
3. **Connection pooling required** — all apps connect via PgBouncer (transaction mode); no direct K8s pod → PostgreSQL.
4. **Access log** — `pgaudit` extension enabled for all DDL and suspicious DML patterns.
5. **Public schema dropped** — `DROP SCHEMA public; CREATE SCHEMA <service>` — no default public schema exposure.

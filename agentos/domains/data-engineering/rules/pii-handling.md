# Rule: PII Data Handling

**Priority**: P0 — PII exposure is a regulatory incident.

## PII Classification

| Type | Examples | Treatment |
|:---|:---|:---|
| Direct identifiers | Full name, email, phone, SSN | Hash (SHA-256 + salt) or tokenize |
| Quasi-identifiers | Date of birth, ZIP, gender | Generalize in analytics |
| Sensitive attributes | Health, financial, political views | Column-level encryption + RBAC |
| Behavioral data | Clickstream, location history | Aggregate only; row-level PII purged after 30 days |

## Constraints

1. **No PII in warehouse tables by default**: Analytical tables contain `user_id` (hashed/tokenized), never email or name.
2. **Data minimization**: Collect only what is needed. Each new data source requires documented business justification.
3. **Right to erasure**: User deletion propagates to all tables within 30 days.
4. **Cross-border restrictions**: EU resident data cannot be stored in non-EU regions without SCCs.

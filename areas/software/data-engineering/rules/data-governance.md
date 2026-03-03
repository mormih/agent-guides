# Rule: Data Governance

**Priority**: P1 — Required before data is consumed by dashboards or downstream services.

## Constraints

1. **Table documentation**: Every warehouse table must have `description` and owner annotation.
2. **Column documentation**: All columns with non-obvious meaning must be documented.
3. **SLA declaration**: Every pipeline must declare its freshness SLA. Breach of SLA by > 2x must page data on-call.
4. **Data classification**: Every table classified as: `PUBLIC` / `INTERNAL` / `CONFIDENTIAL` / `RESTRICTED`.
5. **Deprecation policy**: Unused tables (no queries in 90 days) flagged; archived after 30-day notice.

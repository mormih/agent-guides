# Rule: Production Migration Safety

**Priority**: P0 — Unsafe migrations cause data loss or production downtime.

## Safe Migration Principles

1. **Expand-and-Contract pattern** for breaking changes:
   ```
   Phase 1 (expand): add new column/table; old code still works
   Phase 2 (dual-write): code writes to both old and new; read from new
   Phase 3 (migrate): backfill data from old to new
   Phase 4 (contract): remove old column/table; code reads only from new
   ```
   Never rename a column directly in production — use expand-and-contract.

2. **Backward compatibility required** — migration must not break the current version of the app.
   Running migration before deploy means old code still runs against new schema.

3. **Test migration on staging with production-size data** — migration that takes 10s on 1K rows may take 30 min on 50M rows.

4. **Pre-migration backup required** — snapshot before every production migration.

5. **Lock-safe DDL** — prefer `CREATE INDEX CONCURRENTLY`; avoid `ALTER TABLE ... ADD COLUMN NOT NULL DEFAULT` on large tables (locks entire table).

## Migration Checklist

- [ ] Tested on staging with production row count (or estimated)
- [ ] Estimated execution time documented (seconds / minutes / hours)
- [ ] Pre-migration backup taken and verified
- [ ] Rollback SQL prepared and tested
- [ ] Maintenance window communicated if > 5 min impact
- [ ] Connection pool configured to handle migration lock wait

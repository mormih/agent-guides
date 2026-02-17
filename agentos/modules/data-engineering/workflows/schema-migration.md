# Workflow: `/schema-migration`

**Trigger**: `/schema-migration [--table fct_orders] [--change rename-column|add-column|change-type|drop-column]`

**Purpose**: Execute a schema migration safely with downstream impact management.

## Steps

```
Step 1: CLASSIFY change
  - Non-breaking (add nullable column): proceed to Step 3
  - Breaking: requires impact assessment

Step 2: IMPACT ASSESSMENT
  - Run /lineage-trace to identify all affected downstream
  - Notify downstream owners with 5-business-day notice minimum

Step 3: MIGRATION STRATEGY
  Column rename:
    Phase 1: Add new column, populate from old
    Phase 2: Migrate downstream models
    Phase 3: Mark old column deprecated
    Phase 4 (30 days later): Drop old column

Step 4: EXECUTE
  - Generate and review migration SQL
  - Run in staging first; validate with dbt tests
  - Execute in production in off-peak window

Step 5: VERIFY and DOCUMENT
  - Confirm all dbt tests pass post-migration
  - Update YAML docs and data catalog
  - Announce completion to downstream owners
```

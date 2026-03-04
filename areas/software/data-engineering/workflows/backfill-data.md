# Workflow: `/backfill-data`

**Trigger**: `/backfill-data [--model model_name] [--start 2025-01-01] [--end 2025-12-31]`

**Purpose**: Safely reprocess historical data without disrupting live pipelines or downstream consumers.

## Workflow

```
@developer (assess impact & create script) → @qa (validate on sample) → 
@developer (execute backfill) → @qa (validate results) → Report
```

## Steps

```
Step 1: ASSESS impact
  - Identify all downstream models depending on target
  - Estimate row count and processing time
  - Check if model consumed by real-time dashboards

Step 2: PLAN execution
  - Calculate optimal batch size (avoid OOM)
  - Recommend: batch by month for > 6 months of data
  - Estimate total cost (Snowflake credits, BigQuery bytes)

Step 3: CREATE backfill script
  - dbt run --select {model} --full-refresh  (small models)
  - Chunked SQL with progress logging (large ranges)

Step 4: VALIDATE plan
  - Run on single-day partition first
  - Compare row counts with source
  - Check for duplicates on unique key

Step 5: EXECUTE
  - Run in off-peak hours
  - Log progress every N batches
  - On failure: report which partition failed; rest untouched

Step 6: POST-BACKFILL
  - Run dbt tests on backfilled model
  - Compare key metrics before/after
  - Notify downstream consumers
```

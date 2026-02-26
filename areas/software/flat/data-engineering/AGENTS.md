# `agent-config` Domain Package: Data Engineering

> **Version**: 1.0.0
> **Stack**: dbt / Apache Airflow (Dagster annotations) / Spark / Kafka / Snowflake / BigQuery
> **Scope**: ETL/ELT pipelines, data warehousing, data quality, governance, streaming

---

## Package Structure

```
agent-config/
└── data-engineering/
    ├── rules/
    │   ├── pipeline-integrity.md
    │   ├── data-governance.md
    │   ├── schema-management.md
    │   └── pii-handling.md
    ├── skills/
    │   ├── sql-optimization.md
    │   ├── data-modeling.md
    │   ├── quality-checks.md
    │   ├── orchestration.md
    │   ├── streaming-patterns.md
    │   ├── dbt-patterns.md
    │   └── lineage-governance.md
    └── workflows/
        ├── new-model.md
        ├── backfill-data.md
        ├── lineage-trace.md
        ├── data-quality-incident.md
        └── schema-migration.md
```

---

## RULES (Kernel)

---

### `rules/pipeline-integrity.md`

# Rule: Pipeline Integrity

**Priority**: P0 — Violated pipelines are halted until fixed; downstream consumers notified.

## Constraints

1. **Idempotency**: Every pipeline must produce identical output given identical input, regardless of how many times it runs. Re-running a pipeline on already-processed data must not create duplicates.
2. **Exactly-once semantics**: Pipelines that write to sinks must implement deduplication. Preferred: use natural keys + `INSERT OVERWRITE` partition patterns. Fallback: staging table + merge/upsert.
3. **Fail loudly**: Pipelines must fail explicitly on data quality violations. Silent data corruption (wrong values, missing rows without alerting) is a P0 incident.
4. **Lineage tracking**: Every table/dataset must have documented source lineage. "Orphan" tables with unknown origin are subject to deprecation after 30-day notice.
5. **No direct production writes from development**: Pipelines running in dev/staging must never point to production databases or warehouses. Use environment variables; never hardcode targets.

---

### `rules/data-governance.md`

# Rule: Data Governance

**Priority**: P1 — Required before any data is consumed by dashboards or downstream services.

## Constraints

1. **Table documentation**: Every table in the data warehouse must have a `description` field and owner annotation. Undocumented tables cannot be published to the data catalog.
2. **Column documentation**: All columns with non-obvious meaning must be documented. Key columns (IDs, status enums, calculated metrics) always require documentation.
3. **SLA declaration**: Every pipeline must declare its freshness SLA (e.g., "updated daily by 06:00 UTC"). Pipelines that breach SLA by > 2x must page the data on-call.
4. **Data classification**: Every table must be classified:
   - `PUBLIC`: No restrictions; can be shared with external partners
   - `INTERNAL`: Employees only; no external sharing
   - `CONFIDENTIAL`: Role-based access; audit log on access
   - `RESTRICTED`: Named access list; legal/finance/health data
5. **Deprecation policy**: Unused tables (no queries in 90 days) are flagged for deprecation. Owner is notified; table is archived after 30-day notice period.

---

### `rules/schema-management.md`

# Rule: Schema Management

**Priority**: P0 — Breaking changes cause immediate downstream failures.

## Constraints

1. **No breaking changes without migration plan**: The following are breaking changes:
   - Renaming or dropping a column
   - Changing a column's data type to an incompatible type
   - Adding a NOT NULL column without a default value
   - Changing partition keys
2. **Additive changes are safe**: Adding new nullable columns, new tables, or new partitions are non-breaking.
3. **Contract versioning**: Tables consumed by external systems (BI tools, ML training, APIs) must be versioned (`orders_v1`, `orders_v2`) during migrations. Old version maintained for ≥ 30 days.
4. **Schema registry for streaming**: All Kafka topics must have schemas registered in a schema registry (Confluent Schema Registry or AWS Glue Schema Registry). Producers must validate against schema before publishing.

---

### `rules/pii-handling.md`

# Rule: PII Data Handling

**Priority**: P0 — PII exposure is a regulatory incident.

## PII Classification

| Type | Examples | Required Treatment |
|:---|:---|:---|
| Direct identifiers | Full name, email, phone, SSN, passport | Hash (SHA-256 + salt) or tokenize; never in analytical layer |
| Quasi-identifiers | Date of birth, ZIP code, gender | Generalize (year only, 3-digit ZIP) when in analytics |
| Sensitive attributes | Health data, financial data, political views | Encrypt at column level; role-based access |
| Behavioral data | Clickstream, location history | Aggregate only; row-level PII purged after 30 days |

## Constraints

1. **No PII in warehouse tables by default**: Production analytical tables must contain user_id (hashed/tokenized), never email or name. PII is accessible only in a dedicated, audited PII zone.
2. **Data minimization**: Collect only what is needed for the stated purpose. Each new data source requires documented business justification.
3. **Right to erasure**: User deletion requests must propagate to all tables containing that user's data within 30 days. Use soft-delete + purge job pattern.
4. **Cross-border data restrictions**: Data of EU residents cannot be stored in non-EU regions without SCCs in place. Implement data residency at the pipeline level.

---

## SKILLS (Libraries)

---

### `skills/sql-optimization.md`

# Skill: SQL Optimization

## When to load

When writing complex queries, optimizing slow queries, designing indexes, or reviewing query performance.

## Query Performance Checklist

```sql
-- ✅ Use column projection — never SELECT *
SELECT user_id, created_at, total_amount
FROM orders
WHERE created_at >= '2026-01-01';

-- ✅ Partition pruning — always filter on partition columns first
-- (assumes orders is partitioned by date)
SELECT user_id, total_amount
FROM orders
WHERE order_date = '2026-01-15'  -- partition filter first
  AND status = 'completed';      -- then additional filters

-- ❌ Anti-pattern: function on indexed column prevents index use
WHERE DATE(created_at) = '2026-01-15'   -- forces full scan
-- ✅ Fix: range comparison preserves index
WHERE created_at >= '2026-01-15' AND created_at < '2026-01-16'
```

## Window Functions (Prefer Over Self-Joins)

```sql
-- ❌ Expensive self-join
SELECT a.user_id, a.order_date, a.amount,
       (SELECT SUM(b.amount) FROM orders b WHERE b.user_id = a.user_id AND b.order_date <= a.order_date) AS cumulative
FROM orders a;

-- ✅ Window function: single scan
SELECT
    user_id,
    order_date,
    amount,
    SUM(amount) OVER (
        PARTITION BY user_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_amount,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY order_date DESC) AS recency_rank
FROM orders;
```

## CTE vs Subquery Decision

```sql
-- Use CTEs for readability and reuse; Snowflake/BigQuery optimize them well
WITH
active_users AS (
    SELECT user_id
    FROM users
    WHERE last_login_at >= CURRENT_DATE - INTERVAL '30 days'
      AND status = 'active'
),
recent_orders AS (
    SELECT user_id, COUNT(*) AS order_count, SUM(amount) AS total_spent
    FROM orders
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY user_id
)
SELECT
    u.user_id,
    COALESCE(ro.order_count, 0) AS orders_last_30d,
    COALESCE(ro.total_spent, 0) AS spend_last_30d
FROM active_users u
LEFT JOIN recent_orders ro USING (user_id);
```

## Snowflake-Specific Optimizations

```sql
-- Cluster keys on large tables (> 1 TB) for common filter patterns
ALTER TABLE orders CLUSTER BY (order_date, status);

-- Result cache: identical queries return instantly for 24h
-- Don't defeat it by using CURRENT_TIMESTAMP in queries where a static date works

-- COPY INTO for bulk loads — never row-by-row INSERT
COPY INTO orders
FROM @my_stage/orders/
FILE_FORMAT = (TYPE = PARQUET)
MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE;
```

---

### `skills/data-modeling.md`

# Skill: Data Modeling

## When to load

When designing a new data warehouse schema, choosing between modeling approaches, or refactoring an existing data model.

## Modeling Approach Decision Tree

```
Question 1: Who is the primary consumer?
  → BI tools + business analysts: Kimball (dimensional)
  → Data science + ML: Wide denormalized tables
  → Multiple teams with different needs: Data Vault (hub-and-spoke)
  → Real-time applications: OLTP normalized (3NF)

Question 2: How often does history need to change?
  → Never/rarely: Type 1 SCD (overwrite)
  → Track current + previous: Type 2 SCD (versioned rows)
  → Store full history: Type 4 (history table) or Data Vault

Question 3: Scale?
  → < 100 GB: Simple star schema sufficient
  → 100 GB – 10 TB: Partitioned star schema
  → > 10 TB: Data Vault or Lakehouse (Delta/Iceberg)
```

## Kimball Star Schema Pattern

```sql
-- Fact table: events, transactions (additive/semi-additive measures)
CREATE TABLE fct_orders (
    order_key       BIGINT PRIMARY KEY,  -- surrogate key
    order_id        VARCHAR NOT NULL,    -- natural/business key
    user_key        BIGINT REFERENCES dim_users(user_key),
    product_key     BIGINT REFERENCES dim_products(product_key),
    date_key        INT REFERENCES dim_date(date_key),
    -- Measures (always numeric, ideally additive)
    quantity        INT NOT NULL,
    unit_price      NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    total_amount    NUMERIC(10,2) NOT NULL,
    -- Audit columns
    loaded_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_system   VARCHAR DEFAULT 'orders-api'
);

-- Dimension: slowly changing attributes of entities
CREATE TABLE dim_users (
    user_key            BIGINT PRIMARY KEY,   -- surrogate key
    user_id             VARCHAR NOT NULL,     -- natural key
    email_hash          VARCHAR NOT NULL,     -- hashed PII
    -- SCD Type 2 columns
    valid_from          TIMESTAMP NOT NULL,
    valid_to            TIMESTAMP,            -- NULL = current record
    is_current          BOOLEAN DEFAULT TRUE,
    -- Descriptive attributes
    country_code        CHAR(2),
    acquisition_channel VARCHAR
);
```

## dbt Layering Convention (Medallion Architecture)

```
sources/          ← Raw data as-is from source systems (no transformations)
  ├── raw_orders
  └── raw_users

staging/ (silver) ← Cleaned, renamed, typed. 1:1 with source tables.
  ├── stg_orders  (snake_case columns, proper types, basic deduplication)
  └── stg_users

intermediate/     ← Business logic, joins. Not exposed directly.
  └── int_orders_with_user_info

marts/ (gold)     ← Dimensional models, wide tables for specific use cases
  ├── core/
  │   ├── fct_orders
  │   └── dim_users
  └── finance/
      └── rpt_monthly_revenue
```

---

### `skills/quality-checks.md`

# Skill: Data Quality Checks

## When to load

When adding tests to dbt models, implementing data validation, investigating data quality incidents, or setting up monitoring.

## dbt Test Taxonomy

```yaml
# models/marts/core/fct_orders.yml

models:
  - name: fct_orders
    description: "One row per order. Grain: order_id."
    columns:
      - name: order_key
        tests:
          - unique          # No duplicates
          - not_null        # Required

      - name: user_key
        tests:
          - not_null
          - relationships:  # Referential integrity
              to: ref('dim_users')
              field: user_key

      - name: total_amount
        tests:
          - not_null
          - dbt_utils.expression_is_true:
              expression: ">= 0"  # No negative amounts

      - name: order_status
        tests:
          - accepted_values:
              values: ['pending', 'processing', 'completed', 'cancelled', 'refunded']

    # Table-level tests
    tests:
      - dbt_utils.recency:
          datepart: hour
          field: loaded_at
          interval: 4        # Alert if no new data in 4 hours

      - dbt_utils.row_count:
          minimum: 100       # Minimum rows expected per run
```

## Great Expectations Patterns (for Spark/Python pipelines)

```python
import great_expectations as ge

def validate_orders(df: pd.DataFrame) -> bool:
    ge_df = ge.from_pandas(df)

    results = ge_df.expect_column_values_to_not_be_null("order_id")
    results &= ge_df.expect_column_values_to_be_unique("order_id")
    results &= ge_df.expect_column_values_to_be_between("total_amount", 0, 1_000_000)
    results &= ge_df.expect_column_values_to_match_regex(
        "email_hash", r"^[a-f0-9]{64}$"
    )
    results &= ge_df.expect_table_row_count_to_be_between(
        min_value=1000, max_value=10_000_000
    )

    if not results["success"]:
        # Log specific failures before raising
        logger.error("Data quality failure", failures=results["results"])
        raise DataQualityError(results)
    return True
```

## Anomaly Detection (Volume Monitoring)

```sql
-- dbt model: monitors/volume_anomalies.sql
-- Alerts when daily row count deviates > 3σ from 30-day rolling average

WITH daily_counts AS (
    SELECT
        DATE(loaded_at) AS load_date,
        COUNT(*) AS row_count
    FROM {{ ref('fct_orders') }}
    WHERE loaded_at >= CURRENT_DATE - 35
    GROUP BY 1
),
stats AS (
    SELECT
        load_date,
        row_count,
        AVG(row_count) OVER (ORDER BY load_date ROWS BETWEEN 29 PRECEDING AND 1 PRECEDING) AS rolling_avg,
        STDDEV(row_count) OVER (ORDER BY load_date ROWS BETWEEN 29 PRECEDING AND 1 PRECEDING) AS rolling_std
    FROM daily_counts
)
SELECT *,
    CASE WHEN ABS(row_count - rolling_avg) > 3 * rolling_std THEN 'ANOMALY' ELSE 'OK' END AS status
FROM stats
WHERE load_date = CURRENT_DATE - 1;
```

---

### `skills/orchestration.md`

# Skill: Pipeline Orchestration

## When to load

When designing DAGs, debugging pipeline failures, handling dependencies between pipelines, or configuring retries.

## Airflow DAG Design Principles

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.utils.task_group import TaskGroup
from datetime import datetime, timedelta

# ✅ Default args applied to all tasks
default_args = {
    "owner": "data-platform",
    "depends_on_past": False,          # Don't block on previous run's failure
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
    "retry_exponential_backoff": True,  # Backoff for transient failures
    "email_on_failure": True,
    "email": ["data-oncall@mycompany.com"],
}

with DAG(
    dag_id="orders_pipeline",
    default_args=default_args,
    schedule="0 4 * * *",          # Daily at 04:00 UTC
    start_date=datetime(2026, 1, 1),
    catchup=False,                  # ← Never True in production; causes backfill avalanche
    max_active_runs=1,              # Prevent concurrent runs of same DAG
    tags=["orders", "tier-1"],
    doc_md="""
    ## Orders Pipeline
    Loads orders from source → staging → marts.
    SLA: Completes by 06:00 UTC daily.
    Owner: data-platform@mycompany.com
    """,
) as dag:

    # Group related tasks
    with TaskGroup("extract") as extract:
        extract_orders = PythonOperator(task_id="extract_orders", ...)
        extract_refunds = PythonOperator(task_id="extract_refunds", ...)

    with TaskGroup("transform") as transform:
        run_dbt = BashOperator(
            task_id="run_dbt_models",
            bash_command="dbt run --select orders+ --target prod",
        )
        run_tests = BashOperator(
            task_id="run_dbt_tests",
            bash_command="dbt test --select orders+ --target prod",
        )
        run_dbt >> run_tests

    extract >> transform
```

## Idempotent Task Pattern

```python
def load_orders(execution_date: str, **context):
    """
    Idempotent: safe to retry. Uses execution_date partition.
    DELETE + INSERT pattern ensures no duplicates.
    """
    partition = execution_date[:10]  # "2026-01-15"

    with warehouse.connect() as conn:
        # 1. Delete target partition
        conn.execute(f"DELETE FROM stg_orders WHERE order_date = '{partition}'")
        # 2. Insert fresh data
        conn.execute(f"""
            INSERT INTO stg_orders
            SELECT * FROM raw_orders
            WHERE DATE(created_at) = '{partition}'
        """)
```

---

### `skills/streaming-patterns.md`

# Skill: Streaming Data Patterns

## When to load

When designing Kafka consumers/producers, implementing real-time pipelines, or handling event-driven data flows.

## Kafka Producer Best Practices

```python
from confluent_kafka import Producer
from confluent_kafka.schema_registry import SchemaRegistryClient
from confluent_kafka.schema_registry.avro import AvroSerializer

# ✅ Schema-enforced producer
schema_registry = SchemaRegistryClient({"url": settings.SCHEMA_REGISTRY_URL})
avro_serializer = AvroSerializer(schema_registry, ORDER_SCHEMA)

producer = Producer({
    "bootstrap.servers": settings.KAFKA_BROKERS,
    "acks": "all",              # Wait for all replicas (durability)
    "retries": 5,               # Retry transient failures
    "enable.idempotence": True, # Exactly-once delivery
    "compression.type": "snappy",
})

def publish_order_event(order: Order) -> None:
    producer.produce(
        topic="orders.created.v1",
        key=str(order.user_id),     # Partition by user for ordering guarantees
        value=avro_serializer(order.to_dict(), SerializationContext("orders.created.v1", MessageField.VALUE)),
        on_delivery=delivery_callback,
    )
    producer.poll(0)  # Trigger delivery callbacks
```

## Consumer Group Patterns

```python
consumer = Consumer({
    "bootstrap.servers": settings.KAFKA_BROKERS,
    "group.id": "order-processor-v1",   # Version group.id when changing consumer logic
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False,         # Manual commit: only after successful processing
    "max.poll.interval.ms": 300000,      # Allow time for slow processing
})

def consume_orders():
    consumer.subscribe(["orders.created.v1"])
    while True:
        msg = consumer.poll(timeout=1.0)
        if msg is None: continue
        if msg.error(): handle_error(msg.error()); continue

        try:
            order = deserialize(msg.value())
            process_order(order)
            consumer.commit(msg)  # Only commit after successful processing
        except ProcessingError as e:
            # Send to dead-letter topic; don't block partition
            publish_to_dlq(msg, e)
            consumer.commit(msg)
```

## Dead Letter Queue Pattern

```
All streaming pipelines must have a DLQ:
  orders.created.v1         → normal flow
  orders.created.v1.dlq     → failed messages with error metadata

DLQ message envelope:
{
  "original_topic": "orders.created.v1",
  "original_offset": 12345,
  "original_partition": 3,
  "original_payload": "...",
  "error_message": "Deserialization failed: unknown field 'discount_v2'",
  "error_timestamp": "2026-02-16T10:30:00Z",
  "retry_count": 3
}
```

---

### `skills/dbt-patterns.md`

# Skill: dbt Development Patterns

## When to load

When building dbt models, writing macros, configuring materializations, or reviewing dbt PRs.

## Materialization Strategy

| Model Layer | Materialization | Why |
|:---|:---|:---|
| `staging/` | `view` | Lightweight; always reflects source; easy to debug |
| `intermediate/` | `ephemeral` or `view` | Not needed as persistent table; reduce warehouse clutter |
| `marts/` | `table` or `incremental` | Queried frequently by BI; should be pre-computed |
| Large `marts/` | `incremental` | Process only new/changed rows; not full refresh |

## Incremental Model Pattern

```sql
-- models/marts/core/fct_orders.sql
{{
    config(
        materialized='incremental',
        unique_key='order_id',
        incremental_strategy='merge',  -- or 'delete+insert' for immutable fact tables
        partition_by={'field': 'order_date', 'data_type': 'date'},
        cluster_by=['user_id']
    )
}}

SELECT
    {{ dbt_utils.generate_surrogate_key(['order_id']) }} AS order_key,
    order_id,
    user_id,
    order_date,
    total_amount
FROM {{ ref('stg_orders') }}

{% if is_incremental() %}
    -- Only process new/updated records since last run
    WHERE order_date >= (SELECT MAX(order_date) FROM {{ this }}) - INTERVAL '3 days'
    -- 3-day lookback to catch late-arriving records
{% endif %}
```

## Macro: Standardized Audit Columns

```sql
-- macros/audit_columns.sql
{% macro audit_columns() %}
    CURRENT_TIMESTAMP AS loaded_at,
    '{{ invocation_id }}' AS dbt_invocation_id,
    '{{ this.name }}' AS dbt_model
{% endmacro %}

-- Usage in every mart model:
SELECT
    order_id,
    total_amount,
    {{ audit_columns() }}
FROM {{ ref('stg_orders') }}
```

---

## WORKFLOWS (Applications)

---

### `workflows/new-model.md`

# Workflow: `/new-model`

**Trigger**: `/new-model [model_name] [--layer staging|intermediate|mart] [--source source_table]`

**Purpose**: Scaffold a complete dbt model with documentation, tests, and lineage.

## Steps

```
Step 1: PARSE inputs
  - Validate model_name (snake_case)
  - Determine target directory from --layer flag
  - Identify source table schema if --source provided

Step 2: GENERATE model SQL
  - staging: SELECT with column renaming, type casting, deduplication
  - intermediate: business logic JOIN template
  - mart: fact/dimension template with surrogate key and audit columns

Step 3: GENERATE YAML documentation
  - model description from name inference
  - Auto-detect columns from SQL SELECT clause
  - Add standard tests: unique/not_null on PK, relationships on FKs
  - Add recency test if time-series model

Step 4: VALIDATE model
  - dbt compile --select {model_name}  (check Jinja renders)
  - dbt test --select {model_name} --empty  (schema tests pass on empty relation)

Step 5: GENERATE lineage entry
  - Update data catalog entry if catalog tool is configured
  - Add model to sources.yml if new source is referenced

Step 6: OUTPUT summary
  - List created files
  - Show compiled SQL preview
  - Suggest: "Run `dbt run --select {model_name}` to materialize"
```

---

### `workflows/backfill-data.md`

# Workflow: `/backfill-data`

**Trigger**: `/backfill-data [--model model_name] [--start 2025-01-01] [--end 2025-12-31]`

**Purpose**: Safely reprocess historical data without disrupting live pipelines or downstream consumers.

## Steps

```
Step 1: ASSESS impact
  - Identify all downstream models that depend on target model
  - Estimate row count and processing time for date range
  - Check if model is consumed by real-time dashboards (coordinate with stakeholders)

Step 2: PLAN execution
  - Calculate optimal batch size (avoid warehouse OOM)
  - Recommend: batch by month for > 6 months of data
  - Estimate total cost (Snowflake credits, BigQuery bytes scanned)

Step 3: CREATE backfill script
  Generate either:
  - dbt: dbt run --select {model} --full-refresh  (for small models)
  - Airflow: DAG with date-partitioned tasks (for large ranges)
  - Python: chunked SQL with progress logging

Step 4: VALIDATE plan
  - Run on single-day partition first: confirm output looks correct
  - Compare row counts with source system
  - Check for duplicates on unique key

Step 5: EXECUTE backfill
  - Run in off-peak hours (avoid competing with production load)
  - Log progress every N batches
  - On failure: report which partition failed; remaining partitions untouched

Step 6: POST-BACKFILL validation
  - Run dbt tests on backfilled model
  - Compare key metrics before/after in a reconciliation query
  - Notify downstream consumers that data has been refreshed
```

---

### `workflows/lineage-trace.md`

# Workflow: `/lineage-trace`

**Trigger**: `/lineage-trace [--column table.column_name] [--direction upstream|downstream|both]`

**Purpose**: Visualize the full data lineage for a column or table change assessment.

## Steps

```
Step 1: PARSE target
  - Identify table and optional column in the warehouse catalog
  - Load dbt manifest.json for lineage graph

Step 2: TRACE lineage
  Upstream (where does this data come from?):
  - Walk ref() dependencies to source tables
  - Identify originating source system and ingestion pipeline

  Downstream (what depends on this?):
  - Walk all models that ref() the target table
  - Identify: dashboards, ML features, API endpoints that read this model

Step 3: ASSESS impact of change
  For a column rename/drop:
  - Count downstream models referencing this column
  - Identify dashboards/reports using this field
  - Flag any SLA-critical models in the blast radius

Step 4: GENERATE impact report
  - Mermaid diagram of lineage graph
  - Impact summary: N models, M dashboards affected
  - Migration checklist for column rename/type change

Step 5: SUGGEST migration path
  - For breaking changes: propose versioned approach (add new column → migrate downstream → drop old)
  - Estimate migration effort (S/M/L)
```

---

### `workflows/data-quality-incident.md`

# Workflow: `/data-quality-incident`

**Trigger**: `/data-quality-incident [--model model_name] [--type duplicate|missing|wrong_values|sla_breach]`

**Purpose**: Triage and resolve a data quality issue following a structured investigation process.

## Steps

```
Step 1: SCOPE the incident
  - Run row count and freshness check on affected model
  - Compare to expected values (from monitoring baselines)
  - Identify: when did anomaly start? which partitions affected?

Step 2: ISOLATE root cause
  Check in order:
  a) Source data: Was source system data correct? (Compare raw vs staged)
  b) Pipeline logic: Did pipeline code change recently? (git log)
  c) Schema change: Did upstream schema change? (Schema Registry diff)
  d) Infrastructure: Was there a warehouse outage or partial run?

Step 3: QUARANTINE affected data
  - Tag affected partitions with data_quality=SUSPECT flag
  - Alert downstream consumers (BI, ML teams) to stop using affected data

Step 4: REMEDIATE
  - Fix root cause (code, schema, source issue)
  - Re-run affected pipeline with /backfill-data workflow
  - Lift quarantine only after validation passes

Step 5: POST-INCIDENT
  - Add monitoring rule to catch this pattern earlier
  - Update dbt tests to prevent regression
  - Write postmortem in .data/incidents/{date}-{model}-incident.md
```

---

### `workflows/schema-migration.md`

# Workflow: `/schema-migration`

**Trigger**: `/schema-migration [--table fct_orders] [--change rename-column|add-column|change-type|drop-column]`

**Purpose**: Execute a breaking or non-breaking schema migration safely with downstream impact management.

## Steps

```
Step 1: CLASSIFY change
  - Non-breaking (add nullable column, new table): proceed to Step 3
  - Breaking (rename, drop, type change): requires impact assessment

Step 2: IMPACT ASSESSMENT (breaking changes only)
  - Run /lineage-trace to identify all affected downstream assets
  - Notify downstream owners with 5-business-day notice minimum
  - Create migration tracking issue

Step 3: MIGRATION STRATEGY
  For column rename:
    Phase 1: Add new column (alias), populate from old column
    Phase 2: Migrate downstream models to use new column (coordinate with owners)
    Phase 3: Mark old column as deprecated in docs
    Phase 4 (after 30 days): Drop old column

  For type change:
    Phase 1: Add new column with correct type
    Phase 2: Backfill with CAST(old_column AS new_type)
    Phase 3: Switch consumers to new column
    Phase 4: Drop old column

Step 4: EXECUTE migration
  - Generate and review migration SQL
  - Run in staging first; validate with dbt tests
  - Execute in production during off-peak window

Step 5: VERIFY and DOCUMENT
  - Confirm all dbt tests pass post-migration
  - Update data catalog and YAML documentation
  - Announce completion to downstream owners
```

---

## Domain Boundary Notes

### Data Engineering ↔ Backend SDLC
- **Overlap**: Microservices that own analytical pipelines (Data Mesh), CDC (Change Data Capture) from application databases.
- **Decision**: Backend SDLC rules apply to the CDC connector code. Data Engineering rules apply from the moment data arrives in the data platform.

### Data Engineering ↔ MLOps
- **Overlap**: Feature stores are essentially versioned data pipelines. Feature engineering SQL lives in dbt models.
- **Decision**: Data Engineering creates and owns clean, documented tables. MLOps consumes them as training data sources. Feature store tables follow Data Engineering schema and quality rules.

### Data Engineering ↔ Platform
- **Overlap**: Managed data services (Snowflake, BigQuery, MSK), IAM for warehouse access, network policies for pipeline workers.
- **Decision**: Platform provisions and manages infrastructure. Data Engineering writes application-layer code (dbt, Airflow DAGs) that runs on that infrastructure.

---

## Changelog

| Version | Date | Changes |
|:---|:---|:---|
| 1.0.0 | 2026-02-16 | Initial release. Covers dbt/Airflow/Kafka/Snowflake stack. |

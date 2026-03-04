# Workflow: `/new-model`

**Trigger**: `/new-model [model_name] [--layer staging|intermediate|mart] [--source source_table]`

**Purpose**: Scaffold a complete dbt model with documentation, tests, and lineage.

## Workflow

```
@pm (gather requirements) → @team-lead (design model) → 
@developer (implement dbt model) → @qa (validate & test) → Report
```

## Steps

```
Step 1: PARSE inputs
  - Validate model_name (snake_case)
  - Determine target directory from --layer flag

Step 2: GENERATE model SQL
  - staging: SELECT with column renaming, type casting, deduplication
  - intermediate: business logic JOIN template
  - mart: fact/dimension template with surrogate key and audit columns

Step 3: GENERATE YAML documentation
  - Model description inferred from name
  - Auto-detect columns from SELECT clause
  - Add standard tests: unique/not_null on PK, relationships on FKs
  - Add recency test if time-series model

Step 4: VALIDATE
  - dbt compile --select {model_name}
  - dbt test --select {model_name} --empty

Step 5: OUTPUT
  - List created files
  - Show compiled SQL preview
  - Next step: dbt run --select {model_name}
```

# Workflow: `/lineage-trace`

**Trigger**: `/lineage-trace [--column table.column_name] [--direction upstream|downstream|both]`

**Purpose**: Visualize full data lineage and assess impact of a change.

## Steps

```
Step 1: PARSE target
  - Identify table and optional column in warehouse catalog
  - Load dbt manifest.json for lineage graph

Step 2: TRACE lineage
  Upstream: walk ref() dependencies to source tables
  Downstream: walk all models that ref() the target

Step 3: ASSESS impact
  For column rename/drop:
  - Count downstream models referencing this column
  - Identify dashboards/reports using this field
  - Flag SLA-critical models in blast radius

Step 4: GENERATE impact report
  - Mermaid diagram of lineage graph
  - Summary: N models, M dashboards affected
  - Migration checklist

Step 5: SUGGEST migration path
  - Breaking changes: propose versioned approach
  - Estimate migration effort (S/M/L)
```

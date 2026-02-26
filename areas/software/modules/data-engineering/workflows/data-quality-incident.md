# Workflow: `/data-quality-incident`

**Trigger**: `/data-quality-incident [--model model_name] [--type duplicate|missing|wrong_values|sla_breach]`

**Purpose**: Triage and resolve a data quality issue.

## Steps

```
Step 1: SCOPE
  - Row count and freshness check on affected model
  - Compare to expected values from monitoring baselines
  - Identify: when did anomaly start? which partitions?

Step 2: ISOLATE root cause
  a) Source data: correct in raw? (compare raw vs. staged)
  b) Pipeline logic: code changed recently? (git log)
  c) Schema change: upstream schema changed? (Registry diff)
  d) Infrastructure: warehouse outage or partial run?

Step 3: QUARANTINE
  - Tag affected partitions: data_quality=SUSPECT
  - Alert downstream consumers (BI, ML teams)

Step 4: REMEDIATE
  - Fix root cause
  - Re-run pipeline via /backfill-data
  - Lift quarantine after validation passes

Step 5: POST-INCIDENT
  - Add monitoring rule to catch this pattern earlier
  - Update dbt tests to prevent regression
  - Write postmortem: .data/incidents/{date}-{model}-incident.md
```

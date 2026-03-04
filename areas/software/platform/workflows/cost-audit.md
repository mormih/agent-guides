# Workflow: `/cost-audit`

**Trigger**: `/cost-audit [--period last-month|last-week] [--account all|staging|production]`

**Purpose**: Analyze cloud spend, identify waste, and generate optimization recommendations.

## Workflow

```
@qa (fetch billing data & analyze patterns) → @team-lead (review recommendations) → Report
```

## Steps

```
Step 1: FETCH billing data
  - Query AWS Cost Explorer for target period
  - Group by: service, environment tag, team tag

Step 2: ANALYZE spend patterns
  - Compare to same period last month
  - Flag services with > 20% month-over-month increase

Step 3: DETECT waste
  Check for:
  - Unattached EBS volumes (> 7 days)
  - Stopped EC2 instances with EBS
  - Idle load balancers (< 1 req/min for 7 days)
  - S3 buckets without Intelligent Tiering (> 10 GB)
  - Over-provisioned RDS (CPU < 10% for 30 days)

Step 4: GENERATE recommendations
  Per waste item: resource ID, current monthly cost, recommended action, estimated savings

Step 5: REPORT
  - Executive summary: total spend vs. budget vs. last month
  - Total identified savings opportunity
  - Terraform snippets for recommended changes
```

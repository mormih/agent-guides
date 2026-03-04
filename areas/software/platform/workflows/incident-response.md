# Workflow: `/incident-response`

**Trigger**: `/incident-response [--severity P0|P1|P2] [--service api|db|cdn]`

**Purpose**: Guide the on-call engineer through a structured incident response process.

## Workflow

```
@team-lead (triage & establish incident channel) → @developer (execute mitigation) → 
@qa (validate resolution) → @team-lead (draft postmortem) → Report
```

## Steps

```
Step 1: TRIAGE
  - Fetch last 30 min of metrics for named service
  - Check recent deployments (last 2 hours)
  - Identify correlated alerts

Step 2: ESTABLISH incident channel
  - Create #incident-YYYY-MM-DD-[service] Slack channel
  - Post initial summary: what's broken, impact, timeline

Step 3: GENERATE hypothesis list
  Based on symptoms, surface top 3 likely causes:
  - Recent deployment? → Test rollback hypothesis
  - DB connection errors? → Check pool exhaustion runbook
  - 5xx spike? → Check upstream dependencies

Step 4: EXECUTE mitigation
  Per hypothesis (most likely first):
  - Provide exact kubectl/aws/psql commands from runbook
  - Execute, monitor 2 minutes
  - If metrics improve → STABILIZE; else → next hypothesis

Step 5: DRAFT postmortem
  - Auto-generate template with timeline from monitoring data
  - Flag gaps requiring human input

Step 6: COMMUNICATE resolution
  - Post to #deployments and status page
  - Schedule postmortem within 48 hours
```

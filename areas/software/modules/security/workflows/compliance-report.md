# Workflow: `/compliance-report`

**Trigger**: `/compliance-report [--standard soc2|iso27001|gdpr|pci] [--period Q1-2026]`

**Purpose**: Generate a compliance artifact with control evidence for audit or self-assessment.

## Steps

```
Step 1: MAP controls
  - Load control framework for requested standard
  - Map each control to evidence sources

Step 2: COLLECT evidence
  - Automated: CloudTrail, Vault audit logs, CI scan results
  - Document: .security/ threat models, pentest reports
  - Manual: flag controls needing human evidence (training records)

Step 3: EVALUATE compliance
  - Status per control: Compliant / Partial / Non-Compliant / N/A
  - For Partial/Non-Compliant: document gap and remediation plan

Step 4: GENERATE report
  - Executive summary: overall compliance %
  - Control matrix: all controls with status and evidence links
  - Gap analysis: non-compliant controls with risk and timeline

Step 5: REVIEW gate
  - Flag for human review before sharing externally
  - Note: self-assessment aid, not certified audit
```

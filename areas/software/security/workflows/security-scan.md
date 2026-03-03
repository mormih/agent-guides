# Workflow: `/security-scan`

**Trigger**: `/security-scan [--scope code|deps|infra|all] [--pr | --full]`

**Purpose**: Run a comprehensive security scan suite and produce a prioritized finding report.

## Steps

```
Step 1: SAST scan
  - semgrep --config=p/security-audit
  - snyk code test

Step 2: Dependency audit
  - npm audit --json / pip-audit / trivy fs
  - Cross-reference with OSV database
  - Flag: Critical (block) and High (plan) findings

Step 3: Secret scanning
  - trufflehog filesystem scan on staged changes
  - gitleaks on git log (last 100 commits if --pr, full if --full)

Step 4: Infrastructure scan
  - checkov -d terraform/
  - kube-score on K8s manifests

Step 5: SYNTHESIZE report
  - Merge all findings, deduplicate by location
  - Priority: Critical → High → Medium → Low
  - Per Critical/High: provide specific remediation code

Step 6: OUTPUT
  - Post to PR as review comment
  - Critical findings: request changes (block merge)
  - High findings: comment with 72-hour SLA
  - Save full report: .security/scan-results-{timestamp}.json
```

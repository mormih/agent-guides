# `.agent-os` Domain Package: Platform Engineering (DevOps / IaC)

> **Version**: 1.0.0
> **Stack**: Terraform / Kubernetes / GitHub Actions / AWS (GCP/Azure annotations where they differ)
> **Scope**: Infrastructure provisioning, CI/CD pipelines, cloud reliability, cost governance
> **Inherits from**: `@agent-os/global`, `@agent-os/security` (Policy-as-Code rules)

---

## Package Structure

```
.agent-os/
└── platform/
    ├── rules/
    │   ├── immutability.md
    │   ├── security-posture.md
    │   ├── reliability.md
    │   └── cost-governance.md
    ├── skills/
    │   ├── terraform-patterns.md
    │   ├── k8s-manifests.md
    │   ├── ci-cd-pipelines.md
    │   ├── observability-setup.md
    │   ├── incident-response.md
    │   ├── networking.md
    │   └── secrets-management.md
    └── workflows/
        ├── provision-env.md
        ├── drift-check.md
        ├── deploy-production.md
        ├── cost-audit.md
        └── incident-response.md
```

---

## RULES (Kernel)

---

### `rules/immutability.md`

# Rule: Immutable Infrastructure

**Priority**: P0 — No exceptions. Manual changes to running infra are a firing-level incident.

## Constraints

1. **No SSH/console patching**: Running instances are never modified in place. Fix = new AMI/image + redeploy.
2. **All infrastructure is code**: Every resource that exists in production must have a corresponding Terraform resource. Resources without IaC ownership are subject to automatic termination during the next drift-check cycle.
3. **Terraform is the single source of truth**: Never use the cloud console to create, modify, or delete resources. Read-only console access is acceptable; write access is restricted to CI service accounts.
4. **Module versioning**: All Terraform modules must be pinned to a specific version tag. No `source = "git::...?ref=main"` in production.
5. **Immutable image tags**: Container images in production must use content-addressed digests (`image@sha256:...`), never mutable tags like `:latest`.

## Enforcement

- `terraform plan` output reviewed in every PR via automated comment.
- Drift detection runs every 6 hours via `/drift-check` workflow.
- OPA policy blocks `terraform apply` if plan contains manual-only resources.

---

### `rules/security-posture.md`

# Rule: Security Posture

**Priority**: P0 — Violations block deployment.

## Constraints

1. **Least Privilege (IAM)**: Every IAM role/policy must be scoped to the minimum actions and resources required. Wildcards (`*`) in `Action` or `Resource` are forbidden in production policies without documented exception.
2. **No secrets in state or code**: Terraform state files must be stored encrypted (S3 + KMS, GCS CMEK). No credentials, tokens, or keys in `.tf` files, environment variable definitions, or CI YAML.
3. **Encrypted at rest and in transit**: All storage resources (S3, RDS, EBS) must have encryption enabled. All inter-service communication uses TLS ≥ 1.2.
4. **Network isolation**: Production workloads run in private subnets. Public exposure only via load balancer with WAF attached. Security groups default-deny inbound.
5. **Tagging compliance**: Every resource must have tags: `Owner`, `Environment`, `CostCenter`, `Terraform=true`. Untagged resources are flagged by cost-audit and eligible for termination.
6. **MFA on human IAM users**: All human AWS accounts require MFA. Service accounts use IAM roles, never long-lived access keys.

---

### `rules/reliability.md`

# Rule: Reliability Standards

**Priority**: P1 — Required before production promotion.

## SLO Defaults (override in project config)

| Service Tier | Availability Target | RTO | RPO |
|:---|:---|:---|:---|
| Tier 1 (revenue-critical) | 99.9% (8.7h downtime/yr) | 30 min | 15 min |
| Tier 2 (internal tools) | 99.5% (43h downtime/yr) | 4 hours | 1 hour |
| Tier 3 (batch/async) | 99.0% (87h downtime/yr) | 24 hours | 24 hours |

## Constraints

1. **No single points of failure**: All Tier 1 services run with minimum 2 replicas across 2 availability zones.
2. **Graceful shutdown**: All containers must handle `SIGTERM` with a drain period (≥ 30 seconds) before `SIGKILL`.
3. **Readiness before liveness**: K8s probes must define `readinessProbe` before `livenessProbe`. A service not ready should never receive traffic; it should not be restarted unless truly unhealthy.
4. **Defined resource limits**: Every container must specify `resources.requests` and `resources.limits`. No unbounded containers in production.
5. **Chaos budget**: Tier 1 services must pass a basic chaos test (pod kill, node drain) before going live.

---

### `rules/cost-governance.md`

# Rule: Cost Governance

**Priority**: P1 — Cost overruns trigger mandatory audit.

## Constraints

1. **Budget alerts**: Every AWS account/GCP project must have billing alerts at 80% and 100% of monthly budget. Alerts go to on-call channel, not just email.
2. **No oversized defaults**: Default instance type for new services is `t3.small` (AWS) / `e2-small` (GCP). Larger instances require justification in the PR description.
3. **Data transfer awareness**: Cross-AZ and cross-region data transfer costs must be estimated before architectural decisions that route significant traffic across zones.
4. **Unused resource policy**: Resources with zero traffic for 7 days trigger an automatic review notification. Resources idle for 30 days are terminated after notification.
5. **Reserved/committed use**: Any workload running continuously for > 3 months must have a Reserved Instance or Committed Use Discount analysis completed.

---

## SKILLS (Libraries)

---

### `skills/terraform-patterns.md`

# Skill: Terraform Patterns

## When to load

When writing new Terraform, reviewing IaC PRs, designing module structure, or debugging plan/apply failures.

## Module Structure (Standard)

```
terraform/
├── modules/
│   ├── vpc/                  # Reusable: accepts var.cidr_block, var.az_count
│   ├── eks-cluster/          # Reusable: k8s cluster with sane defaults
│   ├── rds-postgres/         # Reusable: encrypted RDS with parameter group
│   └── static-site/          # Reusable: S3 + CloudFront + ACM
└── environments/
    ├── staging/
    │   ├── main.tf           # Calls modules with staging vars
    │   ├── variables.tf
    │   └── terraform.tfvars
    └── production/
        ├── main.tf
        ├── variables.tf
        └── terraform.tfvars
```

**Rule**: Modules must be generic. Environment-specific values live in `tfvars`, never hardcoded in modules.

## Resource Naming Convention

```hcl
# Pattern: {project}-{environment}-{resource-type}-{descriptor}
resource "aws_s3_bucket" "this" {
  bucket = "${var.project}-${var.environment}-assets-${random_id.suffix.hex}"

  tags = merge(var.common_tags, {
    Name        = "${var.project}-${var.environment}-assets"
    Description = "Static asset storage for ${var.project} ${var.environment}"
  })
}
```

## State Management

```hcl
# backend.tf — remote state is non-negotiable
terraform {
  backend "s3" {
    bucket         = "my-company-terraform-state"
    key            = "${var.project}/${var.environment}/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    kms_key_id     = "arn:aws:kms:us-east-1:123456789:key/..."
    dynamodb_table = "terraform-state-lock"
  }
}
```

## IAM: Least Privilege Pattern

```hcl
# ✅ Scoped policy — specific actions, specific resource
resource "aws_iam_policy" "app_s3_read" {
  name = "${var.project}-app-s3-read"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject", "s3:ListBucket"]
      Resource = [
        aws_s3_bucket.assets.arn,
        "${aws_s3_bucket.assets.arn}/*"
      ]
    }]
  })
}

# ❌ Never do this in production
# Action   = ["s3:*"]
# Resource = ["*"]
```

## Data Sources vs Resources

```hcl
# Use data sources to reference existing infrastructure
# (VPC created by another team, shared ACM cert, etc.)
data "aws_vpc" "shared" {
  tags = { Name = "shared-services-vpc" }
}

data "aws_acm_certificate" "wildcard" {
  domain   = "*.mycompany.com"
  statuses = ["ISSUED"]
}
```

## Common Anti-Patterns

| Anti-pattern | Problem | Fix |
|:---|:---|:---|
| `count` for module variants | Creates index-based state keys, fragile | Use `for_each` with meaningful keys |
| Hardcoded AMI IDs | Stale, region-specific | Use `data "aws_ami"` with filters |
| `terraform_remote_state` across all envs | Tight coupling | Use SSM Parameter Store for cross-stack values |
| `lifecycle { prevent_destroy = true }` everywhere | Creates false safety, blocks legitimate deletes | Use only for stateful resources (RDS, S3) |

---

### `skills/k8s-manifests.md`

# Skill: Kubernetes Manifests & Helm

## When to load

When writing K8s YAML, designing Helm charts, setting resource limits, configuring probes, or reviewing pod security.

## Production-Ready Deployment Template

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-api
  labels: {{ include "app.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}  # Min 2 for Tier 1
  selector:
    matchLabels: {{ include "app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        # Forces pod restart when ConfigMap changes
        checksum/config: {{ include (print .Template.BasePath "/configmap.yaml") . | sha256sum }}
    spec:
      # Security: don't run as root
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 2000

      # Graceful shutdown
      terminationGracePeriodSeconds: 60

      containers:
        - name: api
          image: "{{ .Values.image.repository }}@{{ .Values.image.digest }}"  # Digest, not tag
          imagePullPolicy: IfNotPresent

          ports:
            - name: http
              containerPort: 8080

          # ✅ Required: resource boundaries
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi

          # ✅ Readiness before liveness
          readinessProbe:
            httpGet:
              path: /health/ready
              port: http
            initialDelaySeconds: 10
            periodSeconds: 5
            failureThreshold: 3

          livenessProbe:
            httpGet:
              path: /health/live
              port: http
            initialDelaySeconds: 30
            periodSeconds: 15
            failureThreshold: 5

          # Secrets from environment, never in image
          envFrom:
            - secretRef:
                name: {{ .Release.Name }}-secrets
          env:
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name

      # Spread pods across AZs
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels: {{ include "app.selectorLabels" . | nindent 14 }}
```

## HPA (Horizontal Pod Autoscaler)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ .Release.Name }}-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ .Release.Name }}-api
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70   # Scale up before saturation
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

## PodDisruptionBudget (Required for Tier 1)

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: {{ .Release.Name }}-api
spec:
  minAvailable: 1   # Ensure at least 1 pod during node drains
  selector:
    matchLabels: {{ include "app.selectorLabels" . | nindent 6 }}
```

---

### `skills/ci-cd-pipelines.md`

# Skill: CI/CD Pipeline Patterns

## When to load

When designing or modifying GitHub Actions workflows, optimizing pipeline speed, implementing deployment gates, or debugging CI failures.

## Pipeline Structure (GitHub Actions)

```
.github/workflows/
├── ci.yml          # Runs on every PR: lint, test, build, security scan
├── deploy-stg.yml  # Runs on merge to main: deploy to staging
└── deploy-prd.yml  # Runs on release tag: deploy to production (with approval gate)
```

## CI Workflow Template

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Cache dependencies — critical for speed
      - name: Cache node_modules
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: ${{ runner.os }}-node-

      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage

      # Upload coverage for tracking
      - uses: codecov/codecov-action@v4

  terraform-validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform init -backend=false
        working-directory: terraform/
      - run: terraform validate
        working-directory: terraform/
      - run: terraform fmt -check -recursive
        working-directory: terraform/

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trivy vulnerability scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: fs
          severity: HIGH,CRITICAL
          exit-code: 1   # Fail on critical vulns
```

## Deployment Gate Pattern

```yaml
# deploy-prd.yml — manual approval required
jobs:
  deploy:
    environment: production   # Requires reviewer approval in GitHub Environments
    steps:
      - name: Deploy with canary
        run: |
          # Deploy to 10% of traffic first
          kubectl set image deployment/api api=$IMAGE --record
          kubectl annotate deployment/api kubernetes.io/change-cause="${{ github.sha }}"

      - name: Run smoke tests
        run: npm run test:smoke -- --env production

      - name: Promote to 100%
        if: success()
        run: kubectl scale deployment/api --replicas=$FULL_REPLICAS
```

## Pipeline Optimization Checklist

- [ ] Dependencies cached with hash-based cache keys
- [ ] Jobs parallelized where independent (lint + test + security run in parallel)
- [ ] Docker layer caching enabled (`--cache-from`)
- [ ] Matrix builds used for multi-version testing
- [ ] Concurrency groups prevent redundant runs on same branch
- [ ] Secrets accessed via GitHub Secrets or OIDC (never hardcoded)

---

### `skills/observability-setup.md`

# Skill: Observability Setup

## When to load

When setting up monitoring for a new service, configuring alerts, debugging production issues, or designing dashboards.

## The Three Pillars

| Pillar | Tool | Purpose |
|:---|:---|:---|
| **Metrics** | Prometheus + Grafana | Aggregated numeric data over time (latency, error rate, throughput) |
| **Logs** | Loki / CloudWatch / Datadog Logs | Discrete events with context for debugging |
| **Traces** | Jaeger / AWS X-Ray / Datadog APM | Request flow across service boundaries |

## Golden Signals (Mandatory for Every Service)

```yaml
# Every service must expose these 4 metrics (USE method):
# 1. Latency: p50, p95, p99 response times
# 2. Traffic: requests per second
# 3. Errors: error rate (4xx, 5xx)
# 4. Saturation: CPU %, memory %, queue depth
```

## Prometheus Alert Rules Template

```yaml
groups:
  - name: api-alerts
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m]))
          / sum(rate(http_requests_total[5m])) > 0.01
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Error rate > 1% for 2 minutes"
          runbook: "https://runbooks.internal/high-error-rate"

      - alert: HighLatency
        expr: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "p99 latency > 2s"

      - alert: PodCrashLooping
        expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
        for: 15m
        labels:
          severity: critical
```

## Structured Logging Contract

```json
{
  "timestamp": "2026-02-16T10:30:00Z",
  "level": "ERROR",
  "service": "payments-api",
  "version": "2.4.1",
  "trace_id": "abc123",
  "span_id": "def456",
  "user_id": "usr_789",      // Hashed/pseudonymized if PII concern
  "message": "Payment processing failed",
  "error": {
    "type": "PaymentGatewayError",
    "code": "CARD_DECLINED",
    "upstream_status": 402
  },
  "duration_ms": 1240
}
```

**Anti-patterns**: Free-text log messages without structure, logging inside tight loops, logging PII in plaintext, using DEBUG level in production without sampling.

---

### `skills/incident-response.md`

# Skill: Incident Response Runbooks

## When to load

When responding to a production alert, diagnosing an outage, or writing a postmortem.

## Severity Classification

| Severity | Definition | Response Time | Examples |
|:---|:---|:---|:---|
| P0 | Complete service outage, data loss | Immediate | 5xx rate > 50%, DB down |
| P1 | Significant degradation, key feature broken | 15 min | p99 > 10s, auth failing |
| P2 | Minor degradation, workaround exists | 1 hour | Slow query, non-critical feature broken |
| P3 | Cosmetic / non-user-facing | Next business day | Dashboard lag, minor alert noise |

## P0 Response Playbook

```
T+0:  ACKNOWLEDGE — Confirm in incident channel: "I'm on this"
T+5:  SCOPE — Answer: What's broken? Who's affected? Since when?
T+10: COMMUNICATE — Post status page update; notify stakeholders
T+15: MITIGATE first — Rollback > fix. Always prefer reversible actions.
       Options in order: rollback deploy → feature flag off → scale up → redirect traffic
T+30: STABILIZE — Confirm metrics returning to normal
T+60: DOCUMENT — Write preliminary postmortem while memory is fresh
T+24h: POSTMORTEM — Full 5-whys analysis, action items with owners
```

## Common Runbooks

### High Error Rate
```bash
# 1. Check recent deployments
kubectl rollout history deployment/api

# 2. Check error logs
kubectl logs -l app=api --since=10m | grep ERROR | tail -50

# 3. If recent deploy → rollback immediately
kubectl rollout undo deployment/api

# 4. Check upstream dependencies
curl -s https://status.stripe.com/api/v2/status.json | jq .status
```

### Database Connection Exhaustion
```bash
# Check current connections
psql -c "SELECT count(*), state FROM pg_stat_activity GROUP BY state;"

# Find long-running queries
psql -c "SELECT pid, query, age(clock_timestamp(), query_start) AS age
         FROM pg_stat_activity WHERE state = 'active' ORDER BY age DESC;"

# Kill idle connections older than 10 minutes
psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity
         WHERE state = 'idle' AND age(clock_timestamp(), state_change) > interval '10 minutes';"
```

---

### `skills/secrets-management.md`

# Skill: Secrets Management

## When to load

When provisioning a new service, rotating credentials, auditing secret access, or setting up CI/CD secrets.

## Secrets Hierarchy

```
Level 1: Static secrets (rotate quarterly)
  → AWS Secrets Manager / HashiCorp Vault
  → Database passwords, API keys for external services

Level 2: Dynamic secrets (auto-expire)
  → Vault dynamic secrets / AWS IAM roles via OIDC
  → DB credentials valid for 1 hour, auto-rotated

Level 3: Runtime injection (never on disk)
  → K8s ExternalSecrets Operator → mounts as env vars or volume
  → Never stored in container image or Git
```

## Kubernetes ExternalSecrets Pattern

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: api-secrets
spec:
  refreshInterval: 1h
  secretStoreRef:
    kind: ClusterSecretStore
    name: aws-secretsmanager
  target:
    name: api-secrets        # Creates a K8s Secret with this name
    creationPolicy: Owner
  data:
    - secretKey: DATABASE_URL
      remoteRef:
        key: prod/api/database
        property: connection_string
    - secretKey: STRIPE_SECRET_KEY
      remoteRef:
        key: prod/api/stripe
        property: secret_key
```

## Secret Rotation Checklist

- [ ] New secret created in Secrets Manager
- [ ] Service updated to read both old and new secret (dual-read window)
- [ ] New secret deployed and verified in production
- [ ] Old secret revoked in Secrets Manager
- [ ] Old secret removed from service config
- [ ] Rotation documented in runbook

---

## WORKFLOWS (Applications)

---

### `workflows/provision-env.md`

# Workflow: `/provision-env`

**Trigger**: `/provision-env [--env staging|preview|production] [--branch feature/xyz]`

**Purpose**: Spin up a complete, isolated environment for a branch (preview) or initialize a standing environment (staging/production).

## Steps

```
Step 1: VALIDATE prerequisites
  - Check AWS credentials active (aws sts get-caller-identity)
  - Verify Terraform state backend accessible
  - Confirm no active locks on target environment state

Step 2: PLAN infrastructure
  - terraform init -reconfigure for target environment
  - terraform plan -out=tfplan -var="branch_name=${BRANCH}"
  - Parse plan output: count new/changed/destroyed resources
  - If destroyed resources > 0 in non-preview env: HALT and request manual approval

Step 3: ESTIMATE cost
  - Run infracost breakdown --path tfplan
  - Report monthly cost delta
  - HALT if delta > $500/month for preview environments

Step 4: APPLY infrastructure
  - terraform apply tfplan
  - Capture all outputs (endpoints, ARNs) to outputs.json

Step 5: CONFIGURE DNS and ingress
  - Register environment subdomain: {branch}.staging.mycompany.com
  - Wait for SSL certificate validation (ACM)
  - Verify HTTPS endpoint responds

Step 6: SEED initial state
  - Run database migrations
  - Load seed data if --seed flag provided
  - Run smoke test suite against new environment

Step 7: REPORT
  - Post environment URL to PR comment
  - Output: all endpoints, credentials location, teardown command
```

---

### `workflows/drift-check.md`

# Workflow: `/drift-check`

**Trigger**: `/drift-check [--env staging|production] [--fix]`

**Purpose**: Detect and report (or remediate) differences between IaC definitions and actual cloud state.

## Steps

```
Step 1: FETCH live state
  - terraform refresh for target environment
  - aws config get-compliance-details (if AWS Config enabled)

Step 2: COMPUTE diff
  - terraform plan -detailed-exitcode
  - Exit code 2 = drift detected; parse plan output

Step 3: CLASSIFY drift
  For each drifted resource:
  - Category A: Tag-only drift (auto-fixable, low risk)
  - Category B: Config drift (changed setting — review required)
  - Category C: Missing resource (created manually — investigate)
  - Category D: Unexpected destroy (resource deleted outside Terraform — CRITICAL)

Step 4: REPORT findings
  - Post summary to Slack #infra-alerts channel
  - For Category D: page on-call immediately

Step 5: REMEDIATE (if --fix flag)
  - Auto-apply Category A fixes only
  - For B/C/D: create GitHub issue with drift details and assign to IaC owner

Step 6: UPDATE baseline
  - Record drift snapshot with timestamp
  - Track drift frequency per resource type for trend analysis
```

---

### `workflows/deploy-production.md`

# Workflow: `/deploy-production`

**Trigger**: `/deploy-production [--version v2.4.0] [--strategy canary|blue-green]`

**Purpose**: Execute a gated, observable production deployment with automatic rollback on failure.

## Steps

```
Step 1: PRE-FLIGHT checks
  - Confirm version tag exists and CI passed
  - Verify staging deployment is healthy (same version running in staging)
  - Check active incidents: HALT if P0/P1 open
  - Confirm deployment window (skip check if --force flag + P0 incident)

Step 2: ANNOUNCE deployment
  - Post to #deployments: "Deploying v2.4.0 to production — @oncall watching"
  - Update status page to "Deploying" (optional)

Step 3: CANARY deployment (10% traffic)
  - Deploy new image to canary pod group
  - Shift 10% of traffic via ingress weight
  - Monitor for 5 minutes:
    → Error rate delta > 0.5%: AUTO-ROLLBACK
    → p99 latency delta > 500ms: AUTO-ROLLBACK
    → Pod crash loops: AUTO-ROLLBACK

Step 4: PROGRESSIVE rollout (if canary healthy)
  - 25% → wait 2 min → 50% → wait 2 min → 100%
  - Continue monitoring at each step; rollback threshold same as Step 3

Step 5: POST-DEPLOY validation
  - Run smoke test suite against production
  - Verify key business metrics (orders/min, sign-ups/min) not degraded > 10%

Step 6: COMPLETE
  - Post success to #deployments with diff link
  - Update release notes in GitHub
  - If rollback occurred: create P1 incident, preserve logs, notify team
```

---

### `workflows/cost-audit.md`

# Workflow: `/cost-audit`

**Trigger**: `/cost-audit [--period last-month|last-week] [--account all|staging|production]`

**Purpose**: Analyze cloud spend, identify anomalies, and generate optimization recommendations.

## Steps

```
Step 1: FETCH billing data
  - Query AWS Cost Explorer API for target period
  - Group by: service, environment tag, team tag

Step 2: ANALYZE spend patterns
  - Compare to same period last month/year
  - Flag services with > 20% increase month-over-month
  - Identify top 10 cost drivers

Step 3: DETECT waste
  Check for:
  - Unattached EBS volumes (> 7 days)
  - Stopped EC2 instances with attached EBS
  - Idle load balancers (< 1 req/min for 7 days)
  - S3 buckets with Intelligent Tiering disabled (> 10 GB)
  - Over-provisioned RDS instances (CPU < 10% for 30 days)
  - NAT Gateway data transfer anomalies

Step 4: GENERATE recommendations
  For each waste item:
  - Resource ID and current monthly cost
  - Recommended action (terminate/resize/migrate storage class)
  - Estimated monthly savings

Step 5: PRODUCE report
  - Executive summary: total spend, vs. budget, vs. last month
  - Waste items: total identified savings opportunity
  - Top optimization actions sorted by savings potential
  - Terraform snippets for recommended changes
```

---

### `workflows/incident-response.md`

# Workflow: `/incident-response`

**Trigger**: `/incident-response [--severity P0|P1|P2] [--service api|db|cdn]`

**Purpose**: Guide the on-call engineer through a structured incident response process.

## Steps

```
Step 1: TRIAGE
  - Fetch last 30 min of metrics for named service
  - Check recent deployments (last 2 hours)
  - Identify correlated alerts firing simultaneously

Step 2: ESTABLISH incident channel
  - Create #incident-YYYY-MM-DD-[service] Slack channel
  - Post initial summary: what's broken, impact, timeline

Step 3: GENERATE hypothesis list
  Based on symptoms, surface top 3 likely causes from incident-response skill:
  - Recent deployment? → Test rollback hypothesis
  - DB connection errors? → Check pool exhaustion runbook
  - 5xx spike? → Check upstream dependencies

Step 4: EXECUTE mitigation
  For each hypothesis (most likely first):
  - Provide exact kubectl/aws/psql commands from runbook
  - Execute action, monitor for 2 minutes
  - If metrics improve → STABILIZE; if not → next hypothesis

Step 5: DRAFT postmortem
  Once stable:
  - Auto-generate postmortem template with timeline, impact, mitigation steps
  - Pre-fill known facts from monitoring data
  - Flag gaps requiring human input

Step 6: COMMUNICATE resolution
  - Post resolution to #deployments and status page
  - Schedule postmortem meeting within 48 hours
```

---

## Domain Boundary Notes

### Platform ↔ Security (DevSecOps)
- **Overlap**: IaC security scanning (Checkov, tfsec), OPA policies, WAF configuration.
- **Decision**: Security scanning rules are defined in `@agent-os/security` and imported as a dependency. Platform package applies them in CI/CD pipeline steps.

### Platform ↔ Backend SDLC
- **Overlap**: Docker builds, database migrations, environment variables.
- **Decision**: Backend SDLC owns the application container definition (`Dockerfile`). Platform owns where and how that container runs (Helm values, ECS task def).

### Platform ↔ Data Engineering
- **Overlap**: Managed data services (RDS, BigQuery, MSK/Kafka), IAM for data access, network policies for data pipelines.
- **Decision**: Platform provisions the infrastructure. Data Engineering writes the Terraform data-resource modules but defers to Platform for network topology.

---

## Changelog

| Version | Date | Changes |
|:---|:---|:---|
| 1.0.0 | 2026-02-16 | Initial release. Covers Terraform/K8s/GitHub Actions/AWS stack. |

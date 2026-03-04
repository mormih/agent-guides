# Workflow: `/provision-env`

**Trigger**: `/provision-env [--env staging|preview|production] [--branch feature/xyz]`

**Purpose**: Spin up a complete, isolated environment for a branch or initialize a standing environment.

## Workflow

```
@team-lead (validate prerequisites & estimate cost) → @developer (apply infrastructure) → 
@qa (smoke test new environment) → Report
```

## Steps

```
Step 1: VALIDATE prerequisites
  - Check cloud credentials active
  - Verify Terraform state backend accessible
  - Confirm no active locks on target environment state

Step 2: PLAN infrastructure
  - terraform init -reconfigure
  - terraform plan -out=tfplan
  - If destroyed resources > 0 in non-preview env: HALT, request manual approval

Step 3: ESTIMATE cost
  - Run infracost breakdown --path tfplan
  - HALT if delta > $500/month for preview environments

Step 4: APPLY infrastructure
  - terraform apply tfplan
  - Capture all outputs (endpoints, ARNs)

Step 5: CONFIGURE DNS and ingress
  - Register subdomain: {branch}.staging.mycompany.com
  - Wait for SSL certificate validation
  - Verify HTTPS endpoint responds

Step 6: SEED and SMOKE TEST
  - Run database migrations
  - Run smoke test suite against new environment

Step 7: REPORT
  - Post environment URL to PR comment
  - Include: all endpoints, credentials location, teardown command
```

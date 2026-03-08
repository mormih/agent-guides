---
name: pipeline-security
type: skill
description: Secure CI/CD pipelines — OIDC auth, secret scanning, dependency review, SLSA provenance, and runner hardening.
related-rules:
  - supply-chain-security.md
  - pipeline-standards.md
allowed-tools: Read, Write, Edit
---

# Skill: Pipeline Security

> **Expertise:** OIDC cloud auth, GitHub Actions security hardening, secret scanning (trufflehog/gitleaks), SLSA provenance, dependency review.

## When to load

When setting up secure CI credentials, adding secret scanning, implementing SLSA provenance, or hardening runner permissions.

## OIDC Authentication (no long-lived secrets)

```yaml
# GitHub Actions → AWS (no AWS_ACCESS_KEY_ID needed)
jobs:
  deploy:
    permissions:
      id-token: write     # required for OIDC
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-actions-deploy
          aws-region: eu-west-1
          role-session-name: github-${{ github.run_id }}

# AWS IAM trust policy (configure once)
# {
#   "Principal": {"Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"},
#   "Condition": {
#     "StringEquals": {"token.actions.githubusercontent.com:sub": "repo:myorg/myrepo:ref:refs/heads/main"}
#   }
# }
```

```yaml
# GitHub Actions → GCP
- uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: projects/123456789/locations/global/workloadIdentityPools/github/providers/github
    service_account: github-actions@my-project.iam.gserviceaccount.com

# GitHub Actions → K8s (via kubeconfig secret — use when OIDC not available)
- name: Set up kubeconfig
  run: |
    echo "${{ secrets.KUBECONFIG_B64 }}" | base64 -d > /tmp/kubeconfig
    chmod 600 /tmp/kubeconfig
  env:
    KUBECONFIG: /tmp/kubeconfig
```

## Minimal Permissions (principle of least privilege)

```yaml
# Always declare permissions explicitly; defaults are too broad
jobs:
  build:
    permissions:
      contents: read        # checkout only
      packages: write       # push to ghcr.io
      id-token: write       # OIDC for cloud/registry auth
      security-events: write # upload SARIF to Security tab

  deploy:
    permissions:
      contents: read
      id-token: write       # OIDC for cloud auth
      # NOT: actions:write, administration:write, etc.
```

## Secret Scanning

```yaml
# trufflehog — detect secrets in git history and current diff
- name: Scan for secrets (trufflehog)
  uses: trufflesecurity/trufflehog@main
  with:
    path: ./
    base: ${{ github.event.repository.default_branch }}
    head: HEAD
    extra_args: --only-verified   # reduce noise — only verified secrets

# gitleaks — alternative (faster, configurable)
- name: Scan for secrets (gitleaks)
  uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Dependency Review (GitHub)

```yaml
# Block PRs that introduce vulnerable dependencies
- name: Dependency Review
  uses: actions/dependency-review-action@v4
  with:
    fail-on-severity: high          # block on High and Critical
    allow-licenses: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC
    deny-licenses: GPL-3.0, AGPL-3.0  # copyleft licenses blocked
```

## SLSA Provenance (Supply chain Level 2)

```yaml
# Generate SLSA L2 provenance attestation with sigstore
- name: Generate SLSA provenance
  uses: slsa-framework/slsa-github-generator/.github/workflows/generator_container_slsa3.yml@v2
  with:
    image: registry.example.com/myorg/order-service
    digest: ${{ steps.build.outputs.digest }}
    registry-username: ${{ github.actor }}
    registry-password: ${{ secrets.GITHUB_TOKEN }}
```

## Runner Hardening

```yaml
# Pin action versions to SHA (not tag — tags are mutable)
# ✅ Safe
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2
# ❌ Unsafe (tag can be moved by attacker)
- uses: actions/checkout@v4

# Restrict third-party actions to verified/trusted
# In GitHub org settings: only allow selected actions + GitHub Actions
```

```bash
# Self-hosted runner hardening
# - Run as non-root dedicated user (no sudo)
# - Ephemeral runners (fresh VM per job) — preferred
# - Network: egress to required registries only; no inbound
# - No persistent credentials on runner filesystem
# - Use actions/runner-container-hooks for K8s ephemeral runners
```

## Audit: What Your Pipeline Can Access

```bash
# Check what secrets are available to a workflow
# In GitHub: Settings → Secrets → Actions
# Rule: each secret should only be available to the environment that needs it

# Prevent secret leakage in logs
- name: No secret echo
  run: |
    # ❌ BAD: leaks secret to logs
    echo "DB_PASS=$DB_PASS"
    env  # dumps all env vars including secrets

    # ✅ Use secret only where needed; never echo
    helm upgrade ... --set db.password="$DB_PASS" > /dev/null
```

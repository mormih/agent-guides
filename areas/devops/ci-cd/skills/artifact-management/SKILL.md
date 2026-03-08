---
name: artifact-management
type: skill
description: Manage container images, Helm charts, and build artifacts — registry organization, retention, promotion between environments.
related-rules:
  - pipeline-standards.md
  - supply-chain-security.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: Artifact Management

> **Expertise:** OCI registry organization, image tagging strategy, Helm chart registry, artifact promotion, retention policies.

## When to load

When designing artifact storage, setting up Helm chart publishing, configuring image retention, or promoting artifacts between environments.

## Image Tagging Strategy

```
Registry: registry.example.com / myorg/<service>

Development (PR):
  registry.example.com/myorg/order-service:pr-123-abc1234   ← per-PR, short-lived

Staging (main branch merge):
  registry.example.com/myorg/order-service:main-abc1234def   ← branch + sha

Release (git tag):
  registry.example.com/myorg/order-service:v2.3.1            ← semver tag
  registry.example.com/myorg/order-service:v2.3              ← minor floating (optional)
  registry.example.com/myorg/order-service@sha256:abc...     ← digest (use in K8s manifests)

❌ NEVER in production:
  :latest / :main / :develop   ← mutable, untraceable
```

## Build + Push with Digest Output

```yaml
# GitHub Actions — capture digest for downstream jobs
- name: Build and push
  id: build
  uses: docker/build-push-action@v6
  with:
    tags: |
      registry.example.com/myorg/order-service:${{ github.sha }}
      registry.example.com/myorg/order-service:v${{ steps.version.outputs.tag }}
    outputs: type=image,push=true

- name: Export digest
  run: echo "${{ steps.build.outputs.digest }}" > /tmp/digest.txt

# Use digest in deploy job (pinned, immutable)
- name: Deploy
  run: |
    helm upgrade --install order-service charts/order-service \
      --set image.digest=${{ steps.build.outputs.digest }}
```

## Helm Chart Registry (OCI)

```bash
# Push chart to OCI registry (Helm 3.8+)
helm package charts/order-service --version 1.2.3
helm push order-service-1.2.3.tgz oci://registry.example.com/myorg/charts

# Pull and use in CI/CD
helm upgrade --install order-service \
  oci://registry.example.com/myorg/charts/order-service \
  --version 1.2.3

# GitLab registry (built-in Helm registry)
helm push order-service-1.2.3.tgz oci://registry.gitlab.com/myorg/helm-charts
```

## Artifact Promotion Pattern (staging → production)

```bash
# Promote: re-tag staging image as release candidate (no rebuild)
# Using crane (OCI tool) — copy image without pulling/pushing layers
crane copy \
  registry.example.com/myorg/order-service:main-abc1234 \
  registry.example.com/myorg/order-service:v2.3.1

# Verify digest is same (promotion = same bytes, different tag)
crane digest registry.example.com/myorg/order-service:main-abc1234
crane digest registry.example.com/myorg/order-service:v2.3.1
# Must match ✅
```

## Registry Organization (Harbor / internal)

```
registry.example.com/
├── dev/        ← PR images; retain 7 days; no signing required
│   └── myorg/<service>:<pr-tag>
├── staging/    ← main branch images; retain 30 days; scan required
│   └── myorg/<service>:<sha-tag>
├── releases/   ← versioned releases; retain 1 year; signed + SBOM attached
│   └── myorg/<service>:v<semver>
└── base/       ← internal base images; curated, patched, signed
    ├── python:3.12-slim
    └── golang:1.23-alpine
```

## Retention Policy (Harbor / ECR)

```yaml
# Harbor retention policy (UI or API)
rules:
  - tag_selectors:
      - kind: doublestar
        pattern: "pr-*"
    action: retain
    params:
      latestPushedK: 5        # keep only 5 latest per PR branch
    scope_selectors:
      - kind: daysAgo
        params: { daysAgo: "7" }  # and delete after 7 days regardless

  - tag_selectors:
      - kind: doublestar
        pattern: "v[0-9]*"    # semver tags
    action: retain            # retain all versioned releases
```

```bash
# ECR lifecycle policy
aws ecr put-lifecycle-policy \
  --repository-name myorg/order-service \
  --lifecycle-policy '{
    "rules": [{
      "rulePriority": 1,
      "selection": {
        "tagStatus": "tagged",
        "tagPrefixList": ["pr-"],
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 7
      },
      "action": {"type": "expire"}
    }]
  }'
```

## Vulnerability Database Refresh

```bash
# Trivy: update vuln DB before scanning (don't use stale DB in CI)
trivy image --download-db-only
# Or in GitHub Actions:
- uses: aquasecurity/trivy-action@master
  with:
    update-db: true
```

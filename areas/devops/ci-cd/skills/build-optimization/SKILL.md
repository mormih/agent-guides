---
name: build-optimization
type: skill
description: Optimize CI build speed — Docker layer caching, dependency caching, multi-stage builds, parallelism, and build matrix strategies.
related-rules:
  - pipeline-standards.md
allowed-tools: Read, Write, Edit
---

# Skill: Build Optimization

> **Expertise:** Docker BuildKit cache mounts, GitHub Actions/GitLab CI caching, parallelization, selective test runs.

## When to load

When a pipeline takes > 5 minutes, Docker builds are slow, or you need to reduce CI costs.

## Docker Layer Cache Strategy

```dockerfile
# ✅ Order layers by change frequency (least → most)
FROM python:3.12-slim AS builder

# 1. System deps (changes rarely → cache long)
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev

# 2. Python deps (changes on lockfile update → medium cache)
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# 3. App code (changes every commit → no cache benefit here)
COPY src/ ./src/
```

## BuildKit Cache Mounts (Docker 18.09+)

```dockerfile
# Cache pip downloads across builds (never invalidated by lockfile change)
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --user -r requirements.txt

# Cache npm across builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --cache /root/.npm

# Cache Go modules
RUN --mount=type=cache,target=/go/pkg/mod \
    go build ./...
```

## GitHub Actions Cache

```yaml
# Python: built-in setup-python cache
- uses: actions/setup-python@v5
  with:
    python-version: "3.12"
    cache: pip                      # hashes requirements*.txt automatically

# Node: built-in setup-node cache
- uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: npm

# Go: manual cache
- uses: actions/cache@v4
  with:
    path: |
      ~/.cache/go-build
      ~/go/pkg/mod
    key: go-${{ runner.os }}-${{ hashFiles('**/go.sum') }}
    restore-keys: go-${{ runner.os }}-

# Docker layer cache via GHA cache backend (BuildKit)
- uses: docker/build-push-action@v6
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

## GitLab CI Cache

```yaml
# Global cache shared across jobs (same branch)
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths: [.cache/pip, node_modules/]

# Per-job cache with fallback
test:
  cache:
    key:
      files: [requirements.txt]     # invalidate only when lockfile changes
    paths: [.cache/pip]
    fallback_keys:
      - ${CI_COMMIT_REF_SLUG}-pip
      - pip
```

## Parallelization Strategies

```yaml
# GitHub Actions: parallel jobs
jobs:
  test-unit:
    runs-on: ubuntu-latest
    steps: [... run pytest tests/unit ...]

  test-integration:
    runs-on: ubuntu-latest
    steps: [... run pytest tests/integration ...]

  lint:
    runs-on: ubuntu-latest
    steps: [... ruff + mypy ...]

  # Only after all three pass:
  build:
    needs: [test-unit, test-integration, lint]
```

```yaml
# Matrix builds: test multiple versions in parallel
strategy:
  matrix:
    python-version: ["3.11", "3.12"]
    os: [ubuntu-latest, windows-latest]
  fail-fast: false    # don't cancel other matrix jobs on first failure
```

## Selective Test Runs (path filtering)

```yaml
# GitHub Actions: only run relevant tests based on changed files
jobs:
  changes:
    outputs:
      backend: ${{ steps.filter.outputs.backend }}
      frontend: ${{ steps.filter.outputs.frontend }}
    steps:
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            backend: ['src/backend/**', 'requirements.txt']
            frontend: ['src/frontend/**', 'package.json']

  test-backend:
    needs: changes
    if: needs.changes.outputs.backend == 'true'
    steps: [... pytest src/backend ...]

  test-frontend:
    needs: changes
    if: needs.changes.outputs.frontend == 'true'
    steps: [... jest src/frontend ...]
```

## Build Time Benchmarks (targets)

| Stage | Good | Acceptable | Fix needed |
|:---|:---|:---|:---|
| Dependency install (cached) | < 30s | < 90s | > 90s |
| Docker build (layer cache hit) | < 60s | < 3m | > 3m |
| Unit tests | < 2m | < 5m | > 5m |
| Full pipeline (PR) | < 5m | < 10m | > 10m |

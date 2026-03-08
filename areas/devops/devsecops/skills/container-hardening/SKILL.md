---
name: container-hardening
type: skill
description: Harden container images and Kubernetes workload security contexts — distroless, multi-stage, minimal attack surface.
related-rules:
  - container-security.md
  - shift-left-policy.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: Container Hardening

> **Expertise:** Minimal images, distroless, multi-stage builds, security context, Dockerfile best practices, Trivy scanning.

## When to load

When building a new Dockerfile, hardening an existing image, failing Trivy scan, or setting up pod security contexts.

## Hardened Dockerfile (Python example)

```dockerfile
# ── Stage 1: Build (has build tools, not in final image) ──
FROM python:3.12-slim@sha256:<pinned-digest> AS builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# ── Stage 2: Runtime (minimal, no build tools) ───────────
FROM python:3.12-slim@sha256:<pinned-digest>

# Create non-root user
RUN groupadd -r appgroup --gid=1000 && \
    useradd -r -g appgroup --uid=1000 --no-create-home appuser

WORKDIR /app

# Copy only built artifacts from builder
COPY --from=builder /root/.local /home/appuser/.local
COPY --chown=appuser:appgroup src/ ./src/

# Remove SETUID binaries (attack surface reduction)
RUN find / -perm /6000 -type f -exec chmod a-s {} \; 2>/dev/null || true

# Switch to non-root
USER 1000:1000

# Read-only filesystem friendly: temp dir for app writes
VOLUME ["/tmp"]

EXPOSE 8080

# Prefer exec form (handles signals correctly)
ENTRYPOINT ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

## Distroless (Go example — smallest attack surface)

```dockerfile
FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o server ./cmd/server

# Distroless: no shell, no package manager, no OS utilities
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=builder /app/server /server
USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/server"]
```

## Pod Security Context (K8s manifest)

```yaml
spec:
  securityContext:
    # Pod-level
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 1000
    fsGroup: 1000
    seccompProfile:
      type: RuntimeDefault    # enables syscall filtering

  containers:
    - name: app
      securityContext:
        # Container-level
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop: ["ALL"]
          # add only if explicitly needed:
          # add: ["NET_BIND_SERVICE"]  # bind to port < 1024

      # Writable temp dir for app that needs /tmp
      volumeMounts:
        - name: tmp
          mountPath: /tmp

  volumes:
    - name: tmp
      emptyDir: {}
```

## Trivy Scan Workflow

```bash
# Scan filesystem (during build, before image creation)
trivy fs . \
  --severity CRITICAL,HIGH \
  --exit-code 1 \
  --ignorefile .trivyignore

# Scan built image
trivy image \
  --severity CRITICAL,HIGH \
  --exit-code 1 \
  --format sarif \
  --output trivy-results.sarif \
  registry.example.com/my-service:${GIT_SHA}

# Scan with SBOM (generates and scans simultaneously)
trivy image \
  --format cyclonedx \
  --output sbom.json \
  registry.example.com/my-service:${GIT_SHA}
```

## .trivyignore (CVE exceptions)

```
# CVE-2024-XXXXX - no fix available; tracked in JIRA SEC-456; review 2024-12-01
CVE-2024-XXXXX
```

## Common Hardening Failures + Fixes

| Failure | Cause | Fix |
|:---|:---|:---|
| `runAsRoot` | No USER in Dockerfile | Add `USER 1000:1000` |
| Mutable tag | `:latest` or `:main` | Pin to `@sha256:digest` |
| SETUID binary | Default OS image | Strip: `chmod a-s /usr/bin/passwd` |
| Writable root FS | `readOnlyRootFilesystem: true` blocks writes | Mount `emptyDir` for `/tmp`, `/var/run` |
| Secrets in image | `COPY .env` or `ARG password` | Multi-stage + Docker secrets |

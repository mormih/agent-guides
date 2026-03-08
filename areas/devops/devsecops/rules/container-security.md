# Rule: Container Security Standards

**Priority**: P0 — Containers violating these standards are rejected at deploy time via policy.

## Dockerfile Standards

1. **Non-root user** — `USER 1000:1000` in Dockerfile; never run as root.
2. **Minimal base image** — prefer distroless or Alpine; never `FROM ubuntu:latest`.
3. **Pin base image to digest** — `FROM python:3.12-slim@sha256:...` (not tag-only).
4. **No secrets in layers** — no `COPY .env`, no `ARG password=`; multi-stage to exclude build secrets.
5. **No SETUID binaries** — `RUN find / -perm /6000 -type f -exec chmod a-s {} \;`
6. **Read-only filesystem** where possible — `readOnlyRootFilesystem: true` in pod spec.

## K8s Admission Policy (OPA/Gatekeeper or Kyverno)

Blocked at admission:
- `privileged: true` containers in production namespace
- `runAsRoot: true` or missing `runAsNonRoot`
- `allowPrivilegeEscalation: true`
- Missing `resources.requests` / `resources.limits`
- Image without digest (`:latest` or mutable tag)
- Unsigned images (if cosign policy enabled)

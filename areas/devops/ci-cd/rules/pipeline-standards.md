# Rule: Pipeline Standards

**Priority**: P0 — Pipelines without quality gates do not deploy to production.

## Mandatory Pipeline Stages (in order)

1. **lint** — static analysis, formatting check; zero tolerance for errors
2. **test** — unit + integration; coverage gate ≥ 80% on critical paths
3. **build** — reproducible image/artifact with content-addressable tag (digest)
4. **scan** — SAST + dependency CVE audit + secrets detection; blocks on Critical/High
5. **deploy-staging** — deploy to staging; auto-triggered on main branch merge
6. **smoke-test** — automated health check against staging post-deploy
7. **deploy-production** — manual approval gate + canary rollout

## Image Tagging

```
❌ :latest, :main, :branch-name  (mutable — untraceable)
✅ :<git-sha>                     (immutable, traceable)
✅ image@sha256:<digest>          (preferred in K8s manifests)
```

## Secrets in CI

- CI secrets stored in vault (GitHub Actions Secrets, GitLab Variables masked+protected).
- OIDC-based cloud auth preferred over long-lived access keys.
- No `echo $SECRET` or `env` dump in logs — mask all sensitive values.

## Pipeline as Code

- All pipeline config lives in the repo alongside the code it builds.
- No pipeline configuration via UI — Git is the only source of truth.
- Pipeline changes require peer review (same PR as code changes when possible).

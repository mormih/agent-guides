# Rule: Shift-Left Security Policy

**Priority**: P0 — Security checks are part of CI, not a post-deployment audit.

## Security Pipeline Gates (mandatory, in order)

1. **Pre-commit**: `trufflehog` / `git-secrets` — detect secrets before they enter repo
2. **CI lint stage**: `semgrep` (SAST) — detect code-level vulnerabilities
3. **CI build stage**: `trivy fs .` — scan dependencies before building image
4. **CI after build**: `trivy image` — scan built image for OS + package CVEs
5. **CI after build**: SBOM generated (Syft) + attached to image (cosign)
6. **CD pre-deploy**: image signature verified (cosign verify) — unsigned = blocked

## Severity Thresholds

| Severity | In PR/CI | In CD (deploy) |
|:---|:---|:---|
| Critical | Block merge | Block deploy |
| High | Block merge | Block deploy |
| Medium | Warning comment | Warning; deploy allowed |
| Low | Informational | Pass |

## Exception Process

- Critical/High with no available fix: documented exception + Jira ticket + 30-day expiry.
- CVE in base image, fix not yet available: pin exception with digest; revisit weekly.

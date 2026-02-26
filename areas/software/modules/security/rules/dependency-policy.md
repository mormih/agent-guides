# Rule: Dependency Security Policy

**Priority**: P1 — Critical CVEs block deploy; High CVEs require plan within 72 hours.

## Constraints

1. **No direct use of packages with Critical CVEs**: Upgrade or replace immediately.
2. **High CVEs**: Remediation plan within 72 hours.
3. **Dependency audit in CI**: `npm audit`, `pip audit`, `trivy` run on every PR. Fail on severity ≥ HIGH.
4. **Pin transitive dependencies**: Lockfiles committed to Git (`package-lock.json`, `poetry.lock`, `go.sum`).
5. **No abandoned packages**: Packages without updates > 2 years require security review.
6. **License compliance**: No GPL in closed-source products without legal review. MIT, Apache 2.0, BSD pre-approved.

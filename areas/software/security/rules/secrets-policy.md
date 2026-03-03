# Rule: Secrets Policy

**Priority**: P0 — Any committed secret triggers immediate incident response.

## Constraints

1. **Zero secrets in Git**: No passwords, API keys, tokens, certificates in any committed file — including `.env.example`.
2. **Pre-commit scanning mandatory**: `gitleaks` or `trufflehog` must run as pre-commit hook and in CI on every PR.
3. **Secret store required**: All secrets stored in: AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager, or Azure Key Vault.
4. **Rotation schedule**: Every secret has defined expiry. No secret older than 90 days without documented rotation.
5. **Audit trail**: All secret access events must be logged (CloudTrail, Vault audit log).

## If a Secret is Leaked

```
Within 30 minutes:
1. REVOKE the exposed secret immediately
2. Audit access logs for the exposure window
3. Rotate all secrets sharing the same scope
4. File security incident report
5. Remove from Git history (git filter-repo) — does NOT replace revocation
```

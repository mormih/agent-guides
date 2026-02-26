# `.agent-os` Domain Package: Security (DevSecOps)

> **Version**: 1.0.0
> **Stack**: OWASP / SAST (Semgrep, Snyk) / DAST (ZAP) / Vault / OPA
> **Scope**: Application security, infrastructure security, compliance, identity & access
> **Role**: Horizontal domain — rules are imported by ALL other domain packages
> **Inherits from**: `@agent-os/global`

---

## Package Structure

```
.agent-os/
└── security/
    ├── rules/
    │   ├── secure-coding.md
    │   ├── secrets-policy.md
    │   ├── dependency-policy.md
    │   └── compliance-baseline.md
    ├── skills/
    │   ├── threat-modeling.md
    │   ├── sast-dast-interpretation.md
    │   ├── auth-patterns.md
    │   ├── crypto-standards.md
    │   ├── dependency-audit.md
    │   └── security-headers.md
    └── workflows/
        ├── security-scan.md
        ├── threat-model-review.md
        ├── pen-test-sim.md
        ├── secret-rotation.md
        └── compliance-report.md
```

---

## RULES (Kernel)

> These rules are **global** — they apply regardless of which domain package is active.
> The agent must treat any violation as a blocker, regardless of context.

---

### `rules/secure-coding.md`

# Rule: Secure Coding Standards

**Priority**: P0 — Security vulnerabilities block merge unconditionally.

## Input Validation & Injection Prevention

1. **Validate all inputs at system boundaries**: Every external input (HTTP request, file upload, message queue payload, CLI argument) must be validated for type, length, format, and allowed values before processing.
2. **Parameterized queries only**: SQL must never be constructed via string concatenation. Use ORM methods or parameterized prepared statements. Raw queries with user data are forbidden.
3. **Output encoding**: All user-controlled data rendered in HTML must be encoded to prevent XSS. React's JSX escapes by default — never use `dangerouslySetInnerHTML` without explicit sanitization via `DOMPurify`.
4. **Command injection prevention**: Never pass user input to shell commands (`exec`, `spawn`, `os.system`). If shell execution is necessary, use allowlist validation and argument arrays (not string interpolation).
5. **Path traversal prevention**: File paths constructed from user input must be canonicalized and validated against an allowed base directory.

## Authentication & Authorization

6. **Authentication on all endpoints**: Every API endpoint must explicitly declare its authentication requirement. "Public by default" and "private by exception" is forbidden — use "private by default" with explicit `@public` annotation.
7. **Authorization checked server-side**: Never trust client-side authorization state. Re-verify permissions on every request in the backend.
8. **No security through obscurity**: Hiding endpoints or using non-standard URL schemes is not an access control mechanism.

## Error Handling

9. **No stack traces in production responses**: Error responses must return generic messages to clients. Detailed errors are logged server-side only.
10. **No sensitive data in logs**: Passwords, tokens, credit card numbers, PII must never appear in log output.

---

### `rules/secrets-policy.md`

# Rule: Secrets Policy

**Priority**: P0 — Any committed secret triggers immediate incident response.

## Constraints

1. **Zero secrets in Git**: No passwords, API keys, tokens, certificates, or connection strings in any file committed to version control — including `.env.example` files (use placeholders: `DATABASE_URL=postgres://user:password@host/db`).
2. **Pre-commit scanning mandatory**: `gitleaks` or `trufflesecurity/trufflehog` must run as a pre-commit hook and in CI on every PR.
3. **Secret store required**: All secrets must be stored in an approved system: AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager, or Azure Key Vault.
4. **Rotation schedule**: Secrets must have a defined expiry and rotation schedule. No secret older than 90 days without documented rotation.
5. **Least access**: Each application accesses only the secrets it needs. No shared "master" service account with access to all secrets.
6. **Audit trail**: All secret access events must be logged (AWS CloudTrail, Vault audit log).

## If a Secret is Leaked

```
Immediate actions (within 30 minutes):
1. REVOKE the exposed secret immediately
2. Audit access logs for the exposure window
3. Rotate all secrets that share the same scope
4. File a security incident report
5. Remove from Git history (git filter-repo) — this does NOT replace revocation
```

---

### `rules/dependency-policy.md`

# Rule: Dependency Security Policy

**Priority**: P1 — Critical CVEs block deploy; high CVEs require plan within 72 hours.

## Constraints

1. **No direct use of packages with known Critical CVEs**: Upgrade or replace immediately.
2. **High CVEs**: Must have a remediation plan within 72 hours. Deploy may proceed with documented exception.
3. **Dependency audit in CI**: `npm audit`, `pip audit`, `trivy`, or `snyk test` must run on every PR. Fail on severity ≥ HIGH.
4. **Pin transitive dependencies** for production applications (use lockfiles: `package-lock.json`, `poetry.lock`, `go.sum`). Lockfiles are committed to Git.
5. **No abandoned packages**: Packages without updates for > 2 years and > 1000 weekly downloads require security review before use.
6. **License compliance**: No GPL-licensed libraries in commercial closed-source products without legal review. MIT, Apache 2.0, BSD are pre-approved.

---

### `rules/compliance-baseline.md`

# Rule: Compliance Baseline

**Priority**: P1 — Required before processing real user data.

## Minimum Controls (Applicable to All Projects)

| Control | Requirement |
|:---|:---|
| Encryption at rest | All databases and file storage encrypted |
| Encryption in transit | TLS 1.2+ on all endpoints |
| Access logging | All admin actions logged with actor identity |
| Backup & recovery | Data backed up daily; restore tested quarterly |
| Incident response | Defined escalation path and communication plan |
| Vulnerability scanning | Weekly automated scan; critical patched within 7 days |

## PCI DSS (if handling card data)
- Card data never stored post-authorization (use Stripe/Adyen tokens).
- Network segmentation: cardholder data environment isolated.

## GDPR/CCPA (if processing EU/CA user data)
- Data processing inventory maintained.
- User deletion (right to erasure) must complete within 30 days.
- Breach notification procedure in place (72-hour window for GDPR).

---

## SKILLS (Libraries)

---

### `skills/threat-modeling.md`

# Skill: Threat Modeling

## When to load

When designing a new system, adding a new integration, reviewing an architecture, or preparing for a security review.

## STRIDE Framework

For each component/trust boundary, evaluate against 6 threat categories:

| Threat | Question to ask | Example |
|:---|:---|:---|
| **S**poofing | Can an attacker impersonate a user or service? | Forged JWT, SSRF to metadata service |
| **T**ampering | Can data be modified in transit or at rest? | SQL injection, cache poisoning |
| **R**epudiation | Can users deny performing an action? | Missing audit logs |
| **I**nformation Disclosure | Can sensitive data be exposed? | Error messages leaking stack traces |
| **D**enial of Service | Can the service be made unavailable? | No rate limiting on public endpoints |
| **E**levation of Privilege | Can a low-privilege user gain higher access? | IDOR, broken object-level authorization |

## Data Flow Diagram Checklist

Before threat modeling, map:
- [ ] All external entities (users, third-party services, browsers)
- [ ] All data stores (databases, caches, queues, file systems)
- [ ] All processes (services, Lambda functions, batch jobs)
- [ ] All data flows between components (with protocols and ports)
- [ ] Trust boundaries (where authentication/authorization decisions happen)

## Attack Surface Analysis

```
For a typical REST API, the attack surface includes:
├── Public endpoints (no auth required)
├── Authenticated endpoints
│   ├── Object-level authorization (can user A access resource owned by user B?)
│   ├── Field-level authorization (can user see this field in the response?)
│   └── Function-level authorization (can this role call this admin endpoint?)
├── File upload handling
├── Third-party integrations (webhooks, OAuth callbacks)
├── Background jobs (can a low-privilege user trigger expensive computation?)
└── Admin interfaces (are they truly restricted to admin network/IPs?)
```

## IDOR (Broken Object Level Authorization) — Most Common API Vuln

```python
# ❌ Vulnerable: trusts user-provided ID without ownership check
@app.get("/invoices/{invoice_id}")
def get_invoice(invoice_id: int, current_user: User = Depends(get_current_user)):
    return db.query(Invoice).filter(Invoice.id == invoice_id).first()

# ✅ Safe: always scope queries to authenticated user
@app.get("/invoices/{invoice_id}")
def get_invoice(invoice_id: int, current_user: User = Depends(get_current_user)):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.owner_id == current_user.id  # ← ownership check
    ).first()
    if not invoice:
        raise HTTPException(status_code=404)  # 404, not 403 (don't confirm existence)
    return invoice
```

---

### `skills/auth-patterns.md`

# Skill: Authentication & Authorization Patterns

## When to load

When implementing login, token management, OAuth integration, RBAC, or reviewing auth-related code.

## JWT Best Practices

```python
# Token generation
import jwt
from datetime import datetime, timedelta

def create_access_token(user_id: str) -> str:
    return jwt.encode(
        payload={
            "sub": user_id,           # Subject: user ID
            "iat": datetime.utcnow(),  # Issued at
            "exp": datetime.utcnow() + timedelta(minutes=15),  # Short expiry
            "jti": str(uuid.uuid4()),  # Unique token ID (for revocation)
            "type": "access",          # Prevent refresh token used as access token
        },
        key=settings.JWT_PRIVATE_KEY,
        algorithm="RS256",  # Asymmetric: RS256 or ES256. Never HS256 in distributed systems.
    )
```

**Anti-patterns**:
- JWT with no expiry (`exp` claim missing)
- Storing JWTs in `localStorage` (XSS vulnerable) — use `httpOnly` cookies
- Using `alg: none` — always validate algorithm in verification
- Putting sensitive data in JWT payload — JWTs are base64-encoded, not encrypted

## OAuth 2.0 / OIDC Integration

```
Authorization Code Flow (for web apps with backend):
1. Redirect user → authorization server with: client_id, redirect_uri, scope, state, code_challenge
2. User authenticates at authorization server
3. Server redirects back with: code, state
4. Validate state matches (CSRF protection)
5. Exchange code for tokens (server-side, never in browser)
6. Validate id_token signature and claims (iss, aud, exp, nonce)
7. Store access_token in memory; refresh_token in httpOnly cookie
```

## RBAC Pattern (Role-Based Access Control)

```python
# Define permissions as granular capabilities, not roles
PERMISSIONS = {
    "invoices:read":   ["viewer", "editor", "admin"],
    "invoices:create": ["editor", "admin"],
    "invoices:delete": ["admin"],
    "users:manage":    ["admin"],
}

def require_permission(permission: str):
    def dependency(current_user: User = Depends(get_current_user)):
        allowed_roles = PERMISSIONS.get(permission, [])
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=403)
        return current_user
    return dependency

# Usage:
@app.delete("/invoices/{id}")
def delete_invoice(
    invoice_id: int,
    _: User = Depends(require_permission("invoices:delete"))
):
    ...
```

---

### `skills/sast-dast-interpretation.md`

# Skill: SAST/DAST Results Interpretation

## When to load

When reviewing security scan results, triaging vulnerabilities, or deciding which findings to fix vs. accept.

## SAST (Static Analysis) Triage Matrix

| Severity | CVSS Score | Action | Timeline |
|:---|:---|:---|:---|
| Critical | 9.0–10.0 | Block merge, fix immediately | Same day |
| High | 7.0–8.9 | Block deploy, fix in sprint | 72 hours |
| Medium | 4.0–6.9 | Track as tech debt | 2 weeks |
| Low | 0.1–3.9 | Backlog item | Next quarter |
| Informational | N/A | Acknowledge, optional fix | N/A |

## Common SAST False Positives (Snyk/SonarQube)

```
False positive: "SQL Injection" on ORM query
Reason: Tool detected string interpolation but ORM parameterizes internally
Action: Verify ORM usage is correct → add suppression comment with justification
// snyk:ignore:sql-injection -- using parameterized ORM query (SQLAlchemy text() with bindparams)

False positive: "Hardcoded credential" on config key name
Reason: Tool flagged variable name containing "password" even though it reads from env
Action: Verify value source → suppress with comment
```

## DAST (Dynamic Analysis) — OWASP ZAP Key Checks

```
Priority findings to investigate manually after DAST run:

1. Missing security headers (Content-Security-Policy, X-Frame-Options)
   → Always exploitable; easy fix

2. Information disclosure in error responses
   → Check if stack traces are returned

3. Cross-Site Request Forgery (CSRF)
   → Verify CSRF token on all state-changing requests

4. Clickjacking via missing X-Frame-Options
   → Easy fix: add frame-ancestors CSP directive

5. Insecure cookie attributes
   → Verify: Secure, HttpOnly, SameSite=Strict/Lax
```

---

### `skills/crypto-standards.md`

# Skill: Cryptography Standards

## When to load

When implementing password storage, data encryption, token signing, or key management.

## Approved Algorithms Reference

| Use Case | Approved | Forbidden |
|:---|:---|:---|
| Password hashing | Argon2id, bcrypt (cost≥12), scrypt | MD5, SHA-1, SHA-256 (unsalted) |
| Data encryption | AES-256-GCM, ChaCha20-Poly1305 | DES, 3DES, AES-ECB |
| Token signing | RS256, ES256 (asymmetric) | HS256 (symmetric, shared key) |
| TLS | TLS 1.2+, TLS 1.3 preferred | SSLv3, TLS 1.0, TLS 1.1 |
| Key exchange | ECDH (Curve25519), DH ≥ 2048-bit | RSA-512, RSA-1024 |
| Hashing (non-password) | SHA-256, SHA-3 | MD5, SHA-1 |

## Password Storage (Argon2id)

```python
from argon2 import PasswordHasher

ph = PasswordHasher(
    time_cost=2,      # Iterations
    memory_cost=65536, # 64 MB RAM
    parallelism=2,
    hash_len=32,
    salt_len=16,
)

# Hash on registration/password change
hashed = ph.hash(plain_password)

# Verify on login
try:
    ph.verify(stored_hash, provided_password)
    if ph.check_needs_rehash(stored_hash):
        new_hash = ph.hash(provided_password)  # Update to stronger params
        db.update_password_hash(user_id, new_hash)
except VerifyMismatchError:
    raise InvalidCredentials()
```

## Envelope Encryption (for application data)

```
Pattern: Never encrypt data with a master key directly.

1. Generate a Data Encryption Key (DEK) — unique per record/object
2. Encrypt the data with DEK (AES-256-GCM)
3. Encrypt the DEK with a Key Encryption Key (KEK) stored in KMS
4. Store: encrypted_data + encrypted_DEK + IV

Benefits:
- Key rotation = re-encrypt DEKs only (not all data)
- Breach of one DEK doesn't expose all data
- KMS audit log tracks all key access
```

---

### `skills/security-headers.md`

# Skill: HTTP Security Headers

## When to load

When configuring web servers, API gateways, or reviewing HTTP responses for security headers.

## Required Headers (All HTTP Responses)

```nginx
# nginx configuration
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

# Content-Security-Policy — configure per application needs
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'nonce-{NONCE}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.mycompany.com;
  connect-src 'self' https://api.mycompany.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
" always;
```

## API-Specific Headers

```
For REST APIs (not serving HTML):
- Remove: X-Powered-By, Server (information disclosure)
- Add: X-Request-ID (for tracing), Cache-Control: no-store (for auth responses)
- CORS: Never use Access-Control-Allow-Origin: * for credentialed requests
```

---

### `skills/dependency-audit.md`

# Skill: Dependency Audit

## When to load

When adding new packages, reviewing a PR that adds dependencies, or performing periodic security reviews.

## Pre-Add Checklist (Before `npm install [package]`)

```
1. POPULARITY: > 100k weekly downloads? (low popularity = higher risk of abandonment/hijacking)
2. MAINTENANCE: Last commit within 12 months? Open PRs being reviewed?
3. OWNERSHIP: Well-known org or individual? History of security incidents?
4. SCOPE: Does this package scope match its stated purpose?
         (A CSV parser with network dependencies is suspicious)
5. AUDIT: Run `npm audit` / `snyk test` immediately after adding
6. SIZE: Check bundlephobia.com — is the weight justified?
7. ALTERNATIVES: Is there a built-in Node.js/browser API that does this?
```

## Supply Chain Attack Indicators

```
Red flags in a package:
- Recently transferred ownership
- Sudden version bump with no changelog
- Minified/obfuscated code in source (not just dist)
- install scripts (postinstall, preinstall) that make network requests
- Dependency on a package with a name similar to a popular one (typosquatting)
```

---

## WORKFLOWS (Applications)

---

### `workflows/security-scan.md`

# Workflow: `/security-scan`

**Trigger**: `/security-scan [--scope code|deps|infra|all] [--pr | --full]`

**Purpose**: Run a comprehensive security scan suite and produce a prioritized finding report.

## Steps

```
Step 1: SAST scan (code)
  - Run Semgrep with security ruleset: semgrep --config=p/security-audit
  - Run Snyk Code: snyk code test
  - Parse results, deduplicate

Step 2: Dependency audit (deps)
  - npm audit --json / pip-audit / trivy fs
  - Cross-reference with OSV database for additional CVEs
  - Flag: Critical (block) and High (plan) findings

Step 3: Secret scanning (code)
  - Run trufflehog filesystem scan on staged changes
  - Run gitleaks on git log (last 100 commits if --pr, full history if --full)

Step 4: Infrastructure scan (infra)
  - Run Checkov on terraform/ directory: checkov -d terraform/
  - Run kube-score on K8s manifests if present
  - Map findings to CIS Benchmark controls

Step 5: SYNTHESIZE report
  - Merge all findings, deduplicate by location
  - Assign priority: Critical → High → Medium → Low
  - For each Critical/High: provide specific remediation code example

Step 6: OUTPUT
  - Post summary to PR as review comment
  - If Critical findings: request changes (block merge)
  - If High findings: add comment with 72-hour SLA
  - Save full report to .security/scan-results-{timestamp}.json
```

---

### `workflows/threat-model-review.md`

# Workflow: `/threat-model-review`

**Trigger**: `/threat-model-review [--feature feature-name] [--diagram path/to/diagram.md]`

**Purpose**: Perform a structured threat modeling session for a new feature or system component.

## Steps

```
Step 1: PARSE feature description
  - Extract: what data is processed, who are the actors, what trust boundaries are crossed

Step 2: GENERATE data flow diagram
  - Create a textual DFD: External Entities → Processes → Data Stores → Trust Boundaries
  - Identify all entry points (API endpoints, file inputs, message queues)

Step 3: APPLY STRIDE analysis
  - For each trust boundary crossing, evaluate all 6 STRIDE categories
  - Generate a finding for each identified threat

Step 4: PRIORITIZE findings
  - Score each threat: Likelihood (1-3) × Impact (1-3) = Risk Score
  - Sort by risk score descending

Step 5: GENERATE mitigation recommendations
  - Map each threat to a specific control (from auth-patterns, crypto-standards skills)
  - Classify mitigation as: Required (must implement), Recommended, Accepted risk

Step 6: PRODUCE threat model document
  - Output: threat-model-{feature}.md with DFD, STRIDE table, and mitigations
  - Add to .security/threat-models/ in repository
```

---

### `workflows/pen-test-sim.md`

# Workflow: `/pen-test-sim`

**Trigger**: `/pen-test-sim [--target https://staging.myapp.com] [--scope owasp-top-10]`

**Purpose**: Run an automated penetration test simulation against a staging environment.

## Steps

```
Step 1: SCOPE confirmation
  - Verify target is staging/preview (never run against production)
  - Confirm scope: which endpoints, which OWASP categories
  - Log test start time (for audit log correlation)

Step 2: PASSIVE reconnaissance
  - Crawl target to discover all endpoints (ZAP spider)
  - Identify technologies via response headers
  - Check robots.txt, sitemap.xml for hidden paths

Step 3: ACTIVE scanning (OWASP Top 10)
  - A01 Broken Access Control: Test IDOR on all object endpoints
  - A02 Cryptographic Failures: Check SSL config, header policies
  - A03 Injection: Automated SQLi and XSS probe on all inputs
  - A05 Security Misconfiguration: Check headers, error responses
  - A07 Auth Failures: Test rate limiting, brute force protection
  - A09 Logging Failures: Verify audit log creation for key actions

Step 4: MANUAL checks (high-value targets)
  - Test auth token in URL parameters (should be in header only)
  - Verify password reset flow for token expiry and single-use
  - Check mass assignment on PUT/PATCH endpoints

Step 5: REPORT
  - Generate OWASP-format finding report
  - Include: severity, evidence (request/response), remediation
  - CVSS score for each finding
```

---

### `workflows/secret-rotation.md`

# Workflow: `/secret-rotation`

**Trigger**: `/secret-rotation [--secret-name prod/api/database] [--emergency]`

**Purpose**: Safely rotate a production secret with zero downtime.

## Steps

```
Step 1: PREPARE new secret
  - Generate new credential (strong, random)
  - Store in Secrets Manager as new version (keep old version active)

Step 2: DUAL-READ window
  - If application supports multiple credentials:
    → Update service to accept BOTH old and new credential
  - If single credential only:
    → Schedule 2-minute maintenance window for Step 3

Step 3: DEPLOY new secret
  - Trigger rolling restart to pick up new secret version
  - Monitor pod restarts and error rates during rollout

Step 4: VALIDATE
  - Confirm zero auth errors in logs post-rotation
  - Verify old credential rejected (if applicable)

Step 5: REVOKE old secret
  - Delete old secret version from Secrets Manager
  - Audit log should show no further reads on old version

Step 6: DOCUMENT
  - Record rotation in secret inventory: secret name, date, rotated by
  - Update next rotation date (90 days default)

Emergency rotation (--emergency flag):
  Skips dual-read window; accepts brief service restart
  Triggers immediate P1 incident for root cause analysis
```

---

### `workflows/compliance-report.md`

# Workflow: `/compliance-report`

**Trigger**: `/compliance-report [--standard soc2|iso27001|gdpr|pci] [--period Q1-2026]`

**Purpose**: Generate a compliance artifact with control evidence for audit or self-assessment.

## Steps

```
Step 1: MAP controls
  - Load control framework for requested standard
  - Map each control to evidence sources (logs, configs, policies, scan results)

Step 2: COLLECT evidence
  For each control:
  - Automated: query CloudTrail, Vault audit logs, CI scan results
  - Document: check .security/ for threat models, pentest reports
  - Manual: flag controls requiring human evidence (training records, etc.)

Step 3: EVALUATE compliance
  - Status per control: Compliant / Partial / Non-Compliant / Not Applicable
  - For Partial/Non-Compliant: document gap and remediation plan

Step 4: GENERATE report
  - Executive summary: overall compliance percentage
  - Control matrix: all controls with status and evidence links
  - Gap analysis: Non-compliant controls with risk and remediation timeline
  - Appendix: automated evidence artifacts

Step 5: REVIEW gate
  - Flag report for human review before sharing externally
  - Note: this report is a self-assessment aid, not a certified audit
```

---

## Domain Boundary Notes

### Security as a Horizontal Domain

Security is unique in the `.agent-os` taxonomy: it is not standalone but **imported by all other domains**. The import hierarchy:

```
@agent-os/global
└── @agent-os/security          ← defines the baseline
    ├── @agent-os/backend        imports: secure-coding, auth-patterns
    ├── @agent-os/frontend       imports: security-headers, auth-patterns
    ├── @agent-os/platform       imports: secrets-management, iam-posture
    └── @agent-os/data           imports: pii-handling, encryption-at-rest
```

This means Security rules cannot be toggled off by individual domain packages. They represent the non-negotiable floor.

### Security ↔ Platform (DevSecOps)
- **Overlap**: Checkov/tfsec for IaC scanning, OPA for policy-as-code, WAF configuration.
- **Decision**: Security defines the **policies**; Platform implements the **enforcement mechanisms** in CI/CD pipelines.

### Security ↔ Backend
- **Overlap**: Auth implementation (JWT, OAuth), input validation, database access patterns.
- **Decision**: Security provides the **patterns and standards**; Backend SDLC implements them in application code.

---

## Changelog

| Version | Date | Changes |
|:---|:---|:---|
| 1.0.0 | 2026-02-16 | Initial release. OWASP Top 10, STRIDE, JWT/OAuth, compliance baselines. |

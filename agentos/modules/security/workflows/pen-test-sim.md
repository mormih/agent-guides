# Workflow: `/pen-test-sim`

**Trigger**: `/pen-test-sim [--target https://staging.myapp.com] [--scope owasp-top-10]`

**Purpose**: Run automated penetration test simulation against a staging environment.

## Steps

```
Step 1: SCOPE confirmation
  - Verify target is staging/preview (NEVER production)
  - Log test start time for audit correlation

Step 2: PASSIVE recon
  - ZAP spider: discover all endpoints
  - Identify technologies via response headers
  - Check robots.txt, sitemap.xml

Step 3: ACTIVE scanning (OWASP Top 10)
  - A01 Broken Access Control: IDOR on all object endpoints
  - A02 Cryptographic Failures: SSL config, header policies
  - A03 Injection: SQLi and XSS probes on all inputs
  - A05 Security Misconfiguration: headers, error responses
  - A07 Auth Failures: rate limiting, brute force protection

Step 4: MANUAL checks
  - Auth token in URL parameters?
  - Password reset: token expiry and single-use?
  - Mass assignment on PUT/PATCH endpoints?

Step 5: REPORT
  - OWASP-format finding report
  - Severity, evidence (request/response), remediation
  - CVSS score per finding
```

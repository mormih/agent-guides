# Prompt: `/pen-test-sim`

## OWASP Top 10 polnyy

```
/pen-test-sim --target https://staging.mycompany.com --scope owasp-top-10

Automated pentest na staging (NE production).
Prioritet:
- A01 IDOR: /api/orders/{id}, /api/users/{id}, /api/invoices/{id}
- A03 Injection: vse formy i query params
- A07 Auth: rate limiting na /auth/login, /auth/reset-password

Isklyuchit iz scope: /admin/* (otdelnyy engagement).
Vydat OWASP-format otchet s CVSS score, evidence (request/response), remediation.
```

## Tolko authentication

```
/pen-test-sim --target https://staging.mycompany.com --scope auth

Fokus: authentication i session management.
Proverit: brute force protection, account lockout, JWT validation (alg:none, exp), cookie flags (Secure/HttpOnly/SameSite), password reset token expiry i single-use.
```

# Prompt: `/pen-test-sim`

## OWASP Top 10 полный

```
/pen-test-sim --target https://staging.mycompany.com --scope owasp-top-10

Automated pentest на staging (НЕ production).
Приоритет:
- A01 IDOR: /api/orders/{id}, /api/users/{id}, /api/invoices/{id}
- A03 Injection: все формы и query params
- A07 Auth: rate limiting на /auth/login, /auth/reset-password

Исключить из scope: /admin/* (отдельный engagement).
Выдать OWASP-format отчёт с CVSS score, evidence (request/response), remediation.
```

## Только authentication

```
/pen-test-sim --target https://staging.mycompany.com --scope auth

Фокус: authentication и session management.
Проверить: brute force protection, account lockout, JWT validation (alg:none, exp), cookie flags (Secure/HttpOnly/SameSite), password reset token expiry и single-use.
```

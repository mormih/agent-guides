# Prompt: `/onboard-ingress`

Use when: exposing a new service externally via Kubernetes Ingress with TLS and production-grade config.

---

## Example 1 — Public API with TLS (Let's Encrypt)

**EN:**
```
/onboard-ingress

Service: api-gateway / Namespace: production
Expose at: api.example.com
Backend: api-gateway service, port 8080
TLS: Let's Encrypt via cert-manager (cluster-issuer: letsencrypt-prod)
Requirements:
  - HTTP → HTTPS redirect
  - HSTS header (max-age 1 year)
  - Rate limit: 200 RPS, max 50 connections per IP
  - Security headers: X-Frame-Options DENY, X-Content-Type-Options nosniff
  - CORS: allow origin https://app.example.com only
  - Timeouts: connect 10s, read 60s
Bare-metal: MetalLB in L2 mode, IP pool already configured
```

**RU:**
```
/onboard-ingress

Сервис: api-gateway / Namespace: production
Публикуем по адресу: api.example.com
Backend: сервис api-gateway, порт 8080
TLS: Let's Encrypt через cert-manager (cluster-issuer: letsencrypt-prod)
Требования:
  - Редирект HTTP → HTTPS
  - HSTS заголовок (max-age 1 год)
  - Rate limit: 200 RPS, макс 50 соединений с одного IP
  - Security headers: X-Frame-Options DENY, X-Content-Type-Options nosniff
  - CORS: разрешить только origin https://app.example.com
  - Таймауты: connect 10s, read 60s
Bare-metal: MetalLB в режиме L2, IP pool уже настроен
```

---

## Example 2 — Internal service with canary routing

**EN:**
```
/onboard-ingress

Service: payment-service / Namespace: production
Expose at: payments.internal.example.com (internal DNS only, not public)
TLS: internal CA via cert-manager (cluster-issuer: vault-pki)
Canary: 10% traffic to payment-service-v2 (new version being tested)
Canary header: X-Canary: true → 100% to v2 (for QA testing)
No CORS needed (internal service-to-service only)
```

**RU:**
```
/onboard-ingress

Сервис: payment-service / Namespace: production
Публикуем по адресу: payments.internal.example.com (только внутренний DNS, не публичный)
TLS: внутренний CA через cert-manager (cluster-issuer: vault-pki)
Canary: 10% трафика на payment-service-v2 (новая версия тестируется)
Canary header: X-Canary: true → 100% на v2 (для тестирования QA)
CORS не нужен (только внутренний service-to-service)
```

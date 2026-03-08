# Rule: TLS Policy

**Priority**: P0 — Plaintext in production is a critical violation.

## TLS Requirements

1. **TLS 1.2 minimum** everywhere. TLS 1.0 and 1.1 disabled.
2. **TLS 1.3 preferred** — configure cipher suites for TLS 1.3 first.
3. **Certificate rotation** — certificates renewed at 60 days remaining (before 90-day cert expiry).
4. **cert-manager handles rotation automatically** — no manual certificate management.
5. **HSTS** — HTTP Strict Transport Security header on all public-facing services (max-age ≥ 1 year).
6. **Internal mTLS** — service-to-service traffic uses mutual TLS when service mesh is present.

## Ingress TLS (cert-manager)

```yaml
# TLS with Let's Encrypt (public)
annotations:
  cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
    - hosts: [api.example.com]
      secretName: api-example-com-tls
```

## Certificate Sources

| Use case | Source |
|:---|:---|
| Public-facing services | Let's Encrypt (cert-manager ACME) |
| Internal services | Internal CA (cert-manager with Vault PKI) |
| Wildcard certs | Let's Encrypt DNS-01 challenge |

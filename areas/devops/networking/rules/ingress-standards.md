# Rule: Ingress Standards

**Priority**: P1 — Non-compliant ingress configs are rejected in review.

## NGINX Ingress Standards

1. **One IngressClass per environment** — `nginx` for production, `nginx-staging` for staging.
2. **TLS required** on all production Ingress — no HTTP-only production routes.
3. **HTTP → HTTPS redirect** enforced via annotation.
4. **Rate limiting** on all public-facing Ingress:
   ```yaml
   nginx.ingress.kubernetes.io/limit-rps: "100"
   nginx.ingress.kubernetes.io/limit-connections: "20"
   ```
5. **Request size limit**: `nginx.ingress.kubernetes.io/proxy-body-size: "10m"` (override with justification).
6. **Timeouts defined**: `proxy-connect-timeout: "10"`, `proxy-read-timeout: "60"`.
7. **CORS** configured explicitly — no wildcard `*` origins in production.

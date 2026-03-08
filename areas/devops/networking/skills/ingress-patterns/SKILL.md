---
name: ingress-patterns
type: skill
description: NGINX Ingress Controller patterns — TLS, rate limiting, CORS, rewrites, path-based routing, and MetalLB for bare-metal.
related-rules:
  - ingress-standards.md
  - tls-policy.md
allowed-tools: Read, Write, Edit
---

# Skill: Ingress Patterns

> **Expertise:** NGINX Ingress Controller, MetalLB, cert-manager TLS, rate limiting, CORS, canary routing.

## When to load

When creating or reviewing Kubernetes Ingress resources, setting up TLS, configuring rate limits, or debugging 502/504 responses.

## Standard Production Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-service
  namespace: production
  annotations:
    # TLS + redirect
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"

    # Rate limiting
    nginx.ingress.kubernetes.io/limit-rps: "100"
    nginx.ingress.kubernetes.io/limit-connections: "20"

    # Timeouts (seconds)
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "10"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "60"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "60"

    # TLS cert via cert-manager
    cert-manager.io/cluster-issuer: "letsencrypt-prod"

    # Security headers
    nginx.ingress.kubernetes.io/configuration-snippet: |
      add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
      add_header X-Frame-Options DENY always;
      add_header X-Content-Type-Options nosniff always;
spec:
  ingressClassName: nginx
  tls:
    - hosts: [api.example.com]
      secretName: api-example-com-tls
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port: { number: 80 }
```

## Path-Based Routing (API + Frontend)

```yaml
spec:
  rules:
    - host: example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service: { name: api-service, port: { number: 80 } }
          - path: /
            pathType: Prefix
            backend:
              service: { name: frontend, port: { number: 80 } }
```

## CORS Configuration

```yaml
annotations:
  nginx.ingress.kubernetes.io/enable-cors: "true"
  nginx.ingress.kubernetes.io/cors-allow-origin: "https://app.example.com"  # NOT *
  nginx.ingress.kubernetes.io/cors-allow-methods: "GET, POST, PUT, DELETE, OPTIONS"
  nginx.ingress.kubernetes.io/cors-allow-headers: "Authorization, Content-Type"
  nginx.ingress.kubernetes.io/cors-allow-credentials: "true"
```

## Canary Routing (A/B / blue-green)

```yaml
# Primary ingress (stable)
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-stable
  annotations:
    nginx.ingress.kubernetes.io/canary: "false"
spec: { ... }

# Canary ingress (10% traffic)
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-canary
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "10"   # 10% of traffic
    # OR by header:
    nginx.ingress.kubernetes.io/canary-by-header: "X-Canary"
    nginx.ingress.kubernetes.io/canary-by-header-value: "true"
spec: { ... }  # points to canary service
```

## MetalLB (Bare-Metal Load Balancer)

```yaml
# IPAddressPool — assign bare-metal IPs to LoadBalancer services
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: prod-pool
  namespace: metallb-system
spec:
  addresses:
    - 192.168.10.100-192.168.10.150

---
# L2Advertisement — announce IPs via ARP/NDP
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: l2-advert
  namespace: metallb-system
spec:
  ipAddressPools: [prod-pool]
```

## Debugging Ingress Issues

```bash
# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --tail=100

# Verify ingress is configured correctly
kubectl describe ingress <name> -n <ns>

# Check endpoints (service selecting the right pods?)
kubectl get endpoints <svc> -n <ns>

# Test TLS
curl -v https://api.example.com/health 2>&1 | grep "SSL\|TLS\|certificate"

# Check cert-manager certificate status
kubectl get certificate -n <ns>
kubectl describe certificate <name> -n <ns>
```

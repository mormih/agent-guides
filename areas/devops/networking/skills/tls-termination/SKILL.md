---
name: tls-termination
type: skill
description: Configure TLS termination with cert-manager — Let's Encrypt, internal CA via Vault PKI, wildcard certs, mTLS between services.
related-rules:
  - tls-policy.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: TLS Termination

> **Expertise:** cert-manager ClusterIssuer, Let's Encrypt ACME (HTTP-01 + DNS-01), Vault PKI, cert rotation, mTLS.

## When to load

When setting up TLS for a new service, debugging certificate issuance, rotating certificates, or implementing mTLS.

## cert-manager: Let's Encrypt (HTTP-01)

```yaml
# ClusterIssuer — Let's Encrypt production
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ops@example.com
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
      - http01:
          ingress:
            class: nginx    # must match ingressClassName in Ingress

---
# Staging issuer (for testing — no rate limits)
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: ops@example.com
    privateKeySecretRef:
      name: letsencrypt-staging-key
    solvers:
      - http01:
          ingress:
            class: nginx
```

## cert-manager: Let's Encrypt (DNS-01 — for wildcard certs)

```yaml
# Requires DNS provider API credentials
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-dns
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ops@example.com
    privateKeySecretRef:
      name: letsencrypt-dns-key
    solvers:
      - dns01:
          cloudflare:
            email: ops@example.com
            apiTokenSecretRef:
              name: cloudflare-api-token
              key: api-token

---
# Wildcard certificate
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: wildcard-example-com
  namespace: production
spec:
  secretName: wildcard-example-com-tls
  issuerRef:
    name: letsencrypt-dns
    kind: ClusterIssuer
  dnsNames:
    - "*.example.com"
    - "example.com"
```

## cert-manager: Internal CA via Vault PKI

```yaml
# ClusterIssuer backed by HashiCorp Vault
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: vault-pki
spec:
  vault:
    server: https://vault.infra.svc.cluster.local:8200
    path: pki/sign/internal-services
    auth:
      kubernetes:
        mountPath: /v1/auth/kubernetes
        role: cert-manager
        secretRef:
          name: cert-manager-vault-token
          key: token

---
# Internal service certificate (short-lived, auto-rotated)
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: payment-service-tls
  namespace: production
spec:
  secretName: payment-service-tls
  issuerRef:
    name: vault-pki
    kind: ClusterIssuer
  duration: 24h        # short-lived internal certs
  renewBefore: 8h      # renew 8h before expiry
  dnsNames:
    - payment-service.production.svc.cluster.local
    - payment-service.production
```

## Certificate Debugging

```bash
# Check certificate status
kubectl get certificate -A
kubectl describe certificate <name> -n <ns>
# Look for: Conditions: Ready=True / reason for failure in Events

# Check CertificateRequest and Order (debugging ACME)
kubectl get certificaterequest -n <ns>
kubectl describe certificaterequest <n> -n <ns>
kubectl get order -n <ns>
kubectl describe order <n> -n <ns>

# Test ACME challenge reachability
curl -v http://<domain>/.well-known/acme-challenge/test

# Check TLS certificate details
echo | openssl s_client -connect api.example.com:443 -servername api.example.com 2>/dev/null \
  | openssl x509 -noout -text | grep -E "Subject:|DNS:|Not After"

# Check cert expiry for all ingresses
kubectl get secret -A -o json | jq -r '
  .items[] | select(.type == "kubernetes.io/tls") |
  "\(.metadata.namespace)/\(.metadata.name)"' | while read secret; do
  ns=$(echo $secret | cut -d/ -f1)
  name=$(echo $secret | cut -d/ -f2)
  kubectl get secret $name -n $ns -o jsonpath='{.data.tls\.crt}' | \
    base64 -d | openssl x509 -noout -enddate -subject 2>/dev/null | \
    awk -v s="$secret" '{print s": "$0}'
done
```

## mTLS (service-to-service with cert-manager)

```yaml
# Each service gets a client cert for mTLS
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: order-service-client-cert
  namespace: production
spec:
  secretName: order-service-client-tls
  issuerRef:
    name: vault-pki
    kind: ClusterIssuer
  duration: 24h
  usages:
    - client auth    # mTLS client usage
    - digital signature
  subject:
    organizations: [mycompany]
  commonName: order-service.production
```

```python
# Python: use client cert for mTLS call to upstream
import httpx

client = httpx.Client(
    cert=("/var/run/secrets/tls/tls.crt", "/var/run/secrets/tls/tls.key"),
    verify="/var/run/secrets/ca/ca.crt",   # internal CA bundle
)
response = client.get("https://payment-service.production.svc.cluster.local:8443/charge")
```

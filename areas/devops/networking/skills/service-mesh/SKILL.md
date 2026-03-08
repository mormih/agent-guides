---
name: service-mesh
type: skill
description: Implement service mesh for mTLS, traffic management, and observability — Istio and Linkerd patterns for Kubernetes.
related-rules:
  - network-segmentation.md
  - tls-policy.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: Service Mesh

> **Expertise:** Istio and Linkerd installation, mTLS enforcement, traffic shifting, circuit breakers, retry policies, observability.

## When to load

When implementing service-to-service mTLS, traffic shifting for canary deploys, circuit breakers, or setting up mesh-level observability.

## Linkerd (lightweight — recommended for bare-metal K8s)

```bash
# Install Linkerd CLI
curl --proto '=https' --tlsv1.2 -sSfL https://run.linkerd.io/install | sh

# Pre-flight check
linkerd check --pre

# Install Linkerd (cert-manager manages control plane certs)
linkerd install --crds | kubectl apply -f -
linkerd install \
  --set identity.externalCA=true \
  --set identity.issuer.scheme=kubernetes.io/tls \
  | kubectl apply -f -

# Install observability extension (Prometheus + Grafana)
linkerd viz install | kubectl apply -f -

# Verify
linkerd check
```

## Linkerd: Inject Sidecar

```yaml
# Namespace-level injection (all pods in namespace get sidecar)
metadata:
  annotations:
    linkerd.io/inject: enabled

# Per-deployment injection
spec:
  template:
    metadata:
      annotations:
        linkerd.io/inject: enabled

# Skip injection for a specific pod (e.g., database, cronjob)
metadata:
  annotations:
    linkerd.io/inject: disabled
```

## Linkerd: Traffic Policies

```yaml
# Retry policy (retry on 5xx up to 3 times)
apiVersion: policy.linkerd.io/v1beta3
kind: HTTPRoute
metadata:
  name: order-service-retries
  namespace: production
spec:
  parentRefs:
    - name: order-service
      kind: Service
      group: core
      port: 8080
  rules:
    - filters:
        - type: RequestRedirect   # or RequestMirror, URLRewrite
      backendRefs:
        - name: order-service
          port: 8080

---
# Timeout policy
apiVersion: policy.linkerd.io/v1alpha1
kind: ServiceProfile
metadata:
  name: order-service.production.svc.cluster.local
  namespace: production
spec:
  routes:
    - name: POST /orders
      condition:
        method: POST
        pathRegex: /orders
      timeout: 5s
      retryBudget:
        retryRatio: 0.2       # retry up to 20% of requests
        minRetriesPerSecond: 10
        ttl: 10s
```

## Istio (full-featured — more complex)

```bash
# Install Istio with minimal profile (no telemetry addons)
istioctl install --set profile=minimal -y

# Verify
istioctl verify-install
kubectl get pods -n istio-system
```

```yaml
# Enable sidecar injection for namespace
kubectl label namespace production istio-injection=enabled

# Strict mTLS (reject plaintext between injected services)
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT       # STRICT | PERMISSIVE | DISABLE

---
# AuthorizationPolicy: only allow order-service → payment-service
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: payment-service-authz
  namespace: production
spec:
  selector:
    matchLabels: { app: payment-service }
  action: ALLOW
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/production/sa/order-service"]
      to:
        - operation:
            methods: ["POST"]
            paths: ["/charge"]
```

```yaml
# Istio: traffic shifting (canary)
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: order-service
  namespace: production
spec:
  hosts: [order-service]
  http:
    - route:
        - destination:
            host: order-service
            subset: stable
          weight: 90
        - destination:
            host: order-service
            subset: canary
          weight: 10
---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: order-service
  namespace: production
spec:
  host: order-service
  subsets:
    - name: stable
      labels: { version: stable }
    - name: canary
      labels: { version: canary }
    trafficPolicy:
      connectionPool:
        tcp: { maxConnections: 100 }
      outlierDetection:
        consecutiveGatewayErrors: 5
        interval: 10s
        baseEjectionTime: 30s    # circuit breaker: eject after 5 errors
```

## Mesh Observability

```bash
# Linkerd: live traffic stats
linkerd viz stat deploy -n production
linkerd viz top deploy/order-service -n production
linkerd viz tap deploy/order-service -n production

# Linkerd: service topology
linkerd viz edges deployment -n production

# Istio: traffic analysis
istioctl analyze -n production
kubectl exec -it <pod> -c istio-proxy -n production -- pilot-agent request GET stats | grep upstream_cx
```

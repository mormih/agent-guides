---
name: network-policies
type: skill
description: Design and implement Kubernetes NetworkPolicy and Cilium network policies for namespace isolation and service-to-service access control.
related-rules:
  - workload-security.md
  - cluster-standards.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: Network Policies

> **Expertise:** K8s NetworkPolicy + Cilium policy design for multi-tenant namespace isolation and zero-trust traffic control.

## When to load

When isolating a new namespace, allowing specific service-to-service communication, debugging traffic being blocked, or auditing inter-namespace access.

## Standard Policy Set (apply to every new namespace)

```yaml
# 1. Default deny-all (must be first)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: my-app
spec:
  podSelector: {}              # matches ALL pods in namespace
  policyTypes: [Ingress, Egress]

---
# 2. Allow DNS (required for all pods)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns-egress
  namespace: my-app
spec:
  podSelector: {}
  policyTypes: [Egress]
  egress:
    - ports:
        - port: 53
          protocol: UDP
        - port: 53
          protocol: TCP

---
# 3. Allow ingress from ingress controller
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress-controller
  namespace: my-app
spec:
  podSelector:
    matchLabels:
      app: my-service
  policyTypes: [Ingress]
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
      ports:
        - port: 8080
```

## Service-to-Service Policy

```yaml
# Allow order-service (in orders ns) to call payment-service (in payments ns)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-from-orders
  namespace: payments
spec:
  podSelector:
    matchLabels:
      app: payment-service
  policyTypes: [Ingress]
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: orders
          podSelector:
            matchLabels:
              app: order-service
      ports:
        - port: 8080
```

## Monitoring Ingress (Prometheus scraping)

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-prometheus-scrape
  namespace: my-app
spec:
  podSelector: {}              # allow scraping all pods in ns
  policyTypes: [Ingress]
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: monitoring
      ports:
        - port: 9090            # metrics port
```

## Cilium Policies (extended capabilities)

```yaml
# Cilium L7 policy — allow only GET /api/* (not POST/DELETE)
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: order-service-l7
  namespace: production
spec:
  endpointSelector:
    matchLabels:
      app: order-service
  ingress:
    - fromEndpoints:
        - matchLabels:
            app: frontend
      toPorts:
        - ports:
            - port: "8080"
              protocol: TCP
          rules:
            http:
              - method: GET
                path: /api/.*
```

## Debugging Blocked Traffic

```bash
# Cilium: observe dropped packets in real-time
kubectl -n kube-system exec -it $(kubectl -n kube-system get pods -l k8s-app=cilium -o jsonpath='{.items[0].metadata.name}') \
  -- cilium monitor --type drop

# Hubble (if installed): flows between pods
hubble observe --namespace my-app --verdict DROPPED

# Calico: check policy hits
kubectl exec -n kube-system <calico-node-pod> -- calicoctl get networkpolicy -n my-app

# Test connectivity manually
kubectl run test-pod --image=curlimages/curl -it --rm --restart=Never -- \
  curl -v http://payment-service.payments.svc.cluster.local:8080/health
```

## Policy Design Checklist

- [ ] Default deny-all applied to namespace
- [ ] DNS egress allowed (port 53 UDP+TCP)
- [ ] All required ingress/egress explicitly whitelisted
- [ ] Ingress controller namespace allowed where applicable
- [ ] Monitoring (Prometheus) scrape allowed
- [ ] Cross-namespace refs use `namespaceSelector` with metadata label
- [ ] Labels used in policies exist on actual pods

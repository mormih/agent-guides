---
name: dns-management
type: skill
description: DNS management for Kubernetes — CoreDNS tuning, external-dns automation, split-horizon DNS, and bare-metal DNS design.
related-rules:
  - network-segmentation.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: DNS Management

> **Expertise:** CoreDNS configuration, external-dns operator, split-horizon DNS, DNS debugging, bare-metal DNS topology.

## When to load

When services can't resolve DNS, setting up external-dns automation, configuring split-horizon, or designing DNS for a new cluster.

## CoreDNS: Cluster DNS Configuration

```yaml
# ConfigMap: coredns (kube-system)
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
      errors
      health { lameduck 5s }
      ready
      
      # Kubernetes in-cluster DNS
      kubernetes cluster.local in-addr.arpa ip6.arpa {
        pods insecure
        fallthrough in-addr.arpa ip6.arpa
        ttl 30
      }
      
      # Forward internal domain to internal DNS server
      internal.example.com {
        forward . 192.168.10.53
      }
      
      # Forward everything else to upstream resolvers
      forward . 1.1.1.1 8.8.8.8 {
        max_concurrent 1000
        prefer_udp
      }
      
      cache 300           # 5-minute DNS cache
      loop                # detect forwarding loops
      reload              # hot-reload ConfigMap changes
      loadbalance         # round-robin DNS responses
      
      # Log DNS errors (not all queries — too noisy)
      log . {
        class error
      }
    }
```

## external-dns (Automated DNS Record Management)

```yaml
# external-dns reads Ingress/Service annotations and creates DNS records
# Install:
helm upgrade --install external-dns external-dns/external-dns \
  -n kube-system \
  -f external-dns-values.yaml

# external-dns-values.yaml
provider: cloudflare          # cloudflare, route53, hetzner, etc.
env:
  - name: CF_API_TOKEN
    valueFrom:
      secretKeyRef:
        name: cloudflare-token
        key: token

sources:
  - ingress
  - service
domainFilters:
  - example.com
policy: upsert-only           # never delete records (safer); use 'sync' to delete orphans
txtOwnerId: prod-cluster      # unique per cluster — prevents multi-cluster conflicts
interval: 1m
```

```yaml
# Ingress: external-dns annotation (auto-creates DNS record)
metadata:
  annotations:
    external-dns.alpha.kubernetes.io/hostname: api.example.com
    external-dns.alpha.kubernetes.io/ttl: "300"
```

```yaml
# Service (LoadBalancer): automatic DNS for MetalLB IP
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
  annotations:
    external-dns.alpha.kubernetes.io/hostname: api.example.com
spec:
  type: LoadBalancer
  # MetalLB assigns external IP → external-dns creates A record pointing to it
```

## Split-Horizon DNS (internal vs external)

```
External DNS (Cloudflare/Route53):
  api.example.com → 203.0.113.10  (public load balancer IP)

Internal DNS (CoreDNS custom zone):
  api.example.com → 10.10.16.100  (internal load balancer, bypasses public internet)

CoreDNS config for split-horizon:
  api.example.com {
    hosts {
      10.10.16.100  api.example.com
      fallthrough
    }
  }
```

## DNS Debugging

```bash
# Test DNS resolution from within cluster
kubectl run -it --rm dns-debug \
  --image=infoblox/dnstools \
  --restart=Never -- /bin/sh

# Inside the pod:
dig api.example.com                           # external DNS
dig payment-service.production.svc.cluster.local  # in-cluster DNS
nslookup kubernetes.default.svc.cluster.local     # API server
dig @10.96.0.10 payment-service.production        # query CoreDNS directly

# Check CoreDNS is healthy
kubectl get pods -n kube-system -l k8s-app=kube-dns
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=50

# Debug DNS on a running pod (without kubectl exec)
kubectl debug -it <pod> -n <ns> --image=infoblox/dnstools -- dig <hostname>

# Enable DNS query logging temporarily (for debugging, then revert)
# Add to Corefile: log . (logs ALL queries — high volume, use briefly)

# Check /etc/resolv.conf in a pod
kubectl exec -it <pod> -n <ns> -- cat /etc/resolv.conf
# Expected: nameserver 10.96.0.10 (CoreDNS cluster IP)
#           search <namespace>.svc.cluster.local svc.cluster.local cluster.local
```

## Common DNS Issues

| Symptom | Cause | Fix |
|:---|:---|:---|
| `NXDOMAIN` for internal service | Wrong namespace in FQDN | Use `svc.namespace.svc.cluster.local` |
| DNS timeout intermittent | CoreDNS overloaded | Increase replicas; add cache; check ndots |
| Slow external DNS (> 2s) | ndots=5 causing unnecessary queries | Append `.` to FQDNs or set ndots=1 |
| `connection refused` to external | Egress NetworkPolicy blocks port 53 | Add allow-dns-egress NetworkPolicy |
| external-dns not creating records | txtOwnerId conflict with another cluster | Use unique txtOwnerId per cluster |

# Rule: Network Segmentation

**Priority**: P0 — Flat networks are forbidden in production.

## Kubernetes Network Segmentation

1. **Default-deny-all NetworkPolicy** on every production namespace — see kubernetes/rules/workload-security.md.
2. **Namespace = trust boundary** — inter-namespace communication explicitly allowed only.
3. **Node network isolation** — control plane nodes in separate subnet; workers in private subnet; no public IPs on nodes.

## Bare-Metal / Cloud Network Zones

| Zone | Contents | Inbound | Outbound |
|:---|:---|:---|:---|
| Public | Load balancers, ingress controllers | Internet | Internal only |
| Application | K8s worker nodes, app servers | From public zone | Internet via NAT |
| Data | Databases, object storage, message queues | From application zone | None |
| Management | Jump hosts, CI runners, monitoring | VPN/MFA only | All zones |

4. **Data zone has no outbound internet** — no NAT gateway for DB subnets.
5. **Jump host or VPN for SSH** — direct SSH from internet to worker nodes is forbidden.

## Service Mesh (when applicable)
6. **mTLS between all services** when service mesh (Istio/Linkerd) is deployed — no plaintext service-to-service.

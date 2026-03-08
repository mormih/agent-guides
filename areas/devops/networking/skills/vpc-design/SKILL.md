---
name: vpc-design
type: skill
description: Design cloud-agnostic private networks — subnet layout, CIDR allocation, zone redundancy, routing, and bare-metal equivalent.
related-rules:
  - network-segmentation.md
allowed-tools: Read, Write, Edit
---

# Skill: VPC / Network Design

> **Expertise:** CIDR planning, zone-redundant subnets, routing tables, NAT, VPN/peering — AWS, GCP, Hetzner, and bare-metal.

## When to load

When designing a new network for a cloud environment or bare-metal cluster, planning subnets, or diagnosing routing issues.

## CIDR Allocation Strategy

```
Organization supernet: 10.0.0.0/8

Environment blocks:
  production:  10.10.0.0/16  (65,534 addresses)
  staging:     10.20.0.0/16
  dev:         10.30.0.0/16

Per-environment subnet layout (/16 → four /18 zones):
  Zone A (eu-west-1a): 10.10.0.0/18   (16,382 IPs)
    Public subnet:     10.10.0.0/20   (4,094 IPs — load balancers, NAT GW)
    App subnet:        10.10.16.0/20  (4,094 IPs — K8s nodes)
    Data subnet:       10.10.32.0/20  (4,094 IPs — databases, Redis)

  Zone B (eu-west-1b): 10.10.64.0/18
    (same subdivision pattern)

  Zone C (eu-west-1c): 10.10.128.0/18
    (same subdivision pattern)

  Reserved / Management: 10.10.192.0/18
    Management subnet: 10.10.192.0/24  (jump hosts, CI runners)
    Future expansion:  10.10.193.0/18
```

## Terraform: AWS VPC Module

```hcl
module "vpc" {
  source  = "git::https://git.example.com/infra/modules//vpc?ref=v2.1.0"

  project     = var.project
  environment = var.environment
  cidr        = "10.10.0.0/16"

  azs              = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
  public_subnets   = ["10.10.0.0/20",  "10.10.64.0/20",  "10.10.128.0/20"]
  private_subnets  = ["10.10.16.0/20", "10.10.80.0/20",  "10.10.144.0/20"]
  database_subnets = ["10.10.32.0/20", "10.10.96.0/20",  "10.10.160.0/20"]

  enable_nat_gateway = true
  single_nat_gateway = var.environment != "production"  # save cost in non-prod

  # K8s tags (required for AWS Load Balancer Controller)
  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1"
    "kubernetes.io/cluster/${local.cluster_name}" = "owned"
  }
  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1"
  }
}
```

## Terraform: Hetzner Network

```hcl
resource "hcloud_network" "main" {
  name     = "${var.project}-${var.environment}"
  ip_range = "10.10.0.0/16"
}

resource "hcloud_network_subnet" "k8s_nodes" {
  network_id   = hcloud_network.main.id
  type         = "cloud"
  network_zone = "eu-central"
  ip_range     = "10.10.16.0/20"
}

resource "hcloud_network_subnet" "databases" {
  network_id   = hcloud_network.main.id
  type         = "cloud"
  network_zone = "eu-central"
  ip_range     = "10.10.32.0/20"
}

# Attach servers to subnets
resource "hcloud_server_network" "worker" {
  for_each  = var.worker_servers
  server_id = each.value.id
  network_id = hcloud_network.main.id
  ip         = each.value.private_ip
}
```

## Bare-Metal Network Design

```
Physical topology:
  - 2× top-of-rack switches (bonded for HA)
  - Each server: 2× 10GbE NICs (bonded: active-backup or LACP)

VLAN layout:
  VLAN 10 (management): 192.168.10.0/24  — IPMI, switch mgmt
  VLAN 20 (K8s nodes):  10.10.16.0/20   — kubelet, pod CIDR routed
  VLAN 30 (storage):    10.10.32.0/24   — Longhorn/Ceph replication
  VLAN 40 (public):     203.0.113.0/28  — load balancer IPs (MetalLB pool)

Routing:
  - Default GW on VLAN 20 → firewall → internet (via NAT for egress)
  - VLAN 30 (storage) — no routing outside rack (isolated L2)
  - VLAN 40 — router sends public IPs to MetalLB L2 advertisement
```

## Network Security Design Checklist

- [ ] Data subnets have no route to internet (no NAT GW for DB subnet)
- [ ] Management access via VPN or jump host only (no public SSH)
- [ ] NAT Gateway in each AZ (not single NAT — single point of failure)
- [ ] VPC Flow Logs enabled (30-day retention)
- [ ] Security groups default-deny; rules documented with justification
- [ ] Subnet CIDR does not overlap with on-prem or peered VPCs
- [ ] IPv6 considered (especially for K8s pod addressing at scale)

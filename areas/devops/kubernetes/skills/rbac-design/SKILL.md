---
name: rbac-design
type: skill
description: Design minimal-privilege RBAC for workloads, operators, and human access in multi-tenant clusters.
related-rules:
  - workload-security.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: RBAC Design

> **Expertise:** Kubernetes RBAC — service accounts, Roles, ClusterRoles, namespace isolation, human access patterns.

## When to load

When onboarding a new service, setting up CI/CD cluster access, auditing permissions, or debugging "forbidden" API errors.

## RBAC Object Hierarchy

```
ClusterRole         → cluster-scoped permissions (nodes, PVs, namespaces)
Role                → namespace-scoped permissions (pods, services, configmaps)
ClusterRoleBinding  → binds ClusterRole to subject cluster-wide
RoleBinding         → binds Role OR ClusterRole to subject in one namespace
```

## Workload Service Account Pattern

```yaml
# 1. Dedicated ServiceAccount per workload
apiVersion: v1
kind: ServiceAccount
metadata:
  name: order-service
  namespace: production
  annotations:
    # For cloud IAM federation (AWS IRSA, GCP Workload Identity)
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789:role/order-service-prod
automountServiceAccountToken: false  # disable unless needed

---
# 2. Role — minimal permissions
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: order-service
  namespace: production
rules:
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get", "list", "watch"]
    resourceNames: ["order-service-config"]  # scope to specific resource
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get"]
    resourceNames: ["order-service-tls"]

---
# 3. RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: order-service
  namespace: production
subjects:
  - kind: ServiceAccount
    name: order-service
    namespace: production
roleRef:
  kind: Role
  apiGroupv: rbac.authorization.k8s.io
  name: order-service
```

## Human Access Patterns

```yaml
# Dev read-only access to staging namespace
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: devs-view-staging
  namespace: staging
subjects:
  - kind: Group
    name: developers           # from OIDC provider (Dex, Okta, etc.)
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: view                   # built-in read-only ClusterRole
  apiGroup: rbac.authorization.k8s.io
```

## Built-in ClusterRoles (use before creating custom)

| ClusterRole | Access level |
|:---|:---|
| `view` | Read-only all namespaced resources |
| `edit` | Read/write most namespaced resources; no RBAC |
| `admin` | Full namespace access including RBAC |
| `cluster-admin` | Full cluster access — **never bind to apps** |

## CI/CD Access Pattern

```yaml
# CI system gets minimal cluster access
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: ci-deployer
rules:
  - apiGroups: ["apps"]
    resources: ["deployments", "statefulsets"]
    verbs: ["get", "list", "patch", "update"]
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list"]
  # NOT: create/delete pods, access secrets, modify RBAC
```

## RBAC Audit Commands

```bash
# What can a ServiceAccount do?
kubectl auth can-i --list \
  --as=system:serviceaccount:production:order-service \
  -n production

# Who can do X in namespace Y?
kubectl who-can get secrets -n production    # requires kubectl-who-can plugin

# Find all RoleBindings in a namespace
kubectl get rolebindings,clusterrolebindings -n production -o wide

# Check if a specific action is allowed
kubectl auth can-i delete pods -n production \
  --as=system:serviceaccount:production:order-service
```

## Common Misconfigurations

| Mistake | Risk | Fix |
|:---|:---|:---|
| Using `default` ServiceAccount | All pods in namespace share permissions | Dedicate one SA per workload |
| `verbs: ["*"]` | Full resource control | Enumerate exact verbs needed |
| `resources: ["*"]` | Access to all resources | List explicitly |
| Binding `cluster-admin` to CI | Breach = full cluster takeover | Use scoped `ci-deployer` ClusterRole |
| `automountServiceAccountToken: true` (default) | Token injected into all pods | Set to `false` unless needed |

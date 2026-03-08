# Rule: Policy as Code

**Priority**: P1 — Security policies enforced as admission controllers, not documentation.

## OPA/Gatekeeper vs Kyverno

| | OPA/Gatekeeper | Kyverno |
|:---|:---|:---|
| Language | Rego | YAML/JMESPath |
| Learning curve | Higher | Lower |
| Best for | Complex logic, cross-resource | Simple K8s guardrails |
| Mutation | Limited | Built-in |

## Policy Categories

1. **Validation** — reject non-compliant resources (privilege escalation, missing labels)
2. **Mutation** — auto-add default values (labels, security context defaults)
3. **Generation** — auto-create companion resources (default NetworkPolicy per namespace)

## Policy Testing (required before deploy)

```bash
# OPA/Gatekeeper: unit test policies
opa test policies/ -v

# Kyverno: test policies against example manifests
kyverno test . --test-case-selector "policy=disallow-privileged"
```

## Mandatory Policies (deploy to all clusters)

- `disallow-privileged-containers`
- `require-non-root-user`
- `require-resource-limits`
- `require-readonly-root-filesystem` (warn in staging, enforce in production)
- `require-image-digest` (no `:latest` tags)
- `disallow-host-namespaces` (no hostNetwork, hostPID, hostIPC)

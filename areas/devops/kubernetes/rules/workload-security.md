# Rule: Workload Security

**Priority**: P0 — Security violations block deployment to production namespaces.

## Pod Security Admission (PSA)

1. **Namespace-level enforcement**
   - `production` namespaces: `pod-security.kubernetes.io/enforce: restricted`
   - `staging` namespaces: `pod-security.kubernetes.io/enforce: baseline`
   - `dev` / `system` namespaces: `pod-security.kubernetes.io/warn: baseline`
   - Never use `privileged` profile in production without explicit exemption + runbook.

2. **Restricted profile requirements (enforced)**
   ```yaml
   securityContext:
     runAsNonRoot: true
     runAsUser: 1000          # non-zero UID
     readOnlyRootFilesystem: true
     allowPrivilegeEscalation: false
     capabilities:
       drop: ["ALL"]
     seccompProfile:
       type: RuntimeDefault
   ```

## RBAC

3. **Service account principle of least privilege**
   - Every workload gets a dedicated `ServiceAccount` — never use `default`.
   - `automountServiceAccountToken: false` unless the pod explicitly needs API access.
   - `ClusterRole` only when cross-namespace access is architecturally justified.

4. **Forbidden bindings**
   - `cluster-admin` ClusterRoleBinding for non-system service accounts: **BLOCKED**.
   - Binding `system:masters` group to application identities: **BLOCKED**.
   - Wildcard verbs (`*`) in production Role/ClusterRole without documented exception.

## Network Policy

5. **Default-deny posture**
   - Every namespace must have a default-deny-all NetworkPolicy at creation.
   - Ingress and egress explicitly whitelisted per workload.

   ```yaml
   # Default deny-all (apply to every new namespace)
   apiVersion: networking.k8s.io/v1
   kind: NetworkPolicy
   metadata:
     name: default-deny-all
   spec:
     podSelector: {}
     policyTypes: [Ingress, Egress]
   ```

6. **Inter-namespace traffic**
   - Namespaces are isolated by default; cross-namespace communication requires explicit policy.
   - System namespaces (`kube-system`, `monitoring`) may egress to all; ingress restricted to operators.

## Secrets

7. **Secret hygiene**
   - Secrets never stored in ConfigMaps or environment variable literals in pod spec.
   - Use External Secrets Operator (ESO) to sync from Vault / AWS Secrets Manager / etc.
   - `etcd` encryption at rest mandatory (`EncryptionConfiguration` with `aescbc` or KMS provider).

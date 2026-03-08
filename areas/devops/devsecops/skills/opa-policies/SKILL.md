---
name: opa-policies
type: skill
description: Write OPA/Gatekeeper and Kyverno admission policies for Kubernetes security guardrails.
related-rules:
  - policy-as-code.md
  - container-security.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: OPA Policies & Kyverno

> **Expertise:** Gatekeeper ConstraintTemplates, Kyverno ClusterPolicies, validation + mutation + generation.

## When to load

When writing admission policies, testing policy changes, or debugging policy-blocked deployments.

## Gatekeeper: ConstraintTemplate + Constraint

```yaml
# 1. ConstraintTemplate — defines the policy logic in Rego
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: k8srequirenonroot
spec:
  crd:
    spec:
      names: { kind: K8sRequireNonRoot }
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequirenonroot

        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          not container.securityContext.runAsNonRoot
          msg := sprintf("Container '%v' must set runAsNonRoot: true", [container.name])
        }

        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          container.securityContext.runAsUser == 0
          msg := sprintf("Container '%v' must not run as UID 0", [container.name])
        }

---
# 2. Constraint — applies the template to specific resources/namespaces
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequireNonRoot
metadata:
  name: require-non-root-production
spec:
  enforcementAction: deny           # deny | warn | dryrun
  match:
    kinds:
      - apiGroups: [apps]
        kinds: [Deployment, StatefulSet, DaemonSet]
    namespaceSelector:
      matchExpressions:
        - key: environment
          operator: In
          values: [production, staging]
```

## Gatekeeper: Require Image Digest

```yaml
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: k8srequireimagedigest
spec:
  crd:
    spec:
      names: { kind: K8sRequireImageDigest }
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequireimagedigest

        violation[{"msg": msg}] {
          container := input.review.object.spec.containers[_]
          not contains(container.image, "@sha256:")
          msg := sprintf(
            "Container '%v' image '%v' must reference a digest (@sha256:...), not a mutable tag",
            [container.name, container.image]
          )
        }
```

## Kyverno: Simpler YAML Policies

```yaml
# Disallow privileged containers (Kyverno)
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-privileged-containers
spec:
  validationFailureAction: Enforce
  rules:
    - name: check-privileged
      match:
        any:
          - resources:
              kinds: [Pod]
              namespaces: [production, staging]
      validate:
        message: "Privileged containers are not allowed in production/staging"
        pattern:
          spec:
            containers:
              - =(securityContext):
                  =(privileged): "false"
```

```yaml
# Kyverno MUTATION — auto-add security context defaults
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: add-default-securitycontext
spec:
  rules:
    - name: add-security-context
      match:
        any:
          - resources: { kinds: [Pod] }
      mutate:
        patchStrategicMerge:
          spec:
            containers:
              - (name): "*"
                securityContext:
                  +(runAsNonRoot): true
                  +(allowPrivilegeEscalation): false
                  +(readOnlyRootFilesystem): true
```

## Policy Testing

```bash
# OPA unit tests
cat > policies/test_nonroot.rego << 'REGO'
package k8srequirenonroot

test_deny_root_container {
  violation[{"msg": _}] with input as {
    "review": {"object": {"spec": {"containers": [
      {"name": "app", "securityContext": {"runAsUser": 0}}
    ]}}}
  }
}

test_allow_nonroot_container {
  count(violation) == 0 with input as {
    "review": {"object": {"spec": {"containers": [
      {"name": "app", "securityContext": {"runAsNonRoot": true, "runAsUser": 1000}}
    ]}}}
  }
}
REGO

opa test policies/ -v

# Kyverno test with example manifests
kyverno test . \
  --test-case-selector "policy=disallow-privileged-containers"

# Check which policies blocked a recent admission
kubectl get events -n <ns> | grep "denied\|violated"
```

## Debugging Policy Denials

```bash
# See why a deployment was rejected
kubectl describe deploy <n> -n <ns>
# Look at Events section for: "admission webhook ... denied"

# Check active constraints
kubectl get constraints

# Check constraint violations (audit mode)
kubectl get k8srequirenonroot.constraints.gatekeeper.sh -o jsonpath='{.items[*].status.violations}'
```

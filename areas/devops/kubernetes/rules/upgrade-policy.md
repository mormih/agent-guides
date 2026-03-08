# Rule: Cluster Upgrade Policy

**Priority**: P1 — Skipping upgrade gates puts the cluster out of support and blocks security patches.

## Version Skew Policy

1. **Supported version range**
   - Production clusters must run within **2 minor versions** of the latest stable Kubernetes release.
   - Example: if latest is 1.31 → minimum allowed in prod is 1.29.
   - Clusters at N-3 or older are placed in mandatory upgrade sprint within 30 days.

2. **Control plane ↔ node version skew**
   - Nodes may run **at most 2 minor versions behind** the control plane.
   - kube-apiserver must be upgraded **before** kubelet on any node.
   - Never upgrade kubelet ahead of kube-apiserver.

3. **Component version alignment**
   - `kubectl` client: must be within ±1 minor of the server.
   - Helm: latest stable; chart API version must match cluster API version.
   - All Kubernetes-aware tooling (ArgoCD, Cert-Manager, Ingress controller) must list the target K8s version in their compatibility matrix before upgrade.

## Upgrade Cadence

4. **Patch updates**: applied within **30 days** of release on all clusters.
5. **Minor version upgrades**:
   - Dev/staging: upgrade within 30 days of release.
   - Production: upgrade within 60 days of staging validation.
   - One minor version at a time (1.29 → 1.30 → 1.31; never skip).

## Upgrade Safety Gates

6. **Pre-upgrade checklist (automated in upgrade workflow)**
   - All nodes in `Ready` state; no `NotReady` or `SchedulingDisabled`.
   - No active P0/P1 incidents.
   - Full etcd backup completed and verified within 1 hour of upgrade start.
   - PodDisruptionBudgets reviewed — no PDB that would block node drain.
   - Deprecated API usage audit: `kubectl get --show-labels` + `kubent` (kube-no-trouble) run.

7. **Control plane upgrade order**
   ```
   1. etcd backup
   2. Upgrade kube-apiserver (one node at a time for HA)
   3. Upgrade kube-controller-manager
   4. Upgrade kube-scheduler
   5. Validate control plane health
   6. Upgrade worker nodes (cordon → drain → upgrade → uncordon)
   ```

8. **Rollback plan required before every upgrade**
   - etcd snapshot = point-in-time rollback for control plane.
   - Node rollback = reprovision from last known good OS image.
   - Document rollback steps in upgrade PR before merge.

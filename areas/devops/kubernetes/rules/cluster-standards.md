# Rule: Cluster Standards

**Priority**: P0 — Non-compliant clusters are blocked from receiving production workloads.

## Control Plane

1. **High availability required for production**
   - Minimum 3 control plane nodes across 3 failure domains (separate physical hosts or AZs).
   - Single-node control plane allowed only in dev/lab; explicitly labelled `env=dev`.
   - etcd must run on dedicated nodes or co-located on control plane nodes — never on workers.

2. **Supported distributions**
   - Bare-metal: kubeadm, k3s (single-node / small clusters), RKE2, Talos Linux.
   - Cloud: EKS, GKE, AKS — managed control plane only; node pools follow these same rules.
   - Custom distros require architecture review sign-off before production use.

3. **Kubernetes version policy**
   - Production clusters must run a version within **2 minor releases** of the latest stable.
   - No cluster older than N-3 in any environment.
   - Patch updates applied within 30 days of release.

## Node Standards

4. **Operating system**
   - Preferred: Ubuntu 22.04 LTS or Rocky Linux 9 (immutable image preferred).
   - All nodes run the same OS and kernel version within a node group.
   - `unattended-upgrades` / `dnf-automatic` enabled for security patches only (not kernel).

5. **Container runtime**
   - **containerd** is the standard CRI. Docker Engine as CRI is forbidden.
   - `runc` is the default OCI runtime. `gVisor` / `kata-containers` for sensitive workloads.

6. **Node labelling (mandatory)**
   ```
   node-role.kubernetes.io/worker=
   topology.kubernetes.io/zone=<zone>
   topology.kubernetes.io/region=<region>
   node.kubernetes.io/instance-type=<type>
   environment=<prod|staging|dev>
   ```

## Networking

7. **CNI**
   - Cilium is the standard for new clusters (eBPF, NetworkPolicy, Hubble observability).
   - Calico accepted for existing clusters. Flannel only in dev/lab — no NetworkPolicy support.
   - Pod CIDR and Service CIDR must not overlap and must not conflict with datacenter routing.

8. **No NodePort in production**
   - Services exposed via `LoadBalancer` (MetalLB for bare-metal) or `Ingress` only.
   - `NodePort` allowed in dev/lab environments only.

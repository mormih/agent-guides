---
name: cluster-operations
type: skill
description: Day-2 cluster operations — node management, etcd backup/restore, certificate rotation, namespace lifecycle.
related-rules:
  - cluster-standards.md
  - upgrade-policy.md
allowed-tools: Read, Bash
---

# Skill: Cluster Operations

> **Expertise:** Safe day-2 operations on self-hosted Kubernetes clusters — node drain, etcd ops, cert rotation.

## When to load

When draining nodes for maintenance, rotating certificates, backing up etcd, or troubleshooting control plane issues.

## Node Lifecycle Operations

```bash
# --- CORDON (stop scheduling new pods, don't evict existing) ---
kubectl cordon <node-name>
# Use case: pre-drain notification, temporary maintenance hold

# --- DRAIN (evict all pods, mark unschedulable) ---
kubectl drain <node-name> \
  --ignore-daemonsets \          # DaemonSet pods can't be evicted
  --delete-emptydir-data \       # required for pods using emptyDir
  --grace-period=60 \            # give pods time to shut down cleanly
  --timeout=300s                 # abort if takes > 5 minutes
# After drain: node is unschedulable and empty (except daemonsets)

# --- UNCORDON (return to service) ---
kubectl uncordon <node-name>

# --- Verify node is empty before maintenance ---
kubectl get pods -A --field-selector=spec.nodeName=<node-name>
```

## etcd Backup (bare-metal / kubeadm)

```bash
# --- Take snapshot (run on a control plane node) ---
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-$(date +%Y%m%d-%H%M%S).db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \
  --key=/etc/kubernetes/pki/etcd/healthcheck-client.key

# --- Verify snapshot ---
ETCDCTL_API=3 etcdctl snapshot status /backup/etcd-latest.db --write-out=table

# --- Restore snapshot (disaster recovery — only when cluster is down) ---
ETCDCTL_API=3 etcdctl snapshot restore /backup/etcd-latest.db \
  --data-dir=/var/lib/etcd-restored \
  --initial-cluster=master-1=https://192.168.1.10:2380 \
  --initial-advertise-peer-urls=https://192.168.1.10:2380 \
  --name=master-1
# Then update etcd static pod manifest to point to new data-dir
```

## Certificate Rotation (kubeadm)

```bash
# --- Check certificate expiry ---
kubeadm certs check-expiration

# --- Renew all certificates (run on each control plane node) ---
kubeadm certs renew all

# --- Restart control plane components after renewal ---
# (kubeadm renews certs but doesn't restart static pods automatically)
for pod in kube-apiserver kube-controller-manager kube-scheduler; do
  kubectl -n kube-system delete pod -l component=$pod
done

# --- Update kubeconfig after cert renewal ---
cp /etc/kubernetes/admin.conf ~/.kube/config
```

## Namespace Lifecycle

```bash
# --- Create namespace with standard labels ---
kubectl create namespace my-team-prod
kubectl label namespace my-team-prod \
  environment=production \
  team=my-team \
  pod-security.kubernetes.io/enforce=restricted

# --- Apply default NetworkPolicy and LimitRange immediately ---
kubectl apply -f infra/namespaces/defaults/ -n my-team-prod

# --- Safe namespace deletion (check for resources first) ---
kubectl get all -n <namespace-to-delete>
kubectl delete namespace <name>   # blocks until all resources are gone
# If stuck in Terminating:
kubectl get namespace <name> -o json | \
  jq '.spec.finalizers = []' | \
  kubectl replace --raw "/api/v1/namespaces/<name>/finalize" -f -
```

## Control Plane Health Checks

```bash
# API server, scheduler, controller-manager
kubectl get componentstatuses       # deprecated in 1.19+ but still useful
kubectl get pods -n kube-system     # all system pods should be Running

# etcd cluster health
ETCDCTL_API=3 etcdctl endpoint health \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \
  --key=/etc/kubernetes/pki/etcd/healthcheck-client.key

# Node conditions
kubectl describe nodes | grep -A5 "Conditions:"
```

## Useful Aliases / One-liners

```bash
# All pods not Running
kubectl get pods -A --field-selector=status.phase!=Running,status.phase!=Succeeded

# Recent events by namespace
kubectl get events -n <ns> --sort-by='.lastTimestamp'

# Resource usage by namespace
kubectl top pods -A --sort-by=memory | head -20

# Find pods on a specific node
kubectl get pods -A -o wide | grep <node-name>
```

# Rule: Resource Governance

**Priority**: P1 — Missing resource contracts fail pre-deploy quality gate.

## Mandatory Resource Contracts

1. **Every container must specify requests AND limits**
   ```yaml
   resources:
     requests:
       cpu: 100m       # guaranteed CPU
       memory: 128Mi   # guaranteed memory
     limits:
       cpu: 500m       # burst cap
       memory: 512Mi   # OOM kill threshold
   ```
   - Containers without `resources` block are rejected by OPA/Gatekeeper policy.
   - `limits.cpu` may be omitted only if the workload is explicitly classified as CPU-unbounded with team-lead approval.

2. **QoS class targets**
   - `Guaranteed` (requests == limits): required for stateful workloads and Tier 1 services.
   - `Burstable` (requests < limits): acceptable for Tier 2 services.
   - `BestEffort` (no resources): forbidden in production; allowed in dev/lab only.

## Namespace LimitRange

3. **Every production namespace has a LimitRange**
   ```yaml
   apiVersion: v1
   kind: LimitRange
   metadata:
     name: default-limits
   spec:
     limits:
       - type: Container
         default:       { cpu: 200m, memory: 256Mi }    # applied when limits absent
         defaultRequest:{ cpu: 50m,  memory: 64Mi  }    # applied when requests absent
         max:           { cpu: 4,    memory: 4Gi   }    # hard ceiling per container
   ```

## Autoscaling

4. **HPA required for all Tier 1 stateless workloads**
   ```yaml
   spec:
     minReplicas: 2
     maxReplicas: 20
     metrics:
       - type: Resource
         resource:
           name: cpu
           target: { type: Utilization, averageUtilization: 70 }
   ```

5. **PodDisruptionBudget (PDB) required for Tier 1**
   ```yaml
   spec:
     minAvailable: 1        # or maxUnavailable: 1 — choose one
     selector:
       matchLabels:
         app: my-service
   ```
   - Tier 1 services must tolerate voluntary disruption (node drain) without outage.

## Topology & Scheduling

6. **TopologySpreadConstraints for Tier 1**
   ```yaml
   topologySpreadConstraints:
     - maxSkew: 1
       topologyKey: topology.kubernetes.io/zone
       whenUnsatisfiable: DoNotSchedule
       labelSelector:
         matchLabels: { app: my-service }
   ```
   - Prevents all replicas landing on one zone during rolling update.

7. **ResourceQuota on every production namespace**
   - Prevents resource exhaustion from runaway deployments.
   - Values set per team capacity plan; reviewed quarterly.

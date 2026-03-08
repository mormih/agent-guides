---
name: helm-charts
type: skill
description: Design, structure, and test production-grade Helm charts with multi-environment overlays.
related-rules:
  - workload-security.md
  - resource-governance.md
allowed-tools: Read, Write, Edit, Bash
---

# Skill: Helm Charts

> **Expertise:** Helm 3 chart structure, values hierarchy, multi-environment overlays, chart testing, ArgoCD integration.

## When to load

When creating a new Helm chart, reviewing an existing chart, setting up multi-env values, or integrating with ArgoCD.

## Chart Structure (Standard)

```
charts/my-service/
├── Chart.yaml
├── values.yaml            ← defaults (all envs inherit)
├── values-staging.yaml    ← staging overrides
├── values-prod.yaml       ← production overrides
├── templates/
│   ├── _helpers.tpl       ← named templates
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   ├── pdb.yaml
│   ├── serviceaccount.yaml
│   ├── networkpolicy.yaml
│   └── NOTES.txt
└── tests/
    └── test-connection.yaml
```

## values.yaml Conventions

```yaml
# Always provide a complete, renderable default set
replicaCount: 2

image:
  repository: registry.example.com/my-service
  tag: ""              # overridden by CI with digest
  digest: ""           # prefer digest over tag in prod
  pullPolicy: IfNotPresent

serviceAccount:
  create: true
  name: ""             # auto-generated from chart name if empty

resources:
  requests: { cpu: 100m, memory: 128Mi }
  limits:   { cpu: 500m, memory: 512Mi }

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

ingress:
  enabled: false
  className: nginx
  hosts: []
  tls: []

podDisruptionBudget:
  enabled: true
  minAvailable: 1
```

## _helpers.tpl Essentials

```yaml
{{/* Selector labels — must be stable across upgrades */}}
{{- define "app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/* Use digest when available, fall back to tag */}}
{{- define "app.image" -}}
{{- if .Values.image.digest -}}
{{ .Values.image.repository }}@{{ .Values.image.digest }}
{{- else -}}
{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}
{{- end -}}
{{- end }}
```

## Multi-Environment with ArgoCD

```yaml
# argocd/apps/my-service-prod.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-service-prod
  namespace: argocd
spec:
  project: production
  source:
    repoURL: https://git.example.com/infra/charts
    targetRevision: HEAD
    path: charts/my-service
    helm:
      valueFiles:
        - values.yaml
        - values-prod.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: my-service-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - ServerSideApply=true
```

## Chart Testing

```bash
# Lint (catches YAML errors + best practice violations)
helm lint charts/my-service/ -f charts/my-service/values-prod.yaml

# Render and inspect (no cluster needed)
helm template my-service charts/my-service/ \
  -f charts/my-service/values-prod.yaml \
  --debug | kubectl apply --dry-run=client -f -

# Integration test with chart-testing (ct)
ct lint --chart-dirs charts/ --config ct.yaml
ct install --chart-dirs charts/ --config ct.yaml   # deploys to kind cluster
```

## Anti-Patterns

| Anti-pattern | Fix |
|:---|:---|
| `image.tag: latest` | Use content digest `image.digest: sha256:...` |
| Hardcoded namespace in templates | Use `.Release.Namespace` |
| All config in one values.yaml | Split by environment; prod values in separate file |
| No `resources` block | Always set requests + limits in values defaults |
| `helm install` without `--atomic` in CI | Use `--atomic --timeout 5m` for automatic rollback |

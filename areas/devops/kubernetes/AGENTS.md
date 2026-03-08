# Kubernetes guidance index

Use this map to load Kubernetes-specific guidance for self-hosted and bare-metal cluster operations.

## Guidance chain

1. project `.agent/` baseline guidance (`AGENTS.md` + `.agent/*`)
2. kubernetes `rules/*`
3. kubernetes `skills/*/SKILL.md` (load only what the task needs)
4. kubernetes `workflows/*`

## Inherited from devops/general

- Infrastructure-as-Code immutability principle
- Git-based change management
- Incident response severity classification

## Kubernetes-specific overrides

```text
kubernetes/
├── rules/
│   ├── cluster-standards.md       ← node sizing, OS, CRI, CNI constraints
│   ├── workload-security.md       ← PSA, RBAC, network policy defaults
│   ├── resource-governance.md     ← requests/limits, LimitRange, QoS
│   └── upgrade-policy.md         ← version skew, upgrade cadence
├── skills/
│   ├── helm-charts/SKILL.md
│   ├── rbac-design/SKILL.md
│   ├── network-policies/SKILL.md
│   ├── resource-tuning/SKILL.md
│   ├── pod-troubleshooting/SKILL.md
│   └── cluster-operations/SKILL.md
├── workflows/
│   ├── onboard-service.md
│   ├── upgrade-cluster.md
│   ├── debug-workload.md
│   └── cluster-bootstrap.md
└── prompts/
    └── *.md
```

## Discovery patterns

- `rules/*.md`
- `skills/*/SKILL.md`
- `workflows/*.md`
- `prompts/*.md`

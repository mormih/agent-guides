# Observability guidance index

Monitoring, alerting, distributed tracing, and log aggregation for Kubernetes and bare-metal environments.

## Guidance chain

1. project `.agent/` baseline
2. observability `rules/*`
3. observability `skills/*/SKILL.md`
4. observability `workflows/*`

```text
observability/
├── rules/
│   ├── golden-signals.md
│   ├── alerting-standards.md
│   └── data-retention.md
├── skills/
│   ├── prometheus-alertmanager/SKILL.md
│   ├── grafana-dashboards/SKILL.md
│   ├── distributed-tracing/SKILL.md
│   ├── log-aggregation/SKILL.md
│   └── slo-implementation/SKILL.md
├── workflows/
│   ├── onboard-service-monitoring.md
│   ├── alert-investigation.md
│   └── observability-stack-setup.md
└── prompts/
    └── *.md
```

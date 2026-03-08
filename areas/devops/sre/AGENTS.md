# SRE guidance index

Reliability engineering — SLO/SLI design, error budgets, chaos engineering, capacity planning, incident command.

## Guidance chain

1. project `.agent/` baseline
2. sre `rules/*`
3. sre `skills/*/SKILL.md`
4. sre `workflows/*`

```text
sre/
├── rules/
│   ├── slo-policy.md
│   ├── error-budget-policy.md
│   └── on-call-standards.md
├── skills/
│   ├── slo-sli-design/SKILL.md
│   ├── chaos-engineering/SKILL.md
│   ├── capacity-planning/SKILL.md
│   ├── incident-command/SKILL.md
│   └── postmortem-analysis/SKILL.md
├── workflows/
│   ├── incident-response.md
│   ├── postmortem.md
│   └── slo-review.md
└── prompts/
    └── *.md
```

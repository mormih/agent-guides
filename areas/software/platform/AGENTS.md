# Platform guidance index

Use this file as a lightweight map of platform guidance artifacts.
Load only files relevant to the active task.

## Guidance tree

```text
platform/
└── .agent/
    ├── rules/
        ├── cost-governance.md
        ├── immutability.md
        ├── reliability.md
        └── security-posture.md
    ├── skills/
        ├── ci-cd-pipelines/
            └── SKILL.md
        ├── incident-response/
            └── SKILL.md
        ├── k8s-manifests/
            └── SKILL.md
        ├── networking/
            └── SKILL.md
        ├── observability-setup/
            └── SKILL.md
        ├── secrets-management/
            └── SKILL.md
        └── terraform-patterns/
            └── SKILL.md
    ├── workflows/
        ├── cost-audit.md
        ├── deploy-production.md
        ├── drift-check.md
        ├── incident-response.md
        └── provision-env.md
    └── prompts/
        ├── cost-audit.md
        ├── deploy-production.md
        ├── drift-check.md
        ├── incident-response.md
        └── provision-env.md
```

## Discovery patterns

- `.agent/rules/*.md`
- `.agent/skills/*/SKILL.md`
- `.agent/workflows/*.md`
- `.agent/prompts/*.md`

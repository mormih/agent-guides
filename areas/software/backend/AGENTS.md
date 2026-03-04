# Backend guidance index

Use this file as a lightweight map of backend guidance artifacts.
Load only files relevant to the active task.

## Guidance tree

```text
backend/
└── .agent/
    ├── rules/
        ├── architecture.md
        ├── data_access.md
        ├── security.md
        └── testing.md
    ├── skills/
        ├── api-design/
            └── SKILL.md
        ├── async-processing/
            └── SKILL.md
        ├── database-modeling/
            └── SKILL.md
        ├── observability/
            └── SKILL.md
        └── troubleshooting/
            └── SKILL.md
    ├── workflows/
        ├── add-migration.md
        ├── create-endpoint.md
        ├── debug-issue.md
        ├── develop-epic.md
        ├── develop-feature.md
        ├── refactor-module.md
        └── test-feature.md
    └── prompts/
        ├── add-migration.md
        ├── code-review.md
        ├── create-endpoint.md
        ├── debug-issue.md
        ├── develop-epic.md
        ├── develop-feature.md
        ├── refactor-module.md
        ├── system-prompt.md
        └── test-feature.md
```

## Discovery patterns

- `.agent/rules/*.md`
- `.agent/skills/*/SKILL.md`
- `.agent/workflows/*.md`
- `.agent/prompts/*.md`

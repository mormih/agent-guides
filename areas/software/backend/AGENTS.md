# Backend guidance index

Use this map to load backend-specific guidance after general baseline guidance.

## Guidance chain

1. `areas/software/general/AGENTS.md`
2. backend `rules/*`
3. backend `skills/*/SKILL.md`
4. backend `workflows/*`

## Inherited from general

- SDLC methodology and role responsibilities
- Git/CI/lint/format and code style baselines
- General development and code review workflows

## Backend-specific overrides

```text
backend/
├── rules/
│   ├── architecture.md
│   ├── data_access.md
│   ├── security.md
│   └── testing.md
├── skills/
│   ├── api-design/SKILL.md
│   ├── async-processing/SKILL.md
│   ├── database-modeling/SKILL.md
│   ├── observability/SKILL.md
│   └── troubleshooting/SKILL.md
├── workflows/
│   ├── add-migration.md
│   ├── create-endpoint.md
│   ├── debug-issue.md
│   ├── develop-epic.md
│   ├── develop-feature.md
│   ├── refactor-module.md
│   └── test-feature.md
└── prompts/
    └── *.md
```

## Discovery patterns

- `rules/*.md`
- `skills/*/SKILL.md`
- `workflows/*.md`
- `prompts/*.md`

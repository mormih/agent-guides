# Frontend guidance index

Use this map to load frontend-specific guidance after general baseline guidance.

## Guidance chain

1. project `.agent/` baseline guidance (`AGENTS.md` + `.agent/*`)
2. frontend `rules/*`
3. frontend `skills/*/SKILL.md`
4. frontend `workflows/*`

## Inherited from general

- SDLC roles and quality gates
- Git workflow, CI, linting/formatting, code style
- Shared delivery and code review workflows

## Frontend-specific overrides

```text
frontend/
├── rules/
│   ├── accessibility.md
│   ├── architecture.md
│   ├── performance.md
│   └── quality.md
├── skills/
│   ├── a11y-audit/SKILL.md
│   ├── api-integration/SKILL.md
│   ├── component-design/SKILL.md
│   ├── css-architecture/SKILL.md
│   ├── error-handling/SKILL.md
│   ├── performance-tuning/SKILL.md
│   ├── state-management/SKILL.md
│   └── testing-patterns/SKILL.md
├── workflows/
│   ├── a11y-fix.md
│   ├── bundle-analyze.md
│   ├── release-prep.md
│   ├── scaffold-component.md
│   └── visual-regression.md
└── prompts/
    └── *.md
```

## Discovery patterns

- `rules/*.md`
- `skills/*/SKILL.md`
- `workflows/*.md`
- `prompts/*.md`

# QA guidance index

Use this map to load QA-specific guidance after general baseline guidance.

## Guidance chain

1. `areas/software/general/AGENTS.md`
2. qa `rules/*`
3. qa `skills/*/SKILL.md`
4. qa `workflows/*`

## Inherited from general

- SDLC role responsibilities and handoffs
- Git/CI/lint/format quality baseline
- Shared development and review workflows

## QA-specific overrides

```text
qa/
├── rules/
│   ├── flakiness-policy.md
│   ├── quality-gates.md
│   ├── test-data.md
│   └── test-strategy.md
├── skills/
│   ├── accessibility-testing/SKILL.md
│   ├── api-testing/SKILL.md
│   ├── e2e-patterns/SKILL.md
│   ├── performance-testing/SKILL.md
│   ├── test-data-management/SKILL.md
│   └── test-pyramid/SKILL.md
├── workflows/
│   ├── flakiness-investigation.md
│   ├── performance-audit.md
│   ├── regression-suite.md
│   ├── smoke-test.md
│   └── test-coverage-report.md
└── prompts/
    └── *.md
```

## Discovery patterns

- `rules/*.md`
- `skills/*/SKILL.md`
- `workflows/*.md`
- `prompts/*.md`

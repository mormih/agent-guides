# QA guidance index

Use this file as a lightweight map of qa guidance artifacts.
Load only files relevant to the active task.

## Guidance tree

```text
qa/
└── .agent/
    ├── rules/
        ├── flakiness-policy.md
        ├── quality-gates.md
        ├── test-data.md
        └── test-strategy.md
    ├── skills/
        ├── accessibility-testing/
            └── SKILL.md
        ├── api-testing/
            └── SKILL.md
        ├── e2e-patterns/
            └── SKILL.md
        ├── performance-testing/
            └── SKILL.md
        ├── test-data-management/
            └── SKILL.md
        └── test-pyramid/
            └── SKILL.md
    ├── workflows/
        ├── flakiness-investigation.md
        ├── performance-audit.md
        ├── regression-suite.md
        ├── smoke-test.md
        └── test-coverage-report.md
    └── prompts/
        ├── flakiness-investigation.md
        ├── performance-audit.md
        ├── regression-suite.md
        ├── smoke-test.md
        └── test-coverage-report.md
```

## Discovery patterns

- `.agent/rules/*.md`
- `.agent/skills/*/SKILL.md`
- `.agent/workflows/*.md`
- `.agent/prompts/*.md`

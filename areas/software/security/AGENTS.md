# Security guidance index

Use this file as a lightweight map of security guidance artifacts.
Load only files relevant to the active task.

## Guidance tree

```text
security/
└── .agent/
    ├── rules/
        ├── compliance-baseline.md
        ├── dependency-policy.md
        ├── secrets-policy.md
        └── secure-coding.md
    ├── skills/
        ├── auth-patterns/
            └── SKILL.md
        ├── crypto-standards/
            └── SKILL.md
        ├── dependency-audit/
            └── SKILL.md
        ├── sast-dast-interpretation/
            └── SKILL.md
        ├── security-headers/
            └── SKILL.md
        └── threat-modeling/
            └── SKILL.md
    ├── workflows/
        ├── compliance-report.md
        ├── pen-test-sim.md
        ├── secret-rotation.md
        ├── security-scan.md
        └── threat-model-review.md
    └── prompts/
        ├── compliance-report.md
        ├── pen-test-sim.md
        ├── secret-rotation.md
        ├── security-scan.md
        └── threat-model-review.md
```

## Discovery patterns

- `.agent/rules/*.md`
- `.agent/skills/*/SKILL.md`
- `.agent/workflows/*.md`
- `.agent/prompts/*.md`

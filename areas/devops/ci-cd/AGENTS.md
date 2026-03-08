# CI/CD guidance index

Pipeline design, build optimization, deployment gates, and supply chain security.

## Guidance chain

1. project `.agent/` baseline
2. ci-cd `rules/*`
3. ci-cd `skills/*/SKILL.md`
4. ci-cd `workflows/*`

```text
ci-cd/
├── rules/
│   ├── pipeline-standards.md
│   ├── quality-gates.md
│   └── supply-chain-security.md
├── skills/
│   ├── github-actions-patterns/SKILL.md
│   ├── gitlab-ci-patterns/SKILL.md
│   ├── build-optimization/SKILL.md
│   └── pipeline-security/SKILL.md
├── workflows/
│   ├── onboard-repo.md
│   ├── release-pipeline.md
│   └── pipeline-debug.md
└── prompts/
    └── *.md
```

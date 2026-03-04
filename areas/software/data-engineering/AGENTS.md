# Data Engineering guidance index

Use this file as a lightweight map of data-engineering guidance artifacts.
Load only files relevant to the active task.

## Guidance tree

```text
data-engineering/
└── .agent/
    ├── rules/
        ├── data-governance.md
        ├── pii-handling.md
        ├── pipeline-integrity.md
        └── schema-management.md
    ├── skills/
        ├── data-modeling/
            └── SKILL.md
        ├── dbt-patterns/
            └── SKILL.md
        ├── lineage-governance/
            └── SKILL.md
        ├── orchestration/
            └── SKILL.md
        ├── quality-checks/
            └── SKILL.md
        ├── sql-optimization/
            └── SKILL.md
        └── streaming-patterns/
            └── SKILL.md
    ├── workflows/
        ├── backfill-data.md
        ├── data-quality-incident.md
        ├── lineage-trace.md
        ├── new-model.md
        └── schema-migration.md
    └── prompts/
        ├── backfill-data.md
        ├── data-quality-incident.md
        ├── lineage-trace.md
        ├── new-model.md
        └── schema-migration.md
```

## Discovery patterns

- `.agent/rules/*.md`
- `.agent/skills/*/SKILL.md`
- `.agent/workflows/*.md`
- `.agent/prompts/*.md`

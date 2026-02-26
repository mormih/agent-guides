# .agent-os Package Index

> Taxonomy version: 1.0.0 | Generated: 2026-02-17

## Domain Packages

| File                           | Domain                                   | Rules | Skills | Workflows |
|:-------------------------------|:-----------------------------------------|:------|:-------|:----------|
| `agent-os-frontend/AGENTS.md`         | Frontend Engineering (React/TS/Tailwind) | 4     | 8      | 5         |
| `agent-os-platform/AGENTS.md`         | Platform Engineering / DevOps / IaC      | 4     | 7      | 5         |
| `agent-os-security/AGENTS.md`         | Security / DevSecOps (horizontal)        | 4     | 6      | 5         |
| `agent-os-data-engineering/AGENTS.md` | Data Engineering (dbt/Airflow/Kafka)     | 4     | 7      | 5         |
| `agent-os-mlops/AGENTS.md`            | MLOps / ML Engineering                   | 4     | 6      | 5         |
| `agent-os-qa/AGENTS.md`               | QA & Test Automation                     | 4     | 6      | 5         |
| `agent-os-mobile/AGENTS.md`           | Mobile Development (React Native/Expo)   | 4     | 6      | 5         |

## Reference

| File                   | Description                              |
|:-----------------------|:-----------------------------------------|
| `agent-os-taxonomy/AGENTS.md` | Full taxonomy overview with ROI analysis |
| `INDEX.md`             | This file                                |

## Dependency Graph

```
@agent-os/global (implicit)
└── @agent-os/security          ← horizontal, imported by all
    ├── @agent-os/frontend
    ├── @agent-os/platform
    ├── @agent-os/backend        (see taxonomy for Backend SDLC)
    ├── @agent-os/data-engineering
    ├── @agent-os/mlops          ← also imports data-engineering
    ├── @agent-os/mobile         ← also imports frontend patterns
    └── @agent-os/qa             ← horizontal, imported by all
```

## Hub-and-Spoke Hierarchy

```
Level 1 — Global / Corporate ("Constitution")
  ~/.agent-os/global/          mandatory, non-overridable

Level 2 — Domain / Stack ("Distro")
  @agent-os/<domain>           defaults, configurable

Level 3 — Project ("Local Config")
  ./.agent-os/                 overrides, project-specific workflows
```

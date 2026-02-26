# `agent-config` Domain Package: <DOMAIN_NAME>

> **Version**: 0.1.0-template
> **Area**: <AREA_NAME>
> **Scope**: <DOMAIN_SCOPE>

---

## Package Structure

```text
agent-config/
└── <domain>/
    ├── rules/
    │   ├── <rule-1>.md
    │   ├── <rule-2>.md
    │   └── <rule-3>.md
    ├── skills/
    │   ├── <skill-1>.md
    │   ├── <skill-2>.md
    │   └── <skill-3>.md
    └── workflows/
        ├── <workflow-1>.md
        ├── <workflow-2>.md
        └── <workflow-3>.md
```

---

## RULES (Kernel)

Rules are always active and define hard constraints.

- `<rule-1>`: <short rule summary>
- `<rule-2>`: <short rule summary>
- `<rule-3>`: <short rule summary>

## SKILLS (Libraries)

Skills are loaded on demand depending on task semantics.

- `<skill-1>`: <when to load>
- `<skill-2>`: <when to load>
- `<skill-3>`: <when to load>

## WORKFLOWS (Execution)

Choose one primary workflow before implementation.

- `<workflow-1>`: <usage>
- `<workflow-2>`: <usage>
- `<workflow-3>`: <usage>

## Execution Contract

Before work starts, the agent must return:
1. selected workflow,
2. active rules,
3. loaded skills,
4. plan + risks.

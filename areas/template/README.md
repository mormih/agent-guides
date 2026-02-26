# Template Area Blueprint

This directory is a universal template for creating a new domain area based on the `areas/software/*` pattern.

Goal: quickly create new areas (for example, `marketing`, `business`, `finance`) in a unified format:

- `modules/<domain>/...` — detailed artifacts (rules / skills / workflows / prompts),
- `flat/<domain>/...` — a compact “single-file + prompts” version for quick start,
- compatibility with installation via `agentos-install.sh --source ...`.

## Template structure

```text
areas/template/
├── README.md
├── modules/
│   └── domain/
│       ├── README.md
│       ├── rules/
│       │   └── core-rule-template.md
│       ├── skills/
│       │   └── skill-template.md
│       ├── workflows/
│       │   └── workflow-template.md
│       └── prompts/
│           ├── system-prompt-template.md
│           └── task-prompt-template.md
└── flat/
    └── domain/
        ├── AGENTS.md
        └── PROMPTS.md
```

## How to use

1. Copy `areas/template` into a new area, for example `areas/marketing`.
2. Rename `domain` to the required subdomain (for example, `brand`, `growth`, `analytics`).
3. Replace all placeholders:
   - `<AREA_NAME>` — area name,
   - `<DOMAIN_NAME>` — domain name,
   - `<RULE_*>`, `<SKILL_*>`, `<WORKFLOW_*>`, `<TASK_*>` — concrete entities.
4. Fill artifact content with domain expertise.
5. To install into a project, use:
   - modular format: `./agentos-install.sh install --source ./areas/<AREA_NAME>/modules/<DOMAIN_NAME> --target <project> --format all`
   - flat format: `./agentos-install.sh install --source ./areas/<AREA_NAME>/flat/<DOMAIN_NAME> --target <project> --format codex`

## Minimum quality gate for a new area

- At least 3 `rules` (quality/safety invariants).
- At least 3 `skills` (targeted competencies).
- At least 3 `workflows` (repeatable processes).
- At least 3 `prompts` (initialization + task-specific templates).
- `flat/<domain>/AGENTS.md` is aligned with `modules/<domain>/*`.

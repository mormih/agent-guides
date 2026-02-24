# Universal Agent Template Migration Plan

## 1) Current Repository Shape (What exists now)

The repository already follows a strong domain/module split and contains reusable markdown content:

- `agentos/modules/<specialization>/{rules,skills,workflows,prompts}`
- `agentbase/{rules,skills,workflows,prompts}`
- `agentos-install.sh` installer that currently copies package content into:
  - `.agent/...`
  - `.kilocode/...`

This is a good foundation for moving to a universal multi-agent output model.

## 2) Problem to Solve

Different agent coding tools expect different artifact layouts and control files:

- **Kilo Code**: `.kilocode/rules`, `.kilocode/skills`, `.kilocode/workflows`
- **Antigravity**: `.agent/rules`, `.agent/skills`, `.agent/workflows`
- **Claude Code / Codex / OpenCode**: often use `AGENTS.md` (plus optional tool-specific folders)

Today, content is copied as-is for directory-based tools. The next step is to support tools that need **compiled single-file instructions** (for example `AGENTS.md`) without losing modularity.

## 3) Target Architecture (Atomic content + renderers)

Adopt a 2-layer model:

1. **Atomic source blocks** (canonical content)
2. **Target renderers** (tool adapters)

### 3.1 Atomic source blocks

For each specialization (`frontend`, `backend`, etc.), split content into small independent markdown blocks with metadata.

Proposed canonical source tree:

```text
agentos/
  specializations/
    backend/
      rules/
        R-001-project-structure.md
        R-002-code-quality.md
      skills/
        api-design/
          SKILL.md
          assets/... (optional)
      workflows/
        W-001-feature-delivery.md
      prompts/ (optional)
```

Each atomic block should include front matter:

```yaml
id: R-002
kind: rule            # rule | workflow | skill | prompt
title: Code Quality Gates
specialization: backend
applies_to: [all]
targets: [kilocode, antigravity, agents_md]
priority: 20
language: en
inputs: []
outputs: []
depends_on: [R-001]
```

This enables deterministic assembly and target-specific filtering.

### 3.2 Renderer layer

Create renderers that transform atomic blocks into agent-specific artifacts:

- `renderer_kilocode` → `.kilocode/rules/*.md`, `.kilocode/skills/...`, `.kilocode/workflows/*.md`
- `renderer_antigravity` → `.agent/rules/*.md`, `.agent/skills/...`, `.agent/workflows/*.md`
- `renderer_agents_md` → assembled `AGENTS.md` (for Claude/Codex/OpenCode style workflows)

## 4) AGENTS.md Assembly Strategy

`AGENTS.md` should be generated from selected blocks in a stable section order:

1. Identity and specialization purpose
2. Non-negotiable rules (hard boundaries)
3. Workflow catalog and invocation guidance
4. Skill catalog and when to use each skill
5. Project conventions and output format constraints

Generation rules:

- Sort by `priority`, then `id`
- Resolve `depends_on` and inline required blocks
- Keep only `language: en`
- Preserve source traceability (`Source: R-002` comments)

## 5) Migration Phases

### Phase 0 — Inventory and language normalization

- Inventory all markdown blocks in `agentos/modules/*` and `agentbase/*`
- Mark Russian content and migrate to English
- Add missing IDs and metadata front matter

### Phase 1 — Canonicalization

- Move reusable content to `agentos/specializations/<name>` canonical tree
- Keep old paths as compatibility inputs during transition
- Define naming convention: `R-###`, `W-###`, `S-<slug>`

### Phase 2 — Build pipeline

- Add `agentos-build.sh` (or Python tool) to:
  - validate metadata
  - detect duplicate IDs
  - generate target outputs
- Add `--specialization <name>` and `--target <tool>` flags

### Phase 3 — Installer upgrade

Extend `agentos-install.sh` behavior:

- Install pre-rendered structure for directory-based targets
- Install generated `AGENTS.md` for tools that require single-file instructions
- Keep `--format both` backwards compatible for `.agent + .kilocode`

### Phase 4 — Validation

- Add snapshot tests for generated artifacts
- Add markdown lint and link checks
- Add policy checks: every block must have `language: en`

## 6) Suggested Target Map

| Target tool | Output mode | Required artifacts |
|---|---|---|
| Kilo Code | Directory | `.kilocode/rules`, `.kilocode/skills`, `.kilocode/workflows` |
| Antigravity | Directory | `.agent/rules`, `.agent/skills`, `.agent/workflows` |
| Claude Code | Single-file (+ optional dir) | `AGENTS.md` |
| Codex | Single-file (+ optional dir) | `AGENTS.md` |
| OpenCode | Single-file (+ optional dir) | `AGENTS.md` |

## 7) Practical Authoring Rules

- Keep every atomic file focused on one concern only
- Keep cross-references explicit via `depends_on`
- Keep examples separate from normative rules where possible
- Author all content in English
- Avoid tool-specific wording in canonical files; place it in renderer templates

## 8) Minimal Next Sprint (Concrete)

1. Pick one specialization (`backend`) as pilot.
2. Convert 5-10 rules into metadata-based atomic format.
3. Implement `AGENTS.md` renderer for pilot.
4. Compare generated outputs for `.agent`, `.kilocode`, `AGENTS.md`.
5. Freeze conventions and roll out to other specializations.

This keeps risk low while proving the universal architecture.

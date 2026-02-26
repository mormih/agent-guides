# <AREA_NAME> / <DOMAIN_NAME> Module

This module defines deep agent specialization for the `<DOMAIN_NAME>` domain in the `<AREA_NAME>` area.

## Contents

- `rules/` — mandatory invariants (always active).
- `skills/` — on-demand competencies (task-dependent).
- `workflows/` — step-by-step execution algorithms.
- `prompts/` — ready-made query templates and system context.

## Authoring principle

1. First, define invariants in `rules/`.
2. Then describe repeatable scenarios in `workflows/`.
3. After that, add skills for narrow tasks.
4. Finally, assemble prompts that reference rules/skills/workflows.

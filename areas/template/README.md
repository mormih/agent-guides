# Template Area Blueprint

Template for creating new areas in the unified `.agent/{rules,skills,workflows,prompts}/` format.

## Target structure

```text
.agent/
  <specialization>/
    AGENTS.md
    rules/
    skills/
    workflows/
    prompts/
```

## How to use

1. Create the area directory under `.agent/`.
2. Add one or more specializations (`backend`, `frontend`, `domain`, ...).
3. Define critical rules first, then add reusable skills.
4. Add workflows and prompts for frequent operational tasks.

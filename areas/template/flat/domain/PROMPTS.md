# PROMPTS: <DOMAIN_NAME>

Use these prompts with `<domain>/AGENTS.md` from the same directory.

## 1) Initialize domain agent behavior

```text
Read `<domain>/AGENTS.md` and apply all listed rules as hard constraints.
Before implementation, return:
1) selected workflow,
2) loaded skills,
3) implementation plan,
4) risk list.
```

## 2) Execute core domain task

```text
Using `<domain>/AGENTS.md`, implement: <task description>.
Mandatory pre-execution output:
- approach,
- rule impact,
- validation plan,
- risk controls.
After work: run checks and report exact commands and results.
```

## 3) Analysis / incident mode

```text
Using `<domain>/AGENTS.md`, analyze issue: <issue summary>.
Return hypotheses, validation steps, minimal fix/change,
and rollback/mitigation plan.
```

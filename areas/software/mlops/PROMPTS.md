# PROMPTS: mlops

Use these prompts with `AGENTS.md` from the same directory.

## 1) Initialize agent behavior

```text
Read `mlops/AGENTS.md` and adopt its rules, skills loading strategy, and workflows as hard constraints.
List the active rules and the selected workflow before implementation.
```

## 2) Implement a feature

```text
Using `mlops/AGENTS.md`, implement: <feature description>.
Before coding: provide architecture notes, risk list, and test plan.
After coding: run checks and report exact commands and results.
```

## 3) Incident / debug mode

```text
Using `mlops/AGENTS.md`, run incident triage for: <incident summary>.
Return root cause hypotheses, validation steps, fix plan, and rollback plan.
```

## 4) Release readiness

```text
Using `mlops/AGENTS.md`, prepare release checklist for: <release scope>.
Include quality gates, security gates, performance gates, and deployment validation.
```

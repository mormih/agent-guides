---
description: Create new feature with agent team collaboration
agent: product-owner
---

# /feature - Create New Feature

This workflow manages creating a new feature from requirements to final implementation.

## Workflow (Iterative)

```
@pm (gather info) → [@team-lead + @designer] (plan) → @pm (present to user) → 
[@developer + @qa] (implement & test) → @team-lead (review) → 
[@developer + @qa] (fix) → ... (loop) → Report
```

## Stages

1. **@pm**: Gathers requirements, creates empty docs structure in `docs/<feature_name>/`
2. **@team-lead + @designer**: Study feature, review code, create plan with diagrams
3. **@pm**: Presents plan to user, waits for approval
4. **@developer + @qa**: Implement code, build APK, test on Android emulator
5. **@team-lead**: Code review, run analysis, provide feedback
6. **Loop**: Repeat stages 4-5 until feature is complete
7. **Report**: Final report to user

## Agents

Primary: **@product-owner** (orchestrates workflow)
Subagents: @pm, @team-lead, @designer, @developer, @qa

See AGENTS.md for full workflow details and quality standards.

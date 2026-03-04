---
name: development-cycle-workflow
type: workflow
description: Standard workflow for implementing any development task from ticket to merge.
inputs:
  - task_or_issue_description
  - existing_codebase
outputs:
  - implemented_changes
  - passing_tests
  - merged_pull_request
related-rules:
  - git-workflow-guide.md
  - sdlc-methodology-guide.md
  - code-style-guide.md
  - lint-format-guide.md
uses-skills:
  - general-dev-tools
---

## Goal

Deliver a task from requirements to merged code in a consistent, reproducible way.

## Workflow (Iterative)

```
Understand → Branch → Implement → Test → Lint → PR → Review → Merge
```

## Phase 1 — Understand

1. Read the task/issue completely. Ask clarifying questions before starting.
2. Identify acceptance criteria — if missing, define them and get confirmation.
3. Identify impacted areas of the codebase.
4. Estimate scope: if larger than 1 day of work, break into sub-tasks.

## Phase 2 — Branch

1. Ensure local `main` is up to date: `git pull origin main`.
2. Create feature branch:
   ```bash
   git checkout -b feature/<task-id>-short-description
   ```

## Phase 3 — Implement

1. Make changes in small, logical commits as you go.
2. Follow code style and architecture rules of the project.
3. Run `make fmt` after each logical change to keep code clean.
4. Do not mix unrelated changes in the same branch.

## Phase 4 — Verify

1. Run `make test` — all tests must pass.
2. Run `make lint` — zero errors.
3. Run `make fmt` — no formatting diffs.
4. If new behavior: add or update tests first (TDD or test-alongside).
5. Manually verify the feature works as described in acceptance criteria.

## Phase 5 — Pull Request

1. Push branch and open PR/MR:
   - Title: `[TASK-ID] Short description of change`
   - Body: what changed, why, how to test, screenshots if UI.
2. Link the PR to the issue/task.
3. Assign a reviewer.
4. Ensure CI passes before requesting review.

## Phase 6 — Review & Merge

1. Address all review comments promptly.
2. Push fixes as new commits (don't force-push during review).
3. Once approved, squash or rebase and merge.
4. Delete the feature branch.
5. Verify the change works in staging/preview environment.

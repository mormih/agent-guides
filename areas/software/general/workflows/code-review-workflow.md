---
name: code-review-workflow
type: workflow
description: Structured workflow for conducting thorough and constructive code reviews.
inputs:
  - pull_request_or_merge_request
  - codebase_context
outputs:
  - review_comments
  - approval_or_change_requests
related-rules:
  - code-style-guide.md
  - git-workflow-guide.md
  - sdlc-methodology-guide.md
uses-skills:
  - general-dev-tools
---

## Goal

Ensure code quality, knowledge sharing, and adherence to standards through structured peer review.

## Phase 1 — Context Understanding

1. Read the PR/MR description and linked issue/task to understand the intent.
2. Check the scope: is the change focused or does it mix multiple concerns?
3. Review the diff size — if >400 lines of logic changes, request splitting the PR.

## Phase 2 — Automated Checks

Verify before manual review:
- [ ] CI pipeline passes (lint, tests, build).
- [ ] No merge conflicts.
- [ ] Branch is up to date with target branch.

## Phase 3 — Code Review Checklist

**Correctness:**
- [ ] Does the code do what the ticket/issue describes?
- [ ] Are edge cases handled?
- [ ] Is error handling explicit and appropriate?

**Design & Architecture:**
- [ ] Does the change follow existing patterns in the codebase?
- [ ] Is there unnecessary complexity or over-engineering?
- [ ] Are abstractions at the right level?

**Code Quality:**
- [ ] Are names clear and intention-revealing?
- [ ] Is there duplicated logic that could be extracted?
- [ ] Are there magic numbers or strings that should be constants?

**Tests:**
- [ ] Are new behaviors covered by tests?
- [ ] Do tests assert meaningful behavior, not implementation details?
- [ ] Are edge cases tested?

**Security:**
- [ ] No secrets or credentials committed.
- [ ] User input is validated/sanitized.
- [ ] Permissions/access control respected.

## Phase 4 — Feedback

- Use constructive language: "Consider...", "What if we...", "I think...".
- Distinguish blocking issues (must fix) from suggestions (nice to have) using labels or prefixes.
- Approve only when all blocking issues are resolved.
- Leave at least one positive comment acknowledging good work.

## Phase 5 — Merge

1. Author addresses all blocking comments.
2. Reviewer re-checks and approves.
3. Squash or rebase as per project convention.
4. Merge — delete feature branch after merge.

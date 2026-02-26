# Workflow: `/visual-regression`

**Trigger**: `/visual-regression [--baseline | --compare | --approve]`

**Purpose**: Detect unintended visual changes to UI components between branches.

## Steps

```
Step 1: IDENTIFY scope
  - Determine which Storybook stories are affected by changed files (git diff)
  - Limit to changed components only on small PRs

Step 2: RUN screenshot capture
  - Build Storybook: storybook build
  - Run Playwright against built Storybook
  - Capture at: mobile (375px), tablet (768px), desktop (1440px)

Step 3: COMPARE to baseline
  - Load baseline screenshots from /tests/visual-snapshots/
  - Compute pixel diff using pixelmatch
  - Threshold: > 0.1% pixel change = DIFF detected

Step 4: REPORT results
  - List all components with diffs (with diff percentage)
  - Generate HTML report with side-by-side comparisons
  - Annotate PR comment with summary and link to report

Step 5: AWAIT approval
  - /visual-regression --approve → update baseline snapshots
  - No diffs → mark check as passed automatically
```

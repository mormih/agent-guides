# Workflow: `/release-prep`

**Trigger**: `/release-prep [version]` (e.g., `/release-prep 2.4.0`)

**Purpose**: Prepare the frontend for a production release — validation gates, changelog generation.

## Steps

```
Step 1: VALIDATE quality gates
  - TypeScript: tsc --noEmit (zero errors required)
  - Lint: eslint src/ (zero errors)
  - Tests: vitest run (100% pass rate required)
  - Coverage: confirm baseline not regressed

Step 2: CHECK performance budget
  - Run /bundle-analyze --full
  - Verify Core Web Vitals pass in Lighthouse CI
  - Flag budget violations as release blockers

Step 3: RUN accessibility sweep
  - Execute /a11y-fix --route for all primary routes
  - Fail release if any WCAG Level A violations exist

Step 4: GENERATE changelog
  - Parse git log from last release tag to HEAD
  - Categorize: feat / fix / perf / breaking
  - Generate CHANGELOG.md entry (Keep a Changelog format)
  - Bump version in package.json

Step 5: CREATE release artifact
  - Tag commit: git tag -a v[version] -m "Release [version]"
  - Generate release notes summary for Slack/Jira
  - Output: Go/No-Go decision with all gate results
```

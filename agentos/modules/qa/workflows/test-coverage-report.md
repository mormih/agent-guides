# Workflow: `/test-coverage-report`

**Trigger**: `/test-coverage-report [--compare main] [--threshold 80]`

## Steps

```
Step 1: RUN coverage
  - Execute full test suite with instrumentation
  - Collect: line, branch, function, statement coverage

Step 2: COMPARE branches (if --compare)
  - Download coverage from target branch
  - Compute delta: which files increased/decreased?

Step 3: IDENTIFY critical gaps
  Priority order:
  - Revenue-critical paths (checkout, payment, auth) → HIGH
  - Error handling branches → MEDIUM
  - Utility functions → LOW

Step 4: GENERATE recommendations
  For top 5 coverage gaps:
  - Describe what scenario is untested
  - Generate a test skeleton for the gap

Step 5: REPORT
  - Overall coverage: current vs. baseline vs. threshold
  - Coverage by module/feature area
  - Top 10 uncovered critical functions with test suggestions
  - PR comment with summary table and trend
```

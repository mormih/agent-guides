# Workflow: `/regression-suite`

**Trigger**: `/regression-suite [--env staging|production] [--scope full|critical|smoke]`

## Steps

```
Step 1: SELECT scope
  smoke:    ~20 tests, top 5 critical paths (< 5 min)
  critical: ~100 tests, all revenue/auth/data flows (< 20 min)
  full:     All E2E tests (< 60 min, nightly or pre-release)

Step 2: PREPARE environment
  - Verify target environment health
  - Reset test data to known state
  - Set test flags (disable rate limiting, use test payment methods)

Step 3: EXECUTE suite
  - Run Playwright in parallel (max workers = CPU × 2)
  - Record video on failure; screenshots on failure automatically

Step 4: ANALYZE results
  - Passed / failed / skipped / flaky (passed on retry)
  - For failures: classify new failure vs. known flaky

Step 5: REPORT
  - Generate Allure HTML report
  - Post summary to PR/Slack
  - Gate: any failure in smoke/critical = block
```

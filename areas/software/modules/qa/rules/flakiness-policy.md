# Rule: Flakiness Policy

**Priority**: P1 — Flaky tests destroy team trust in CI.

1. **Flakiness SLA**: Flaky tests fixed within 5 business days or permanently removed.
2. **Root cause classification**: Before fixing, classify:
   - Race condition: test doesn't wait for async operation
   - State pollution: depends on another test's side effects
   - Environment dependency: depends on external service
   - Time dependency: hardcodes dates or depends on `Date.now()`
3. **No `sleep()` to fix flakiness**: Use proper await conditions. Never arbitrary `wait(2000)`.
4. **Flakiness tracking**: GitHub issue created for every quarantined test.

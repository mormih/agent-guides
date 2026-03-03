# Rule: Test Data Management

**Priority**: P1 — Improper test data causes production incidents.

1. **No production data in tests**: Use synthetic data generators or fixtures. Never real customer data.
2. **Test data is deterministic**: Each test creates its own data and cleans up after itself.
3. **No shared mutable state between tests**: Tests sharing state create ordering dependencies and flakiness.
4. **Factories over fixtures**: Use factory patterns (factory_boy, @faker-js/faker). Raw SQL fixtures go stale.
5. **Sensitive data obviously fake**: Emails must use `@example.com`, phones use `555-` prefix.

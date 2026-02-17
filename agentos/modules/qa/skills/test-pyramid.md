# Skill: Test Pyramid Strategy

## When to load

When deciding what kind of test to write or evaluating test suite health.

## Deciding Which Test to Write

```
1. Is this a user-visible workflow (login → action → confirmation)?
   → YES: E2E test

2. Does this code call external systems (DB, API, queue)?
   → YES: Integration test (with real or containerized dependency)

3. Is this pure business logic, calculation, or transformation?
   → YES: Unit test
```

## Test Doubles Decision

```
Mock  → verify a function WAS called (behavior verification)
Stub  → control what a dependency returns (state verification)
Fake  → working but simplified implementation (in-memory DB)
Spy   → observe calls without replacing behavior
```

**Rule**: Never mock what you don't own. Wrap third-party libraries in your own adapter and mock the adapter.

# Workflow: `/flakiness-investigation`

**Trigger**: `/flakiness-investigation [--test "test name or file path"]`

## Steps

```
Step 1: GATHER data
  - Fetch last 20 CI runs for the test
  - Compute flakiness rate: (failures / total) × 100
  - Pattern: random? time-of-day? specific environment?

Step 2: CLASSIFY root cause
  Run test 10 times locally in isolation:
  - Passes 10/10: likely STATE POLLUTION
  - Fails sometimes: likely RACE CONDITION or TIME DEPENDENCY

  Check for: sleep() calls → await; Date.now() → mock time;
  shared vars → move to beforeEach; missing await → add await

Step 3: REPRODUCE reliably
  - npx playwright test --repeat-each=50 test.spec.ts
  - Confirm reproduction rate

Step 4: IMPLEMENT fix
  - Fix based on root cause classification
  - Add comment explaining why

Step 5: VERIFY
  - Run 50 times: confirm 0 failures
  - Remove from quarantine list
  - Close tracking issue
```

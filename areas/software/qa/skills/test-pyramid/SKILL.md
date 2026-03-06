---
name: test-pyramid
type: skill
description: Decide what type of test to write, structure the suite, measure health, and apply test doubles correctly.
related-rules:
  - test-strategy.md
  - quality-gates.md
allowed-tools: Read, Write, Edit, Bash
---

# Test Pyramid Strategy Skill

> **Expertise:** Test type selection, suite health, test doubles, coverage strategy, CI integration.

## Test Type Decision Tree

```
Is this a user-visible multi-step workflow (login → action → confirmation)?
  → E2E test (Playwright/Cypress/Detox)

Does the code call external systems (DB, API, queue, file system)?
  → Integration test (real or containerized dependency)

Is this pure business logic, calculation, data transformation, conditional?
  → Unit test (fast, isolated, no I/O)

Is this a contract between two services?
  → Contract test (Pact or schema validation)
```

## Healthy Suite Ratios

| Layer | Target % | When runs | Max duration |
|---|---|---|---|
| Unit | 70% | Every commit | < 2 min |
| Integration | 20% | Every PR | < 5 min |
| E2E | 10% | Pre-release | < 20 min |

**Suite health signals to act on:**
- Tests take > 10 min → too many E2E, not enough unit
- Flake rate > 1% → isolation problems
- Coverage high but bugs still escape → testing implementation, not behavior

## Test Doubles Reference

```
Situation                                      → Double
──────────────────────────────────────────────────────────
Verify a function WAS called                   → Mock
Control what a dependency returns              → Stub
Need working but simplified implementation     → Fake (in-memory DB)
Observe calls without replacing behavior       → Spy
```

**Golden rule:** Never mock what you don't own.
Wrap third-party libraries in your own adapter → mock the adapter.

```python
# ❌ Mocking requests directly
with patch("requests.get") as mock:
    mock.return_value.json.return_value = {"status": "ok"}

# ✅ Mock your own wrapper
class HttpClient:
    async def get(self, url: str) -> dict: ...

class FakeHttpClient:
    async def get(self, url: str) -> dict:
        return {"status": "ok"}

service = MyService(http_client=FakeHttpClient())
```

## Coverage Strategy (Risk-Based Priority)

Coverage is a floor, not a ceiling. Priority:
1. Data mutations — anything that writes to DB
2. Business rules — validation, state machines, calculations
3. Error paths — what happens when things fail
4. Integration boundaries — DB queries, API calls, queue messages
5. Happy path UI flows — last, most expensive

```python
# ❌ Coverage inflation — tests nothing meaningful
def test_order_fields_exist():
    order = Order(id=1, status="pending")
    assert order.id == 1    # tests Python, not your logic

# ✅ Tests behavior and business rules
def test_order_cannot_be_cancelled_if_already_shipped():
    order = Order(id=1, status="shipped")
    with pytest.raises(OrderStateError, match="Cannot cancel shipped order"):
        order.cancel()
```

## Pytest Conventions

```python
# Naming: test_<when>_<expected_outcome>
def test_create_order_with_invalid_product_id_raises_not_found(): ...
def test_apply_discount_when_code_expired_returns_zero(): ...

# Structure: Arrange / Act / Assert
def test_order_total_includes_tax():
    order = Order(items=[OrderItem(price=Decimal("100.00"), quantity=2)])
    total = order.calculate_total(tax_rate=Decimal("0.20"))
    assert total == Decimal("240.00")

# Parametrize for multiple inputs
@pytest.mark.parametrize("quantity,expected_error", [
    (0, "must be greater than 0"),
    (-1, "must be greater than 0"),
    (1001, "exceeds maximum"),
])
def test_order_item_quantity_validation(quantity, expected_error):
    with pytest.raises(ValidationError, match=expected_error):
        OrderItem(product_id="prod_1", quantity=quantity)
```

## Suite Health Checklist

- [ ] `make test` (unit + integration) < 5 min
- [ ] E2E suite < 20 min
- [ ] Zero flaky tests (0% flake rate over last 20 CI runs)
- [ ] Coverage ≥ project threshold on critical paths
- [ ] No `time.sleep()` — use explicit waits or mocks for time
- [ ] Each test independent — no shared mutable state between tests

---
name: api-testing
type: skill
description: Write API integration tests and consumer-driven contract tests (Pact) for service boundaries.
related-rules:
  - test-strategy.md
  - test-data.md
allowed-tools: Read, Write, Edit, Bash
---

# API Testing Patterns Skill

> **Expertise:** API integration tests (supertest/httpx), contract testing (Pact), auth flows, error path coverage.

## Integration Test Structure (FastAPI/httpx)

```python
import pytest
import pytest_asyncio
from httpx import AsyncClient

# conftest.py — reusable fixtures
@pytest_asyncio.fixture
async def client(app, db_session) -> AsyncClient:
    async with AsyncClient(app=app, base_url="http://test") as c:
        yield c

@pytest_asyncio.fixture
async def auth_client(client, create_user) -> AsyncClient:
    user = await create_user(role="viewer")
    response = await client.post("/auth/token",
        data={"username": user.email, "password": "test_password"})
    token = response.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"
    return client

# Test — covers happy path + all error cases
class TestCreateOrder:
    async def test_creates_order_for_authenticated_user(self, auth_client, product_factory):
        product = await product_factory(price="29.99", stock=10)

        response = await auth_client.post("/api/v1/orders", json={
            "items": [{"product_id": product.id, "quantity": 2}]
        })

        assert response.status_code == 201
        body = response.json()
        assert body["status"] == "pending"
        assert body["total_amount"] == "59.98"
        assert body["id"].startswith("ord_")

    async def test_returns_401_without_auth(self, client):
        response = await client.post("/api/v1/orders", json={"items": []})
        assert response.status_code == 401

    async def test_returns_400_when_product_out_of_stock(self, auth_client, product_factory):
        product = await product_factory(stock=0)
        response = await auth_client.post("/api/v1/orders", json={
            "items": [{"product_id": product.id, "quantity": 1}]
        })
        assert response.status_code == 400
        assert response.json()["error"]["code"] == "PRODUCT_OUT_OF_STOCK"

    async def test_returns_404_for_nonexistent_product(self, auth_client):
        response = await auth_client.post("/api/v1/orders", json={
            "items": [{"product_id": "prod_nonexistent", "quantity": 1}]
        })
        assert response.status_code == 404
```

## Error Coverage Checklist (Per Endpoint)

Every endpoint must have tests for:
- [ ] 200/201 happy path with valid input
- [ ] 401 — missing or invalid auth token
- [ ] 403 — authenticated but not authorized (wrong role or not owner)
- [ ] 404 — resource not found
- [ ] 400/422 — validation errors (missing required field, wrong type, out of range)
- [ ] 409 — conflict (duplicate, wrong state transition)
- [ ] Idempotency (if applicable) — same request twice returns same result

## Contract Testing (Pact)

Use when: two services are developed by different teams and must agree on API shape.

```python
# consumer side (frontend/service-b defines expectations)
from pact import Consumer, Provider

pact = Consumer("order-consumer").has_pact_with(Provider("order-service"))

def test_get_order_contract():
    expected = {
        "id": "ord_123",
        "status": "pending",
        "total_amount": Term(r"^\d+\.\d{2}$", "59.98"),
    }

    (pact
        .given("order ord_123 exists")
        .upon_receiving("a request to get order ord_123")
        .with_request("GET", "/api/v1/orders/ord_123")
        .will_respond_with(200, body=Like(expected)))

    with pact:
        response = order_api_client.get_order("ord_123")
        assert response["status"] == "pending"
    # Pact saves contract to pacts/ directory

# Provider side verifies against saved pact file
# Run in CI after consumer tests generate pact files
```

## Pagination Testing Pattern

```python
async def test_list_orders_pagination(auth_client, order_factory):
    # Create 25 orders for cursor-based pagination test
    orders = [await order_factory(user_id=current_user.id) for _ in range(25)]

    # First page
    response = await auth_client.get("/api/v1/orders?limit=10")
    assert response.status_code == 200
    body = response.json()
    assert len(body["items"]) == 10
    assert body["next_cursor"] is not None

    # Second page using cursor
    response2 = await auth_client.get(f"/api/v1/orders?limit=10&cursor={body['next_cursor']}")
    assert len(response2.json()["items"]) == 10
    # Items should not overlap with first page
    first_ids = {o["id"] for o in body["items"]}
    second_ids = {o["id"] for o in response2.json()["items"]}
    assert first_ids.isdisjoint(second_ids)

    # Last page — fewer items, no next cursor
    response3 = await auth_client.get(f"/api/v1/orders?limit=10&cursor={response2.json()['next_cursor']}")
    assert len(response3.json()["items"]) == 5
    assert response3.json()["next_cursor"] is None
```

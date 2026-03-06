---
name: test-data-management
type: skill
description: Manage test data with factories, fixtures, isolation strategies, and cleanup to prevent test pollution.
related-rules:
  - test-strategy.md
  - test-data.md
allowed-tools: Read, Write, Edit, Bash
---

# Test Data Management Skill

> **Expertise:** Factory functions, database isolation, seed data strategies, test pollution prevention.

## Factory Pattern (Python — pytest)

```python
# tests/factories.py
from faker import Faker
from decimal import Decimal
import pytest_asyncio

fake = Faker()

def build_user(**overrides) -> dict:
    """Build a user dict — does NOT write to DB"""
    return {
        "email": fake.email(domain="example-test.com"),  # Never real domains
        "name": fake.name(),
        "role": "viewer",
        "password_hash": "hashed_test_password",
        **overrides,
    }

def build_order(**overrides) -> dict:
    return {
        "status": "pending",
        "total_amount": Decimal("99.99"),
        "currency": "USD",
        **overrides,
    }

# Async factory fixture — writes to DB
@pytest_asyncio.fixture
async def create_user(db_session):
    created = []
    async def _create(**overrides):
        user = User(**build_user(**overrides))
        db_session.add(user)
        await db_session.flush()  # Get ID without committing
        created.append(user)
        return user
    yield _create
    # Cleanup is handled by transaction rollback (see isolation below)

# Usage in test
async def test_user_can_view_own_profile(create_user, client):
    user = await create_user(role="viewer")
    response = await client.get(f"/users/{user.id}", headers=auth_headers(user))
    assert response.status_code == 200
    assert response.json()["email"] == user.email
```

## Database Isolation Strategies

### Option 1: Transaction rollback (fastest — no cleanup needed)
```python
# conftest.py
@pytest_asyncio.fixture
async def db_session(engine):
    async with engine.connect() as conn:
        transaction = await conn.begin()
        session = AsyncSession(bind=conn)
        yield session
        await transaction.rollback()   # Rollback after each test — zero pollution
        await session.close()
```

### Option 2: Truncate tables (compatible with most ORM features)
```python
@pytest_asyncio.fixture(autouse=True)
async def clean_tables(db_session):
    yield
    # After test: truncate in reverse FK order
    await db_session.execute(text("TRUNCATE order_items, orders, users RESTART IDENTITY CASCADE"))
    await db_session.commit()
```

### Option 3: Separate test database (for E2E / integration)
```bash
# docker-compose.test.yml
services:
  db-test:
    image: postgres:16
    environment:
      POSTGRES_DB: myapp_test
    tmpfs: [/var/lib/postgresql/data]   # In-memory — fast and isolated per run
```

## Seed Data for E2E Tests

```python
# tests/e2e/seeds/standard.py
async def seed_standard_dataset(db: AsyncSession):
    """
    Creates a deterministic dataset for E2E tests.
    All IDs and values are fixed — tests can reference them directly.
    """
    # Admin user — for management UI tests
    admin = User(id=1, email="admin@test.example", role="admin", ...)
    # Regular user — for end-user flow tests
    user = User(id=2, email="user@test.example", role="viewer", ...)
    # Products — for order flow tests
    product_a = Product(id=101, name="Widget A", price=Decimal("29.99"), stock=100)
    product_b = Product(id=102, name="Widget B", price=Decimal("49.99"), stock=50)

    db.add_all([admin, user, product_a, product_b])
    await db.commit()

# Apply before E2E suite
@pytest.fixture(scope="session", autouse=True)
async def seed(db_session):
    await seed_standard_dataset(db_session)
```

## Anti-Patterns to Avoid

```python
# ❌ Shared mutable state between tests
orders = []  # module-level list

def test_1():
    orders.append(create_order())  # test 1 adds

def test_2():
    assert len(orders) == 0       # fails if test_1 ran first — order-dependent

# ✅ Each test creates its own data
async def test_order_count_for_new_user(create_user, client):
    user = await create_user()
    response = await client.get(f"/users/{user.id}/orders")
    assert response.json()["count"] == 0   # always true — isolated

# ❌ Real email addresses in test data — risk of sending to real people
user = build_user(email="john.doe@gmail.com")

# ✅ Always use test-safe domains
user = build_user(email=fake.email(domain="example-test.com"))
```

## Test Data Cleanup Verification

```bash
# Verify no test data leaked to production DB
SELECT count(*) FROM users WHERE email LIKE '%example-test.com%';
# → Should always be 0 in production

# Verify test DB is clean before test run
SELECT count(*) FROM users;
# → Should be 0 or match seed count only
```

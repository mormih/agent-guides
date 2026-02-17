# Skill: pytest Fixtures

## When to load

При написании conftest.py и проектировании тестов с общими зависимостями.

## Стандартный conftest.py

```python
import pytest
from unittest.mock import MagicMock, AsyncMock

@pytest.fixture
def mock_db_connection():
    conn = MagicMock()
    conn.cursor.return_value.__enter__ = MagicMock(return_value=MagicMock())
    conn.cursor.return_value.__exit__ = MagicMock(return_value=False)
    return conn

@pytest.fixture
def mock_async_db():
    conn = AsyncMock()
    conn.fetchrow = AsyncMock(return_value=None)
    conn.fetch = AsyncMock(return_value=[])
    conn.execute = AsyncMock(return_value=None)
    return conn

@pytest.fixture
def mock_redis():
    client = MagicMock()
    client.get.return_value = None
    client.set.return_value = True
    return client

@pytest.fixture
def mock_kafka_producer():
    producer = MagicMock()
    producer.produce = MagicMock()
    producer.flush.return_value = 0
    return producer

@pytest.fixture
def tmp_csv(tmp_path):
    file = tmp_path / "test_data.csv"
    file.write_text("id,value,status\n1,100,active\n2,200,inactive\n")
    return file
```

## pytest.ini стандартный шаблон

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    -v
    --tb=short
    --cov=src
    --cov-report=term-missing
    --cov-report=html:coverage_html
    --cov-fail-under=70
asyncio_mode = auto
filterwarnings =
    ignore::DeprecationWarning
    ignore::PendingDeprecationWarning
```

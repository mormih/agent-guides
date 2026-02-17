# `.agent-os` Package: Python Unit Testing (KiloCode)

> **Version**: 1.0.0
> **Tool**: Kilo Code (AI-агентная IDE)
> **Stack**: Python 3.11 / pytest / pytest-cov / poetry / unittest.mock
> **Задача**: Автоматическое написание unit-тестов для существующих mini-проектов с достижением покрытия ≥ 70%

---

## Package Structure

```
.agent-os/
└── python-unit-testing/
    ├── rules/
    │   ├── coverage-policy.md
    │   ├── test-isolation.md
    │   └── naming-conventions.md
    ├── skills/
    │   ├── project-discovery.md
    │   ├── mock-patterns.md
    │   ├── pytest-fixtures.md
    │   ├── async-testing.md
    │   └── coverage-analysis.md
    └── workflows/
        └── write-unit-tests.md
```

---

## RULES (Kernel)

---

### `rules/coverage-policy.md`

# Rule: Coverage Policy

**Priority**: P0 — Workflow не завершается, пока покрытие < 70%.

## Constraints

1. **Минимальный порог**: 70% line coverage по `src/` указанного проекта. Это не финальная цель — это минимум для закрытия задачи.
2. **Итеративный цикл обязателен**: После каждого запуска тестов агент анализирует отчёт coverage, определяет непокрытые строки и ДОПИСЫВАЕТ тесты. Нельзя остановиться после первого прогона.
3. **Считается только source coverage**: Coverage измеряется по `src/` директории проекта, не по самим тестам.
4. **Оба типа сценариев обязательны**: Недопустимо закрыть 70% только позитивными или только негативными тестами. Должны быть представлены оба типа.
5. **Реальное выполнение тестов**: Перед финальным отчётом все тесты должны пройти (`pytest` exit code 0). Тесты с ошибками не засчитываются в coverage.

---

### `rules/test-isolation.md`

# Rule: Test Isolation

**Priority**: P0 — Тест, зависящий от внешнего состояния, ненадёжен.

## Constraints

1. **Нет реальных сетевых вызовов**: Все HTTP-запросы, Kafka, Redis, БД, S3/MinIO должны быть замокированы через `unittest.mock.patch` или `MagicMock`.
2. **Нет реальной файловой системы**: Использовать `tmp_path` (pytest fixture) или `unittest.mock.mock_open` для файловых операций.
3. **Нет зависимости от порядка**: Каждый тест независим. Никаких глобальных переменных, изменяемых между тестами.
4. **Нет реальных credentials**: В тестах не используются реальные токены, пароли, connection strings. Все через `MagicMock` или строки-заглушки вида `"test_token"`, `"postgresql://localhost/test"`.
5. **Нет side effects в `conftest.py`**: `conftest.py` содержит только fixtures и конфигурацию, не выполняет I/O при импорте.

---

### `rules/naming-conventions.md`

# Rule: Naming Conventions

**Priority**: P1 — Единообразие упрощает навигацию и автоматический анализ.

## File Naming

```
tests/
├── test_<module_name>.py        ← для src/<module_name>.py
├── test_<module_name>_async.py  ← для async-heavy модулей отдельно (опционально)
└── conftest.py                  ← fixtures, shared mocks
```

## Test Function Naming

```python
# Pattern: test_<function_name>_<scenario>_<expected_result>

# ✅ Positive scenarios
def test_process_payment_valid_card_returns_success():
def test_parse_kafka_message_valid_json_returns_dict():
def test_fetch_user_existing_id_returns_user():

# ✅ Negative scenarios
def test_process_payment_expired_card_raises_value_error():
def test_parse_kafka_message_invalid_json_raises_parse_error():
def test_fetch_user_nonexistent_id_returns_none():
def test_fetch_user_db_unavailable_raises_connection_error():
```

## Test Class Naming (для группировки)

```python
class TestPaymentProcessor:
    """Tests for PaymentProcessor class"""

class TestKafkaConsumer:
    """Tests for KafkaConsumer"""
```

---

## SKILLS (Libraries)

---

### `skills/project-discovery.md`

# Skill: Project Discovery & Analysis

## When to load

На старте workflow — перед написанием единственной строки теста.

## Step-by-step: как изучить проект перед тестированием

### 1. Читай src/ рекурсивно

```bash
find <project_dir>/src -name "*.py" | sort
```

Для каждого файла:
- Прочитать содержимое полностью
- Выписать: классы, функции, методы, их сигнатуры
- Определить: sync или async, что принимает, что возвращает, что может бросить

### 2. Читай README.md (если есть)

Понять назначение проекта. Это критично для негативных сценариев — нужно знать, какие входные данные некорректны в контексте домена.

### 3. Читай pyproject.toml и poetry.lock

Определи зависимости. Это скажет, что надо мокировать:
- `asyncpg`, `aiomysql`, `psycopg2` → мокировать DB соединения
- `aiohttp`, `requests` → мокировать HTTP
- `confluent-kafka`, `aiokafka` → мокировать Kafka producer/consumer
- `redis` → мокировать Redis клиент
- `minio` → мокировать MinIO клиент
- `aiogram` → мокировать Telegram Bot API

### 4. Проверь существующие тесты

```bash
find <project_dir>/tests -name "*.py" 2>/dev/null | sort
```

Если тесты уже есть — прочитай их. Не дублируй. Дополняй.

### 5. Составь карту покрытия (до написания тестов)

```
src/
├── module_a.py  → функции: func1(), func2()  → 0 тестов
├── module_b.py  → класс ClassB: method1(), method2() → 0 тестов
└── utils.py     → helper1(), helper2() → 0 тестов
```

Эта карта определяет, сколько тестов нужно написать для достижения 70%.

---

### `skills/mock-patterns.md`

# Skill: Mock Patterns (Python)

## When to load

При написании тестов, где есть внешние зависимости.

## Pattern 1: Мокирование HTTP (requests)

```python
from unittest.mock import patch, MagicMock

def test_fetch_data_success():
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"status": "ok", "data": [1, 2, 3]}

    with patch("src.client.requests.get", return_value=mock_response) as mock_get:
        result = fetch_data("https://api.example.com/data")

    mock_get.assert_called_once_with("https://api.example.com/data", timeout=30)
    assert result == [1, 2, 3]

def test_fetch_data_http_error_raises():
    mock_response = MagicMock()
    mock_response.status_code = 500
    mock_response.raise_for_status.side_effect = requests.HTTPError("Server Error")

    with patch("src.client.requests.get", return_value=mock_response):
        with pytest.raises(requests.HTTPError):
            fetch_data("https://api.example.com/data")
```

## Pattern 2: Мокирование aiohttp

```python
import pytest
from unittest.mock import AsyncMock, patch

@pytest.mark.asyncio
async def test_async_fetch_success():
    mock_response = AsyncMock()
    mock_response.status = 200
    mock_response.json = AsyncMock(return_value={"result": "ok"})
    mock_response.__aenter__ = AsyncMock(return_value=mock_response)
    mock_response.__aexit__ = AsyncMock(return_value=False)

    mock_session = AsyncMock()
    mock_session.get = MagicMock(return_value=mock_response)
    mock_session.__aenter__ = AsyncMock(return_value=mock_session)
    mock_session.__aexit__ = AsyncMock(return_value=False)

    with patch("aiohttp.ClientSession", return_value=mock_session):
        result = await async_fetch("https://api.example.com/items")

    assert result == {"result": "ok"}
```

## Pattern 3: Мокирование DB (asyncpg / psycopg2)

```python
from unittest.mock import AsyncMock, MagicMock, patch

# asyncpg
@pytest.mark.asyncio
async def test_get_user_from_db():
    mock_conn = AsyncMock()
    mock_conn.fetchrow = AsyncMock(return_value={
        "id": 1, "email": "user@example.com", "status": "active"
    })

    with patch("asyncpg.connect", AsyncMock(return_value=mock_conn)):
        user = await get_user_by_id(1)

    assert user["email"] == "user@example.com"
    mock_conn.fetchrow.assert_called_once()

# psycopg2
def test_get_record_sync():
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = (1, "test@example.com")

    mock_conn = MagicMock()
    mock_conn.cursor.return_value.__enter__ = MagicMock(return_value=mock_cursor)
    mock_conn.cursor.return_value.__exit__ = MagicMock(return_value=False)

    with patch("psycopg2.connect", return_value=mock_conn):
        result = get_record(1)

    assert result == (1, "test@example.com")
```

## Pattern 4: Мокирование Kafka (confluent-kafka / aiokafka)

```python
from unittest.mock import MagicMock, patch

def test_produce_message_success():
    mock_producer = MagicMock()
    mock_producer.produce = MagicMock()
    mock_producer.flush = MagicMock(return_value=0)

    with patch("confluent_kafka.Producer", return_value=mock_producer):
        result = send_event({"user_id": 123, "action": "login"})

    mock_producer.produce.assert_called_once()
    call_kwargs = mock_producer.produce.call_args
    assert "user_id" in str(call_kwargs)
    assert result is True

def test_produce_message_kafka_error():
    mock_producer = MagicMock()
    mock_producer.produce.side_effect = Exception("Kafka unavailable")

    with patch("confluent_kafka.Producer", return_value=mock_producer):
        with pytest.raises(Exception, match="Kafka unavailable"):
            send_event({"user_id": 123})
```

## Pattern 5: Мокирование Redis

```python
from unittest.mock import MagicMock, patch

def test_cache_set_and_get():
    mock_redis = MagicMock()
    mock_redis.get.return_value = b'{"cached": true}'
    mock_redis.set.return_value = True

    with patch("redis.Redis", return_value=mock_redis):
        cache_value("key_123", {"cached": True}, ttl=300)
        result = get_cached("key_123")

    mock_redis.set.assert_called_once_with("key_123", '{"cached": true}', ex=300)
    assert result == {"cached": True}

def test_cache_miss_returns_none():
    mock_redis = MagicMock()
    mock_redis.get.return_value = None

    with patch("redis.Redis", return_value=mock_redis):
        result = get_cached("nonexistent_key")

    assert result is None
```

## Pattern 6: Мокирование MinIO / S3

```python
from unittest.mock import MagicMock, patch
import io

def test_upload_file_success():
    mock_client = MagicMock()
    mock_client.put_object.return_value = MagicMock(etag="abc123")

    with patch("minio.Minio", return_value=mock_client):
        result = upload_to_storage("bucket", "file.csv", b"col1,col2\n1,2")

    mock_client.put_object.assert_called_once()
    assert result is True

def test_download_file_not_found():
    from minio.error import S3Error
    mock_client = MagicMock()
    mock_client.get_object.side_effect = S3Error(
        "NoSuchKey", "Object not found", None, None, None, None
    )

    with patch("minio.Minio", return_value=mock_client):
        with pytest.raises(S3Error):
            download_from_storage("bucket", "missing_file.csv")
```

## Pattern 7: patch.object (для методов класса)

```python
def test_processor_calls_service():
    processor = DataProcessor(config={"timeout": 30})

    with patch.object(processor, "_call_external_api") as mock_api:
        mock_api.return_value = {"status": "processed"}
        result = processor.run(data={"id": 1})

    mock_api.assert_called_once_with({"id": 1})
    assert result["status"] == "processed"
```

## Pattern 8: Мокирование переменных окружения

```python
from unittest.mock import patch

def test_config_reads_from_env():
    env_vars = {
        "DB_HOST": "localhost",
        "DB_PORT": "5432",
        "API_KEY": "test_key_abc",
    }
    with patch.dict("os.environ", env_vars):
        config = load_config()

    assert config.db_host == "localhost"
    assert config.api_key == "test_key_abc"
```

---

### `skills/pytest-fixtures.md`

# Skill: pytest Fixtures

## When to load

При написании conftest.py и при проектировании тестов с общими зависимостями.

## Стандартный conftest.py для Python-проекта

```python
# conftest.py
import pytest
from unittest.mock import MagicMock, AsyncMock


# ── Scope: function (default) — новый объект на каждый тест ──────────────────

@pytest.fixture
def mock_db_connection():
    """Синхронное DB соединение"""
    conn = MagicMock()
    conn.cursor.return_value.__enter__ = MagicMock(return_value=MagicMock())
    conn.cursor.return_value.__exit__ = MagicMock(return_value=False)
    return conn


@pytest.fixture
def mock_async_db():
    """Асинхронное DB соединение (asyncpg)"""
    conn = AsyncMock()
    conn.fetchrow = AsyncMock(return_value=None)
    conn.fetch = AsyncMock(return_value=[])
    conn.execute = AsyncMock(return_value=None)
    return conn


@pytest.fixture
def mock_redis():
    """Redis клиент"""
    client = MagicMock()
    client.get.return_value = None
    client.set.return_value = True
    client.delete.return_value = 1
    return client


@pytest.fixture
def mock_kafka_producer():
    """Kafka producer"""
    producer = MagicMock()
    producer.produce = MagicMock()
    producer.flush.return_value = 0
    return producer


@pytest.fixture
def sample_user():
    """Типовой объект пользователя для тестов"""
    return {
        "id": 1,
        "email": "test@example.com",
        "status": "active",
        "role": "user",
    }


@pytest.fixture
def tmp_csv(tmp_path):
    """Временный CSV файл"""
    file = tmp_path / "test_data.csv"
    file.write_text("id,value,status\n1,100,active\n2,200,inactive\n")
    return file


# ── Scope: session — один объект на всю тест-сессию ─────────────────────────

@pytest.fixture(scope="session")
def app_config():
    """Тестовая конфигурация приложения"""
    return {
        "db_url": "postgresql://test:test@localhost/test_db",
        "redis_url": "redis://localhost:6379/0",
        "kafka_brokers": "localhost:9092",
        "api_timeout": 5,
        "debug": True,
    }
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

> **Важно**: `--cov-fail-under=70` автоматически фейлит pytest если coverage < 70%.
> Это создаёт автоматический enforcement правила coverage policy.

---

### `skills/async-testing.md`

# Skill: Async Testing

## When to load

При тестировании async функций (async def), coroutines, aiohttp handlers, aiokafka consumers.

## Setup (pytest-asyncio)

```ini
# pytest.ini или pyproject.toml
[pytest]
asyncio_mode = auto  # Все async тесты запускаются автоматически без @pytest.mark.asyncio
```

```toml
# pyproject.toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
```

## Базовый async тест

```python
import pytest
from unittest.mock import AsyncMock, patch

# С asyncio_mode = auto — декоратор не нужен
async def test_async_handler_success():
    mock_repo = AsyncMock()
    mock_repo.get_by_id = AsyncMock(return_value={"id": 1, "data": "value"})

    handler = DataHandler(repository=mock_repo)
    result = await handler.process(item_id=1)

    assert result["data"] == "value"
    mock_repo.get_by_id.assert_awaited_once_with(1)

# Негативный async сценарий
async def test_async_handler_not_found():
    mock_repo = AsyncMock()
    mock_repo.get_by_id = AsyncMock(return_value=None)

    handler = DataHandler(repository=mock_repo)

    with pytest.raises(ValueError, match="Item 1 not found"):
        await handler.process(item_id=1)
```

## AsyncMock vs MagicMock

```python
# AsyncMock: для async def функций / coroutines
mock_async_fn = AsyncMock(return_value={"result": "ok"})
result = await mock_async_fn()  # Работает

# MagicMock: для обычных функций (даже внутри async теста)
mock_sync_fn = MagicMock(return_value=42)
result = mock_sync_fn()  # Работает

# ⚠️ Частая ошибка: MagicMock вместо AsyncMock для async функции
mock_wrong = MagicMock()
result = await mock_wrong.some_async_method()  # TypeError! Используй AsyncMock
```

## Мокирование контекстных менеджеров (async with)

```python
from unittest.mock import AsyncMock

async def test_with_async_context_manager():
    mock_session = AsyncMock()

    # Настройка async context manager
    mock_response = AsyncMock()
    mock_response.status = 200
    mock_response.json = AsyncMock(return_value={"ok": True})

    # __aenter__ возвращает mock_response при "async with session.get(...) as resp:"
    mock_session.get.return_value.__aenter__ = AsyncMock(return_value=mock_response)
    mock_session.get.return_value.__aexit__ = AsyncMock(return_value=False)

    with patch("aiohttp.ClientSession") as MockSession:
        MockSession.return_value.__aenter__ = AsyncMock(return_value=mock_session)
        MockSession.return_value.__aexit__ = AsyncMock(return_value=False)

        result = await my_async_client.fetch("/endpoint")

    assert result == {"ok": True}
```

---

### `skills/coverage-analysis.md`

# Skill: Coverage Analysis & Gap Closing

## When to load

После каждого запуска тестов — для анализа отчёта и планирования следующей итерации.

## Запуск с coverage для конкретного проекта

```bash
# Из директории проекта (project_dir = projects/<category>/<project>)
cd <project_dir>
poetry run pytest tests/ \
    --cov=src \
    --cov-report=term-missing \
    --cov-report=html:coverage_html \
    -v

# Альтернатива: запуск из корня репозитория
cd <project_dir> && poetry run pytest tests/ --cov=src --cov-report=term-missing
```

## Интерпретация вывода `--cov-report=term-missing`

```
---------- coverage: platform darwin, python 3.11 ----------
Name                    Stmts   Miss  Cover   Missing
-----------------------------------------------------
src/processor.py           45      8    82%   23-25, 67, 89-92
src/client.py              30     15    50%   15-20, 35, 48-65
src/utils.py               12      2    83%   8, 22
-----------------------------------------------------
TOTAL                      87     25    71%
```

**Как читать колонку "Missing":**
- `23-25` → строки 23, 24, 25 не покрыты
- `89-92` → блок строк 89-92 не покрыт (часто: ветка if/else, except блок)
- Открой файл, посмотри что там — это подскажет, какой сценарий нужен

## Алгоритм достижения 70%

```
После каждого запуска:

1. Смотрю на файл с наименьшим покрытием
2. Открываю файл, нахожу непокрытые строки
3. Определяю: это ветка кода? except? отдельная функция?
4. Пишу тест, который выполнит эту ветку
5. Запускаю снова
6. Если total coverage >= 70% → переходим к финальной проверке
7. Если < 70% → повторяю с шага 1

НЕ гонюсь за 100%:
- Мокировать __main__ блоки бессмысленно
- Legacy код без тестируемого API пропускаю
- Logging-only строки в coverage не критичны
```

## Типичные непокрытые паттерны и как их покрыть

```python
# Паттерн 1: Exception handler
try:
    result = risky_operation()
except SomeError as e:      # ← строка не покрыта
    logger.error(e)         # ← строка не покрыта
    return None             # ← строка не покрыта

# Решение: тест где risky_operation() бросает SomeError
def test_risky_operation_handles_error():
    with patch("src.module.risky_operation", side_effect=SomeError("test")):
        result = function_under_test()
    assert result is None


# Паттерн 2: Непокрытая ветка if/else
def process(data):
    if data.get("type") == "premium":   # ← покрыто
        return handle_premium(data)      # ← покрыто
    elif data.get("type") == "trial":   # ← НЕ покрыто
        return handle_trial(data)        # ← НЕ покрыто
    else:
        return handle_default(data)      # ← НЕ покрыто

# Решение: добавить тест для каждой ветки
def test_process_trial_user():
    result = process({"type": "trial", "id": 1})
    ...

def test_process_unknown_type_uses_default():
    result = process({"type": "unknown", "id": 1})
    ...


# Паттерн 3: Метод класса никогда не вызывался
class DataLoader:
    def load_from_file(self, path): ...   # ← покрыто
    def load_from_url(self, url): ...     # ← НЕ покрыто

# Решение: написать тест для load_from_url
def test_data_loader_load_from_url():
    loader = DataLoader()
    with patch("requests.get", ...) as mock_get:
        result = loader.load_from_url("https://example.com/data")
    ...
```

---

## WORKFLOWS (Applications)

---

### `workflows/write-unit-tests.md`

# Workflow: `/write-unit-tests`

**Trigger**: `/write-unit-tests <project_path>`

**Пример**: `/write-unit-tests projects/fin-fraud/fin-fraud-lock-empty-desktop-reg-accs`

**Цель**: Написать unit-тесты для указанного проекта. Достичь ≥ 70% coverage. Не завершать задачу до достижения порога.

---

## Pre-flight: Загрузи skills

Перед началом агент загружает:
- `project-discovery` skill
- `mock-patterns` skill
- `pytest-fixtures` skill
- `async-testing` skill (если в src/ есть `async def`)
- `coverage-analysis` skill

---

## Step 1: DISCOVER — изучи проект

```
ACTION: Прочитай ВСЁ содержимое src/ в <project_path>

Для каждого .py файла в src/:
  - Список всех функций и методов с сигнатурами
  - Определи: sync или async
  - Определи внешние зависимости (что импортируется из сторонних пакетов)
  - Определи: что функция возвращает, что бросает

Прочитай pyproject.toml (ищи в <project_path> и в корне репо)
  - Зафиксируй зависимости → это список того, что нужно мокировать

Проверь существующие тесты:
  - Если <project_path>/tests/ уже содержит файлы — прочитай их
  - Не дублировать уже написанные тесты
```

---

## Step 2: SETUP — подготовь файловую структуру

```
ПРОВЕРЬ и СОЗДАЙ если отсутствуют:

□ <project_path>/tests/
  → создать директорию

□ <project_path>/tests/__init__.py
  → создать пустой файл

□ <project_path>/conftest.py
  → если нет: создать с базовыми fixtures из skill:pytest-fixtures
  → если есть: прочитать, не дублировать существующие fixtures

□ <project_path>/pytest.ini
  → если нет: создать по шаблону из skill:pytest-fixtures
     с --cov=src --cov-fail-under=70
  → если есть: проверить что cov параметры есть

□ <project_path>/README.md
  → если нет: создать с заголовком проекта и секцией "## Tests"
  → если есть: прочитать, раздел тестов обновим позже
```

---

## Step 3: PLAN — составь план тестирования

```
Сформируй таблицу перед написанием тестов:

| Файл          | Функция/Метод        | Тип    | Сценарии для покрытия          |
|:--------------|:---------------------|:-------|:-------------------------------|
| processor.py  | process_event()      | async  | ✅ valid event, ❌ invalid schema, ❌ db error |
| client.py     | fetch_data()         | sync   | ✅ 200 ok, ❌ 404, ❌ timeout, ❌ json parse error |
| utils.py      | parse_date()         | sync   | ✅ valid format, ❌ empty string, ❌ wrong format |

Оцени: сколько тестов нужно для ~70% coverage
  → Фокус на функциях с большим количеством строк
  → Каждая ветка if/else/except требует отдельного теста
```

---

## Step 4: WRITE — пиши тесты по файлам

```
Для каждого src/*.py создай tests/test_<filename>.py

Структура каждого тест-файла:
  1. Imports (pytest, unittest.mock, тестируемый модуль)
  2. Вспомогательные данные (constants, sample dicts)
  3. Позитивные сценарии
  4. Негативные сценарии (ошибки, граничные значения, недоступность зависимостей)

Правила написания:
  - Каждый тест атомарный: один assert на поведение (можно несколько assert на один сценарий)
  - Все внешние зависимости из pyproject.toml замокированы
  - Для async функций: использовать AsyncMock, asyncio_mode=auto
  - Именование по конвенции из rules/naming-conventions.md
```

---

## Step 5: PREPARE ENV — подготовь poetry-окружение

```bash
# Переходи в директорию проекта
cd <project_path>

# Проверь наличие виртуального окружения
# Активируй или создай:
python3 -m venv .venv
source .venv/bin/activate
pip install poetry

# Установи зависимости проекта
poetry install

# Проверь установку pytest и pytest-cov
poetry run pytest --version
poetry run pytest --co -q  # Dry run: покажи список тестов без выполнения
```

---

## Step 6: RUN — запусти тесты и проанализируй

```bash
# Запуск из директории <project_path>
cd <project_path>
poetry run pytest tests/ \
    --cov=src \
    --cov-report=term-missing \
    -v

# Если pytest не видит src модули — добавь в pytest.ini:
# pythonpath = src
# или запускай:
PYTHONPATH=src poetry run pytest tests/ --cov=src --cov-report=term-missing -v
```

```
АНАЛИЗ РЕЗУЛЬТАТА:

Вариант A: ВСЕ тесты GREEN + coverage ≥ 70%
  → Перейти к Step 8 (Update README + финальный отчёт)

Вариант B: ВСЕ тесты GREEN + coverage < 70%
  → Прочитать "Missing" колонку в coverage отчёте
  → Определить незакрытые ветки (skill:coverage-analysis)
  → Дописать тесты → вернуться к Step 6

Вариант C: ЕСТЬ FAILING тесты
  → Прочитать error message для каждого упавшего теста
  → Исправить: неверный mock? неверный import? неверный assert?
  → Запустить снова → вернуться к Step 6

НЕ ЗАКРЫВАТЬ ЗАДАЧУ пока не Вариант A.
```

---

## Step 7: ITERATE — закрывай gaps итеративно

```
Итерация продолжается пока coverage < 70%.
Максимум 5 итераций. Если после 5 итераций coverage < 70%:

1. Проверь что --cov=src корректно указывает на src/ проекта
   (не корневой src если он есть)
2. Проверь что pythonpath настроен правильно
3. Зафиксируй текущий coverage и причины невозможности достичь 70%
   в README.md секции "## Test Limitations"
4. Задокументируй что именно не покрыто и почему (legacy, __main__, etc.)

Приоритет по итерациям:
  Итерация 1: покрыть все публичные функции (happy path)
  Итерация 2: покрыть все except-блоки и error branches
  Итерация 3: покрыть граничные значения (пустые списки, None, 0)
  Итерация 4: покрыть все ветки if/elif/else
  Итерация 5: покрыть инициализацию классов, __init__, property
```

---

## Step 8: DOCUMENT — обнови README.md

```
Добавь или обнови в README.md секцию:

## Tests

### Coverage
- **Total coverage**: XX%
- **Measurement date**: YYYY-MM-DD

### Test Scenarios

#### Positive Scenarios
- `test_process_event_valid_data_returns_success` — обработка корректного события
- `test_fetch_user_existing_id_returns_user` — получение существующего пользователя
- ...

#### Negative Scenarios
- `test_process_event_invalid_schema_raises_validation_error` — невалидная схема
- `test_fetch_user_db_unavailable_raises_connection_error` — недоступность БД
- `test_fetch_user_nonexistent_id_returns_none` — несуществующий ID
- ...

### How to Run Tests

cd projects/<category>/<project>
poetry run pytest tests/ --cov=src --cov-report=term-missing -v

### Coverage Report
HTML отчёт генерируется в: `coverage_html/index.html`
```

---

## Step 9: FINAL REPORT — итоговый вывод агента

```
✅ Workflow завершён: /write-unit-tests <project_path>

📁 Созданные/изменённые файлы:
   tests/__init__.py          (создан)
   tests/test_processor.py    (создан, 12 тестов)
   tests/test_client.py       (создан, 8 тестов)
   tests/test_utils.py        (создан, 5 тестов)
   conftest.py                (создан)
   pytest.ini                 (создан)
   README.md                  (обновлён)

📊 Coverage результат:
   src/processor.py    87%
   src/client.py       74%
   src/utils.py        91%
   TOTAL               82% ✅ (порог: 70%)

🧪 Тесты:
   Всего:      25
   Прошли:     25 ✅
   Упали:      0
   Позитивных: 14
   Негативных: 11

🔁 Итераций потребовалось: 2
```

---

## Troubleshooting Guide

### ImportError: No module named 'src.module'

```bash
# Причина: Python не видит src/ в PATH
# Решение 1: добавь в pytest.ini
[pytest]
pythonpath = src

# Решение 2: запускай с PYTHONPATH
PYTHONPATH=src poetry run pytest tests/ -v

# Решение 3: добавь src в sys.path в conftest.py
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))
```

### ModuleNotFoundError для зависимостей

```bash
# Убедись что poetry install выполнен в директории проекта
cd <project_path>
poetry install

# Если pyproject.toml в корне репо, а не в project_path:
# запускай тесты из корня, указывая путь явно
poetry run pytest <project_path>/tests/ \
    --cov=<project_path>/src \
    --cov-report=term-missing
```

### pytest-cov не установлен

```bash
# Добавь в dev-зависимости
cd <project_path>  # или в корне если общий pyproject.toml
poetry add --group dev pytest-cov

# Или если нет доступа к изменению pyproject.toml:
poetry run pip install pytest-cov
```

### asyncio_mode = auto не работает (pytest-asyncio < 0.21)

```python
# Добавь декоратор вручную к каждому async тесту
import pytest

@pytest.mark.asyncio
async def test_my_async_function():
    ...

# Или обнови pytest-asyncio:
poetry add --group dev "pytest-asyncio>=0.21"
```

### Coverage показывает 0% для src/

```bash
# Причина: src не найден относительно текущей директории
# Убедись что запускаешь из <project_path>
cd projects/fin-fraud/my-project
poetry run pytest tests/ --cov=src --cov-report=term-missing

# Проверь что src/ существует:
ls src/
```

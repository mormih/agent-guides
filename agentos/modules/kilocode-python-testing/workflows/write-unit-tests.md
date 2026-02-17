# Workflow: `/write-unit-tests`

**Trigger**: `/write-unit-tests <project_path>`

**Пример**: `/write-unit-tests projects/fin-fraud/fin-fraud-lock-empty-desktop-reg-accs`

**Цель**: Написать unit-тесты. Достичь ≥ 70% coverage. Не завершать задачу до достижения порога.

## Pre-flight: Загрузи skills

- `project-discovery` skill
- `mock-patterns` skill
- `pytest-fixtures` skill
- `async-testing` skill (если в src/ есть `async def`)
- `coverage-analysis` skill

---

## Step 1: DISCOVER — изучи проект

```
Прочитай ВСЁ в src/:
  - Каждый .py файл: классы, функции, методы, сигнатуры
  - sync или async?
  - Внешние зависимости (что импортируется из сторонних пакетов)

Прочитай pyproject.toml → зафиксируй зависимости = список для мокирования

Проверь существующие тесты:
  find <project_path>/tests -name "*.py" 2>/dev/null
  Не дублировать уже написанные тесты
```

## Step 2: SETUP — создай файловую структуру

```
□ <project_path>/tests/               → создать если нет
□ <project_path>/tests/__init__.py    → создать пустой
□ <project_path>/conftest.py          → создать по шаблону из skill:pytest-fixtures
□ <project_path>/pytest.ini           → создать с --cov=src --cov-fail-under=70
□ <project_path>/README.md            → создать если нет
```

## Step 3: PLAN — составь таблицу тестирования

```
| Файл          | Функция       | Тип   | Сценарии                              |
|:--------------|:--------------|:------|:--------------------------------------|
| processor.py  | process()     | async | ✅ valid event, ❌ invalid schema, ❌ db error |
| client.py     | fetch_data()  | sync  | ✅ 200 ok, ❌ 404, ❌ timeout |
```

## Step 4: WRITE — пиши тесты

```
Для каждого src/*.py → tests/test_<filename>.py

Структура файла:
  1. Imports (pytest, unittest.mock, тестируемый модуль)
  2. Позитивные сценарии
  3. Негативные сценарии (ошибки, граничные значения, недоступность зависимостей)

Правила:
  - Все внешние зависимости замокированы
  - Async функции → AsyncMock, asyncio_mode=auto
  - Именование по правилу: test_<function>_<scenario>_<expected>
```

## Step 5: PREPARE ENV

```bash
cd <project_path>
python3 -m venv .venv && source .venv/bin/activate
pip install poetry
poetry install
poetry run pytest --co -q  # Dry run: проверить список тестов
```

## Step 6: RUN — запусти и проанализируй

```bash
cd <project_path>
PYTHONPATH=src poetry run pytest tests/ --cov=src --cov-report=term-missing -v
```

```
Вариант A: Все GREEN + coverage ≥ 70% → Step 8
Вариант B: Все GREEN + coverage < 70% → читать "Missing", дописать тесты → Step 6
Вариант C: Есть FAILING тесты → исправить mock/import/assert → Step 6

НЕ ЗАКРЫВАТЬ ЗАДАЧУ пока не Вариант A.
```

## Step 7: ITERATE

```
Приоритет итераций:
  1: покрыть все публичные функции (happy path)
  2: покрыть все except-блоки и error branches
  3: покрыть граничные значения (None, пустые списки, 0)
  4: покрыть все ветки if/elif/else
  5: покрыть __init__, property, class-level код
```

## Step 8: DOCUMENT — обнови README.md

```markdown
## Tests

### Coverage
- **Total coverage**: XX%
- **Date**: YYYY-MM-DD

### Positive Scenarios
- `test_process_event_valid_data_returns_success`
- ...

### Negative Scenarios
- `test_process_event_invalid_schema_raises_error`
- `test_fetch_user_db_unavailable_raises_connection_error`
- ...

### How to Run
cd projects/<category>/<project>
poetry run pytest tests/ --cov=src --cov-report=term-missing -v
```

## Step 9: FINAL REPORT

```
✅ Workflow завершён

📁 Файлы:
   tests/__init__.py
   tests/test_processor.py   (12 тестов)
   tests/test_client.py      (8 тестов)
   conftest.py
   pytest.ini
   README.md (обновлён)

📊 Coverage:
   src/processor.py    87%
   src/client.py       74%
   TOTAL               82% ✅

🧪 Итого: 20 тестов, 14 позитивных, 6 негативных
🔁 Итераций: 2
```

## Troubleshooting

```bash
# ImportError: No module named 'src.module'
# pytest.ini:
[pytest]
pythonpath = src
# или:
PYTHONPATH=src poetry run pytest tests/ -v

# pytest-cov не установлен
poetry add --group dev pytest-cov

# asyncio_mode = auto не работает
poetry add --group dev "pytest-asyncio>=0.21"

# Coverage показывает 0%
# Убедись что запускаешь из <project_path>, не из корня репо
cd projects/fin-fraud/my-project
poetry run pytest tests/ --cov=src --cov-report=term-missing
```

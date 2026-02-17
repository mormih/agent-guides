# Skill: Coverage Analysis & Gap Closing

## When to load

После каждого запуска тестов — для анализа и планирования следующей итерации.

## Запуск с coverage

```bash
cd <project_path>
poetry run pytest tests/ --cov=src --cov-report=term-missing -v
# или
PYTHONPATH=src poetry run pytest tests/ --cov=src --cov-report=term-missing -v
```

## Интерпретация вывода

```
Name                    Stmts   Miss  Cover   Missing
src/processor.py           45      8    82%   23-25, 67, 89-92
src/client.py              30     15    50%   15-20, 35, 48-65
```

`Missing` → открыть файл, посмотреть что на этих строках → написать тест, который выполнит эту ветку.

## Алгоритм итераций

```
После каждого запуска:
1. Файл с наименьшим покрытием → найти непокрытые строки
2. Определить: ветка кода? except? отдельная функция?
3. Написать тест, покрывающий эту ветку
4. Запустить снова
5. Если coverage >= 70% → финальная проверка
6. Если < 70% → повторить

Не гнаться за 100%:
- __main__ блоки — пропускать
- Logging-only строки — не критично
- Legacy код без тестируемого API — документировать
```

## Типичные непокрытые паттерны

```python
# Паттерн 1: Exception handler
try:
    result = risky_operation()
except SomeError as e:      # ← не покрыто
    return None             # ← не покрыто

# Решение: тест где risky_operation() бросает SomeError
def test_handles_some_error():
    with patch("src.module.risky_operation", side_effect=SomeError("test")):
        result = function_under_test()
    assert result is None

# Паттерн 2: Непокрытая ветка elif/else
# Решение: добавить тест для каждой непокрытой ветки

# Паттерн 3: Метод класса никогда не вызывался
# Решение: написать тест, создающий объект и вызывающий метод
```

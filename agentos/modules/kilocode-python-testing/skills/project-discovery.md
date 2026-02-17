# Skill: Project Discovery & Analysis

## When to load

На старте workflow — перед написанием единственной строки теста.

## Алгоритм изучения проекта

```bash
# 1. Читай src/ рекурсивно
find <project_dir>/src -name "*.py" | sort

# 2. Читай README.md — понять назначение, edge cases

# 3. Читай pyproject.toml — определить зависимости для мокирования:
# asyncpg, aiomysql, psycopg2 → DB connections
# aiohttp, requests → HTTP
# confluent-kafka, aiokafka → Kafka
# redis → Redis client
# minio → MinIO client
# aiogram → Telegram Bot API

# 4. Проверь существующие тесты
find <project_dir>/tests -name "*.py" 2>/dev/null | sort
```

## Карта покрытия (составить до написания тестов)

```
src/
├── module_a.py  → функции: func1(), func2()  → 0 тестов
├── module_b.py  → класс ClassB: method1()    → 0 тестов
└── utils.py     → helper1(), helper2()        → 0 тестов
```

Оценить: сколько тестов нужно для ~70% coverage.
Фокус: функции с большим количеством строк + каждая ветка if/else/except.

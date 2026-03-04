# Workflow: Develop Feature

**Description**: Процесс разработки изолированного продуктового функционала (Feature) в рамках одного (или нескольких) микросервисов. Включает бизнес-логику, БД и API.

**Inputs**:
- `<feature-name>`: Название фичи, которую нужно разработать.

## Workflow (Iterative)

```
@pm (gather requirements) → @team-lead (plan & review architecture) → 
@developer (implement) → @qa (test) → @team-lead (review code) → 
@developer + @qa (fix) → ... (loop until done) → Report
```

## 1. Сбор и анализ требований для `<feature-name>`
- Изучить пользовательскую историю (User Story).
- Очертить Bounded Context: затрагивает ли фича один сервис или требует распределенного взаимодействия.

## 2. Проектирование контрактов (API First)
- Определить DTO и контракты взаимодействия (`OpenAPI`/`Protobuf`).
- Добавить валидационные правила (Zod/Pydantic/Play Framework validation).

## 3. Проектирование схемы БД (Model & Migration)
- Спроектировать таблицы и индексы.
- Создать файлы миграции БД через `add-migration`.

## 4. Разработка бизнес-логики (Domain & App Layer)
- Написать сущности или сервисы, описывающие правила.
- Обеспечить использование паттернов транзакций при необходимости.
- Добавить Unit тесты на сложные расчеты внутри сервисов.

## 5. Интеграция Инфраструктуры
- Написать реализацию репозитория или адаптеров к внешним API.
- Настроить отправку событий (Outbox pattern).

## 6. Связывание и E2E/Integration API
- Прокинуть зависимости в контроллеры.
- Написать интеграционный тест на весь путь API с реальной инфраструктурой (Testcontainers).
- Настроить Trace ID и логирование ключевых моментов.

## Связанные Навыки (Skills)
- Используйте инструкции из `backend/skills/api-design/SKILL.md` для проектирования контрактов (REST/gRPC).
- Используйте паттерны из `backend/skills/database-modeling/SKILL.md` при проектировании БД и схемы.
- Используйте `backend/skills/async-processing/SKILL.md` для корректной отправки событий (Outbox pattern).
- Используйте `backend/skills/observability/SKILL.md` для правил логирования и метрик.

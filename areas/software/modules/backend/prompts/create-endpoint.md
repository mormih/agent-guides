# Prompt: `/create-endpoint`

## Создание RESTful Эндпоинта

```
/create-endpoint create_order --api-type rest --method POST

Создай эндпоинт /api/v1/orders:
- DTO: валидация Pydantic/Zod (user_id, items array, total_amount).
- Домен: OrderService, реализующий бизнес-правила применения скидки и расчёта итоговой суммы (ссылайся на `backend/skills/api-design/SKILL.md`).
- Инфраструктура: OrderRepositoryImpl для PostgreSQL (с транзакцией).
- Событие: Отправить OrderCreatedEvent в Kafka после успешного коммита транзакции (использовать паттерн Outbox из `backend/skills/async-processing/SKILL.md`).
- Тесты: Unit-тест для OrderService и Integration-тест с Testcontainers для репозитория.
```

## Создание gRPC Эндпоинта

```
/create-endpoint GetUserMetrics --api-type grpc

Добавь gRPC метод GetUserMetrics в существующий сервисный интерфейс.
- Обнови `.proto` схемы.
- Контроллер должен делегировать запрос в слой `Application`.
- Если данных нет в кэше Redis, сходи в Postgres (референс: `backend/skills/database-modeling/SKILL.md`).
```

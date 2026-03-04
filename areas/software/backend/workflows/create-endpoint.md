# Workflow: Create a New Endpoint

**Description**: Стандартный процесс добавления нового REST/gRPC эндпоинта в существующий сервис.

**Inputs**:
- `<endpoint-name>`: Имя создаваемого эндпоинта.
- `<api-type>` (опционально): Тип API (`rest`, `grpc`).
- `<method>` (опционально): HTTP метод для REST (`POST`, `GET`, и т.д.).

## Workflow (Iterative)

```
@developer (implement endpoint) → @qa (write tests) → @team-lead (code review) → 
@developer (fix) → ... (loop) → Report
```

## 1. Контракты и DTO (API First) для `<endpoint-name>`
- Определите структуру запроса (Request) и ответа (Response) в формате OpenAPI/Swagger или `.proto`.
- Создайте классы/структуры DTO (Data Transfer Objects) с правилами валидации на границе (граничный слой).

## 2. Domain / Application Layer
- Создайте Use Case или Service класс, который принимает провалидированный DTO.
- Напишите бизнес-логику внутри сервиса. Сервис не должен знать о HTTP (req, res, headers) или о специфике SQL базы. Он оперирует только доменными сущностями и вызывает интерфейсы репозиториев/брокеров (Ports).

## 3. Infrastructure Layer
- Если требуется новая интеракция с базой данных, добавьте метод в интерфейс репозитория (в domain/application слое).
- Реализуйте этот метод в конкретном классе репозитория (infrastructure слое), напишите SQL запрос или ORM вызов. Учтите N+1 и индексы.

## 4. Presentation Layer (Controller/Handler)
- Создайте метод контроллера.
- Привяжите к роуту (Route).
- Настройте авторизацию (RBAC/ABAC проверки).
- Контроллер получает HTTP вызов, вызывает DI-контейнер для получения Use Case, передает данные, и конвертирует результат обратно в HTTP Response с правильным статус-кодом.

## 5. Testing
- Напишите **Unit-тест** для Use Case, замокав репозиторий.
- Напишите **Integration-тест** (или E2E-тест API) для собранного эндпоинта, который выполняет реальный HTTP-запрос и проверяет, что сохраняется в Testcontainers-БД.

## 6. Review & Observability
- Убедитесь, что метрики для нового роута собираются автоматически (обычно закрывается middleware).
- Если эндпоинт меняет состояние системы - сгенерировано ли доменное событие для Kafka/NATS? (Если применимо).

## Связанные Навыки (Skills)
- Проектирование контракта: `backend/skills/api-design/SKILL.md`.
- Работа с базой данных: `backend/skills/database-modeling/SKILL.md`.
- Асинхронная отправка событий: `backend/skills/async-processing/SKILL.md`.
- Мониторинг и логирование: `backend/skills/observability/SKILL.md`.

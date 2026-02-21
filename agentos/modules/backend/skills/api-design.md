# Skill: API Design (REST & gRPC)

**Description**: Паттерны проектирования надежных и масштабируемых интерфейсов.

## RESTful API Best Practices

1. **Ресурсно-ориентированность (Resource-Oriented)**:
   - URL должны указывать на сущности (`/users`, `/orders`), а не на действия (`/getUsers`, `/createOrder`).
   - Использовать стандартные HTTP методы семантически: `GET` (чтение), `POST` (создание), `PUT` (полное обновление), `PATCH` (частичное обновление), `DELETE` (удаление).
2. **Пагинация и Фильтрация**:
   - При отдаче списков всегда использовать курсорную пагинацию (Cursor/Keyset Pagination) для больших таблиц, либо Offset/Limit для маленьких.
   - Фильтры передавать через Query Parameters: `GET /users?status=active&sort=-created_at`.
3. **Версионирование**:
   - Версионирование через URL (например: `/api/v1/users`) или через HTTP Header `Accept: application/vnd.company.v1+json`. Первый способ предпочтительнее для внешних API.

## gRPC Guidelines

1. **Protobuf Contracts**:
   - `.proto` файлы являются источником правды для межсервисного взаимодействия.
   - Хранить контракты в едином Schema Registry (например, отдельный репозиторий).
2. **Backward Compatibility**:
   - Запрещено менять тип или удалять поля в Protobuf-сообщениях.
   - Использовать префикс `deprecated` для устаревших полей, не переиспользовать номера тегов.

## Error Handling

- **Единый формат ошибок (RFC 7807 Problem Details)**:
  ```json
  {
    "type": "https://example.com/probs/out-of-credit",
    "title": "You do not have enough credit.",
    "status": 403,
    "detail": "Your current balance is 30, but that costs 50.",
    "instance": "/account/12345/msgs/abc",
    "trace_id": "87f217..."
  }
  ```
- **Статус коды HTTP**: 
  - `400` - Ошибка валидации клиента.
  - `401` - Отсутствует или невалидный токен (Аутентификация).
  - `403` - Запрещено правилами RBAC/ABAC (Авторизация).
  - `404` - Ресурс не найден (или попытка доступа к чужому ресурсу).
  - `409` - Конфликт состояний (например, ресурс с таким email уже существует).
  - `422` - Семантическая ошибка (Unprocessable Entity).
  - `500` - Внутренняя ошибка сервиса. Должна возвращать общую информацию пользователю, но детальный лог в Sentry.

## Контекст Выполнения (Inputs)
- Если навык вызывается в рамках контекста `<module-file>`, `<feature-name>` или `<endpoint-name>`, проектируйте DTO и роуты именно вокруг этого ресурса.
- Не выходите за рамки (Bounded Context), указанного во входных параметрах workflow.

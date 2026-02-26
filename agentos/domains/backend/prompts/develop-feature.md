# Prompt: `/develop-feature`

## Создание нового функционала (Full Stack Backend)

```
/develop-feature "Cancel Subscription API"

Отмена подписки.
DTO: `cancel_reason` (string, max 200), `immediate` (boolean).
Логика: 
- Проверить наличие подписки (404 если нет).
- Если `immediate=true`, сразу заблокировать через UserService. Если `false`, установить `expires_at` в конце месяца.
- Обновить запись в базе и закоммитить (ACID).
- Отправить событие `SubscriptionCancelled` в Message Broker.

Используй лучшие практики из `backend/skills/api-design.md` и `backend/skills/async-processing.md`.
Обязательно написать Unit тесты для Domain Service с моками.
```

## Добавление простого CRUD

```
/develop-feature "Tags Management"

Добавление CRUD для тегов статей (Tag).
Модель данных: `id`, `name` (unique), `created_at`.
Эндпоинты: GET /tags, POST /tags, DELETE /tags/:id.
Учесть пагинацию для GET.
```

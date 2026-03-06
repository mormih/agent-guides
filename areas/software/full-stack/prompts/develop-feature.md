# Prompt: `/develop-feature`

Use when: implementing a feature ticket end-to-end in a full-stack Python/FastAPI project.

---

## Example 1 — Domain feature with DB changes

**EN:**
```
/develop-feature "Add product reviews"

Feature: users can leave a 1-5 star rating + text review on a product
Acceptance criteria:
- POST /products/{id}/reviews — create review (auth required, one per user per product)
- GET /products/{id}/reviews — paginated list, newest first
- Product detail page shows average rating + review count
- User cannot review their own product
Tech stack: FastAPI + SQLAlchemy async + Next.js
```

**RU:**
```
/develop-feature "Добавить отзывы о продукте"

Фича: пользователи могут оставить оценку от 1 до 5 звёзд + текстовый отзыв на продукт
Критерии приёмки:
- POST /products/{id}/reviews — создать отзыв (auth required, один на пользователя на продукт)
- GET /products/{id}/reviews — пагинированный список, сначала новые
- Страница продукта показывает средний рейтинг + количество отзывов
- Пользователь не может оставить отзыв на свой продукт
Стек: FastAPI + SQLAlchemy async + Next.js
```

---

## Example 2 — API-only feature

**EN:**
```
/develop-feature "Webhook delivery for order events"

Feature: notify external systems when order status changes
Acceptance criteria:
- Merchants can register webhook URLs (POST /webhooks)
- On order status change: send POST to registered URLs with order payload
- Retry up to 3 times on delivery failure (exponential backoff)
- Webhook delivery log accessible via GET /webhooks/{id}/deliveries
No frontend changes needed — API only
```

**RU:**
```
/develop-feature "Доставка вебхуков для событий заказов"

Фича: уведомлять внешние системы при изменении статуса заказа
Критерии приёмки:
- Мерчанты могут регистрировать webhook URL (POST /webhooks)
- При изменении статуса заказа: отправить POST на зарегистрированные URL с payload заказа
- До 3 повторных попыток при ошибке доставки (exponential backoff)
- Лог доставки доступен через GET /webhooks/{id}/deliveries
Изменений фронтенда не нужно — только API
```

---

## Example 3 — Quick / Small change

**EN:**
```
/develop-feature "Add 'archived' status to products"

Small change: products can be archived (hidden from catalog, not deleted)
- Add 'archived' status to product model (non-breaking migration)
- Filter archived products from GET /products by default
- Admin can toggle via PATCH /products/{id} with {"status": "archived"}
```

**RU:**
```
/develop-feature "Добавить статус 'archived' для продуктов"

Небольшое изменение: продукты можно архивировать (скрыть из каталога, не удалять)
- Добавить статус 'archived' в модель продукта (non-breaking миграция)
- Фильтровать архивированные продукты из GET /products по умолчанию
- Администратор может переключить через PATCH /products/{id} с {"status": "archived"}
```

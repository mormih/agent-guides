# Prompt: `/debug-issue`

Use when: diagnosing a bug in a FastAPI/Next.js application with a clear or unclear root cause.

---

## Example 1 — Production error with stack trace

**EN:**
```
/debug-issue "500 error on POST /orders for users with discount codes"

Error: Internal Server Error — 500
Stack trace: KeyError: 'discount_amount' in order_service.py:147
Environment: production (not reproducible locally without discount code)
Logs: request_id=req_abc123 — last 10 lines attached
Frequency: 100% for users applying discount code; 0% for regular checkout
Last change: discount module deployed 2 days ago (PR #204)
```

**RU:**
```
/debug-issue "Ошибка 500 на POST /orders для пользователей с кодами скидок"

Ошибка: Internal Server Error — 500
Stack trace: KeyError: 'discount_amount' в order_service.py:147
Окружение: production (не воспроизводится локально без кода скидки)
Логи: request_id=req_abc123 — последние 10 строк приложены
Частота: 100% для пользователей применяющих код скидки; 0% для обычного оформления
Последнее изменение: задеплоен discount модуль 2 дня назад (PR #204)
```

---

## Example 2 — Performance regression

**EN:**
```
/debug-issue "GET /products endpoint degraded from 80ms to 4s after migration"

Symptom: endpoint response time went from p99 80ms to 4000ms after schema migration PR #198
The migration added a new products_tags junction table
No obvious errors — just latency
Suspected: missing index or N+1 query introduced by new relationship
```

**RU:**
```
/debug-issue "Деградация GET /products с 80ms до 4s после миграции"

Симптом: время ответа endpoint выросло с p99 80ms до 4000ms после миграции PR #198
Миграция добавила новую junction таблицу products_tags
Явных ошибок нет — только задержка
Предположение: отсутствует индекс или появился N+1 запрос из-за нового relationship
```

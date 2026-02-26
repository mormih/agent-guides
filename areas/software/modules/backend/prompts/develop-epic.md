# Prompt: `/develop-epic`

## Архитектурное планирование крупного функционала

```
/develop-epic "User Subscription & Billing"

Бизнес-цель: Внедрение Stripe для платных подписок.
Ограничения: 
- Оплата списывается асинхронно через Webhooks.
- Подписки бывают: Free, Pro, Enterprise.
- Поддержка Grace Period (7 дней).

Спроектируй систему (ADR): 
- БД схему для подписок и транзакций (ссылайся на `backend/skills/database-modeling/SKILL.md`).
- DTO и контракты для фронтенда и вебхуков Stripe.
- Event-Driven коммуникации - Kafka (ссылайся на `backend/skills/async-processing/SKILL.md`).
- Оцени STRIDE риски.
- Разбей на небольшие Features для реализации через `/develop-feature`.
```

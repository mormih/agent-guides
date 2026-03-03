# Prompt: `/refactor-module`

## Рефакторинг Legacy Контроллера

```
/refactor-module auth_controller.ts

Проведи рефакторинг `auth_controller.ts`.
Текущая проблема: В нём смешаны прямые SQL-запросы, обращения к Redis и бизнес-логика валидации JWT.
1. Выдели доменную логику в `AuthService` (по правилам Clean Architecture в `backend/rules/architecture.md`).
2. Создай порты (интерфейсы) `UserRepository` и `CacheService`.
3. Оставь в контроллере только парсинг HTTP-запроса, вызов `AuthService` и возврат ответа (согласно `backend/skills/api-design/SKILL.md`).
Добавь Unit-тесты для нового `AuthService`.
```

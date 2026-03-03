# Prompt: `/refactor-module`

## Refaktoring Legacy Kontrollera

```
/refactor-module auth_controller.ts

Provedi refaktoring `auth_controller.ts`.
Tekushchaya problema: V nem smeshany pryamye SQL-zaprosy, obrashcheniya k Redis i biznes-logika validatsii JWT.
1. Vydeli domennuyu logiku v `AuthService` (po pravilam Clean Architecture v `backend/rules/architecture.md`).
2. Sozday porty (interfeysy) `UserRepository` i `CacheService`.
3. Ostav v kontrollere tolko parsing HTTP-zaprosa, vyzov `AuthService` i vozvrat otveta (soglasno `backend/skills/api-design/SKILL.md`).
Dobav Unit-testy dlya novogo `AuthService`.
```

# Prompt: `/develop-feature`

## Sozdanie novogo funktsionala (Full Stack Backend)

```
/develop-feature "Cancel Subscription API"

Otmena podpiski.
DTO: `cancel_reason` (string, max 200), `immediate` (boolean).
Logika: 
- Proverit nalichie podpiski (404 esli net).
- Esli `immediate=true`, srazu zablokirovat cherez UserService. Esli `false`, ustanovit `expires_at` v kontse mesyatsa.
- Obnovit zapis v baze i zakommitit (ACID).
- Otpravit sobytie `SubscriptionCancelled` v Message Broker.

Ispolzuy luchshie praktiki iz `backend/skills/api-design/SKILL.md` i `backend/skills/async-processing/SKILL.md`.
Obyazatelno napisat Unit testy dlya Domain Service s mokami.
```

## Dobavlenie prostogo CRUD

```
/develop-feature "Tags Management"

Dobavlenie CRUD dlya tegov statey (Tag).
Model dannykh: `id`, `name` (unique), `created_at`.
Endpointy: GET /tags, POST /tags, DELETE /tags/:id.
Uchest paginatsiyu dlya GET.
```

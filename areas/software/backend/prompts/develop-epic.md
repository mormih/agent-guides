# Prompt: `/develop-epic`

## Arkhitekturnoe planirovanie krupnogo funktsionala

```
/develop-epic "User Subscription & Billing"

Biznes-tsel: Vnedrenie Stripe dlya platnykh podpisok.
Ogranicheniya: 
- Oplata spisyvaetsya asinkhronno cherez Webhooks.
- Podpiski byvayut: Free, Pro, Enterprise.
- Podderzhka Grace Period (7 dney).

Sproektiruy sistemu (ADR): 
- BD skhemu dlya podpisok i tranzaktsiy (ssylaysya na `backend/skills/database-modeling/SKILL.md`).
- DTO i kontrakty dlya frontenda i vebkhukov Stripe.
- Event-Driven kommunikatsii - Kafka (ssylaysya na `backend/skills/async-processing/SKILL.md`).
- Otseni STRIDE riski.
- Razbey na nebolshie Features dlya realizatsii cherez `/develop-feature`.
```

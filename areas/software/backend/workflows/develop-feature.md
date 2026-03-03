# Workflow: Develop Feature

**Description**: Protsess razrabotki izolirovannogo produktovogo funktsionala (Feature) v ramkakh odnogo (ili neskolkikh) mikroservisov. Vklyuchaet biznes-logiku, BD i API.

**Inputs**:
- `<feature-name>`: Nazvanie fichi, kotoruyu nuzhno razrabotat.

## 1. Sbor i analiz trebovaniy dlya `<feature-name>`
- Izuchit polzovatelskuyu istoriyu (User Story).
- Ochertit Bounded Context: zatragivaet li ficha odin servis ili trebuet raspredelennogo vzaimodeystviya.

## 2. Proektirovanie kontraktov (API First)
- Opredelit DTO i kontrakty vzaimodeystviya (`OpenAPI`/`Protobuf`).
- Dobavit validatsionnye pravila (Zod/Pydantic/Play Framework validation).

## 3. Proektirovanie skhemy BD (Model & Migration)
- Sproektirovat tablitsy i indeksy.
- Sozdat fayly migratsii BD cherez `add-migration`.

## 4. Razrabotka biznes-logiki (Domain & App Layer)
- Napisat sushchnosti ili servisy, opisyvayushchie pravila.
- Obespechit ispolzovanie patternov tranzaktsiy pri neobkhodimosti.
- Dobavit Unit testy na slozhnye raschety vnutri servisov.

## 5. Integratsiya Infrastruktury
- Napisat realizatsiyu repozitoriya ili adapterov k vneshnim API.
- Nastroit otpravku sobytiy (Outbox pattern).

## 6. Svyazyvanie i E2E/Integration API
- Prokinut zavisimosti v kontrollery.
- Napisat integratsionnyy test na ves put API s realnoy infrastrukturoy (Testcontainers).
- Nastroit Trace ID i logirovanie klyuchevykh momentov.

## Svyazannye Navyki (Skills)
- Ispolzuyte instruktsii iz `backend/skills/api-design/SKILL.md` dlya proektirovaniya kontraktov (REST/gRPC).
- Ispolzuyte patterny iz `backend/skills/database-modeling/SKILL.md` pri proektirovanii BD i skhemy.
- Ispolzuyte `backend/skills/async-processing/SKILL.md` dlya korrektnoy otpravki sobytiy (Outbox pattern).
- Ispolzuyte `backend/skills/observability/SKILL.md` dlya pravil logirovaniya i metrik.

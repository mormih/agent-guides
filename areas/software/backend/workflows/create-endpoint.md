# Workflow: Create a New Endpoint

**Description**: Standartnyy protsess dobavleniya novogo REST/gRPC endpointa v sushchestvuyushchiy servis.

**Inputs**:
- `<endpoint-name>`: Imya sozdavaemogo endpointa.
- `<api-type>` (optsionalno): Tip API (`rest`, `grpc`).
- `<method>` (optsionalno): HTTP metod dlya REST (`POST`, `GET`, i t.d.).

## 1. Kontrakty i DTO (API First) dlya `<endpoint-name>`
- Opredelite strukturu zaprosa (Request) i otveta (Response) v formate OpenAPI/Swagger ili `.proto`.
- Sozdayte klassy/struktury DTO (Data Transfer Objects) s pravilami validatsii na granitse (granichnyy sloy).

## 2. Domain / Application Layer
- Sozdayte Use Case ili Service klass, kotoryy prinimaet provalidirovannyy DTO.
- Napishite biznes-logiku vnutri servisa. Servis ne dolzhen znat o HTTP (req, res, headers) ili o spetsifike SQL bazy. On operiruet tolko domennymi sushchnostyami i vyzyvaet interfeysy repozitoriev/brokerov (Ports).

## 3. Infrastructure Layer
- Esli trebuetsya novaya interaktsiya s bazoy dannykh, dobavte metod v interfeys repozitoriya (v domain/application sloe).
- Realizuyte etot metod v konkretnom klasse repozitoriya (infrastructure sloe), napishite SQL zapros ili ORM vyzov. Uchtite N+1 i indeksy.

## 4. Presentation Layer (Controller/Handler)
- Sozdayte metod kontrollera.
- Privyazhite k routu (Route).
- Nastroyte avtorizatsiyu (RBAC/ABAC proverki).
- Kontroller poluchaet HTTP vyzov, vyzyvaet DI-konteyner dlya polucheniya Use Case, peredaet dannye, i konvertiruet rezultat obratno v HTTP Response s pravilnym status-kodom.

## 5. Testing
- Napishite **Unit-test** dlya Use Case, zamokav repozitoriy.
- Napishite **Integration-test** (ili E2E-test API) dlya sobrannogo endpointa, kotoryy vypolnyaet realnyy HTTP-zapros i proveryaet, chto sokhranyaetsya v Testcontainers-BD.

## 6. Review & Observability
- Ubedites, chto metriki dlya novogo routa sobirayutsya avtomaticheski (obychno zakryvaetsya middleware).
- Esli endpoint menyaet sostoyanie sistemy - sgenerirovano li domennoe sobytie dlya Kafka/NATS? (Esli primenimo).

## Svyazannye Navyki (Skills)
- Proektirovanie kontrakta: `backend/skills/api-design/SKILL.md`.
- Rabota s bazoy dannykh: `backend/skills/database-modeling/SKILL.md`.
- Asinkhronnaya otpravka sobytiy: `backend/skills/async-processing/SKILL.md`.
- Monitoring i logirovanie: `backend/skills/observability/SKILL.md`.

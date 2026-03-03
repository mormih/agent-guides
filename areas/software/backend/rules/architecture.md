# Rule: Backend Architecture (Microservices & Zero Trust)

**Priority**: P0 — Arkhitekturnye narusheniya blokiruyut deploy.

## Core Principles

1. **Microservices First**:
   - Kazhdyy servis dolzhen otvechat za edinuyu ogranichennuyu predmetnuyu oblast (Bounded Context).
   - Zapreshcheno ispolzovanie obshchikh baz dannykh mezhdu mikroservisami (Shared Database Anti-Pattern). Isklyuchenie: Read-only repliki dlya analitiki.
   - Nezavisimoe razvertyvanie (Independent Deployability). Obnovlenie odnogo servisa ne dolzhno trebovat obnovleniya drugikh.

2. **Zero Trust Architecture (ZTA)**:
   - Doveryay, no proveryay: ni odin zapros (dazhe iz vnutrenney seti ili ot drugogo mikroservisa) ne schitaetsya po umolchaniyu bezopasnym.
   - Vzaimnaya autentifikatsiya: vse kommunikatsii mezhdu servisami dolzhny osushchestvlyatsya cherez mTLS (Mutual TLS) ili podpisyvatsya tokenami (naprimer, JWT ili Service-to-Service tokeny).
   - Printsip minimalnykh privilegiy: kazhdyy servis dolzhen imet dostup tolko k tem resursam, kotorye emu absolyutno neobkhodimy.

3. **API & Communications**:
   - Sinkhronnoe vzaimodeystvie (REST, gRPC) dolzhno ispolzovatsya tolko togda, kogda otvet trebuetsya nemedlenno dlya prodolzheniya raboty polzovatelya.
   - Asinkhronnoe vzaimodeystvie (Event-Driven na baze Kafka/NATS/RabbitMQ) dolzhno byt standartom po umolchaniyu dlya mezhservisnoy kommunikatsii.
   - Obyazatelnoe ispolzovanie Circuit Breaker i Retries s Exponential Backoff dlya vsekh vneshnikh vyzovov.

4. **Multi-Language Environment**:
   - Dopuskaetsya ispolzovanie razlichnykh tekhnologiy (Python/FastAPI, Go, Node.js/NestJS, Java/Spring, Rust) v zavisimosti ot zadachi (naprimer, Rust/Go dlya vysokonagruzhennykh komponentov, Python dlya ML-inferensa).
   - Nezavisimo ot yazyka, servisy dolzhny soblyudat edinyy standart logirovaniya (JSON), metrik (Prometheus) i treysinga (OpenTelemetry).

## Service Template Structure
Dazhe v usloviyakh raznykh yazykov programmirovaniya, struktura kazhdogo servisa dolzhna stroitsya po printsipam Clean Architecture / Hexagonal Architecture:

```text
src/
├── app/               # Application-spetsifichnyy kod (zapusk servera, DI konteyner, konfiguratsiya)
├── domain/            # Biznes-sushchnosti i domennye pravila (bez vneshnikh zavisimostey)
├── application/       # Use Cases, DTOs, interfeysy portov (Ports)
├── infrastructure/    # Realizatsii portov: BD (Postgres, ClickHouse), brokery (NATS, Kafka)
└── presentation/      # Vneshnie interfeysy: REST Controllers, gRPC Handlers, Event Listeners
```

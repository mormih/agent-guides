# Rule: Backend Testing Pyramid

**Priority**: P1 — Kod bez polnogo testovogo pokrytiya (critical path) otklonyaetsya na revyu.

## Testing Layers

1. **Unit Testing** (Samyy bolshoy obem):
   - Izolirovannoe testirovanie biznes-logiki (Domain / Application layers).
   - Vse vneshnie zavisimosti (BD, API, brokery soobshcheniy) dolzhny byt zamokany.
   - Instrumenty: `pytest` (Python), `testing` (Go), `Jest/Vitest` (Node.js), `JUnit` (Java).

2. **Integration Testing** (Sredniy obem):
   - Testirovanie svyazki vashego koda s vneshney infrastrukturoy.
   - Ispolzovanie realnykh baz dannykh (cherez Testcontainers) obyazatelno. Ispolzovat in-memory BD (napr. SQLite vmesto Postgres) dlya integratsionnykh testov zapreshcheno.
   - Proveryaetsya vypolnenie SQL-zaprosov, rabota s Redis, ClickHouse, publikatsiya/chtenie iz NATS/Kafka.

3. **E2E Testing / API Testing** (Zhiznenno-vazhnye puti):
   - Testirovanie sobrannogo mikroservisa tselikom cherez ego vneshnie porty (REST/gRPC/GraphQL) s zapushchennym okruzheniem.

4. **SVT (Software Verification Testing) / Chaos Engineering**:
   - Testirovanie mikroservisnoy arkhitektury na nadezhnost pri otkazakh.
   - Proverka stsenariev: padenie bazy dannykh, nedostupnost sosednego servisa, network partition, nekorrektnye otvety. Udostoveritsya, chto srabatyvayut Circuit Breakers i Fallbacks.

## Guidelines

- **Coverage**: Minimalnoe pokrytie dlya kritichnykh komponentov (platezhi, autentifikatsiya) — **80%**. Dlya CRUD operatsiy dostatochno E2E testov.
- **Flaky Tests**: Nestabilnye testy dolzhny byt nemedlenno otklyucheny, pomecheny `@Skip`/`@Ignore` i peredany na dorabotku.
- **Factory/Fixtures**: Ispolzovat fabriki (FactoryBot, factory_boy) dlya generatsii testovykh dannykh, chtoby izbegat khrupkikh `INSERT` stsenariev.

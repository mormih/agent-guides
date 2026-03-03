# Rule: Data Access & State Management

**Priority**: P0 — Narusheniya raboty s dannymi vedut k potere ili nekonsistentnosti.

## Constraints

1. **Polyglot Persistence**:
   - **PostgreSQL**: Vystupaet v roli Primary Source of Truth dlya tranzaktsionnykh (OLTP) dannykh.
   - **Redis**: Ispolzuetsya strogo dlya keshirovaniya, rate-limiting, blokirovok (distributed locks) i tranzitnykh dannykh (Pub/Sub dlya nekritichnykh sobytiy). Ne ispolzovat Redis kak persistentnuyu BD.
   - **ClickHouse**: Primenyaetsya dlya analitiki, vremennykh ryadov (Time-Series) i obrabotki sobytiy bolshogo obema (OLAP). Pryamaya zapis iz biznes-tranzaktsiy v ClickHouse zapreshchena (ispolzovat asinkhronnuyu replikatsiyu cherez Kafka/NATS).

2. **Database Migrations Protocol**:
   - Migratsii dolzhny byt strogo versionirovany (naprimer, Flyway, Alembic, golang-migrate).
   - Vse migratsii skhemy dolzhny byt **obratno-sovmestimymi** (Backward Compatible). 
   - Udalenie kolonok ili izmenenie ikh tipa provoditsya v tri etapa (Expand and Contract pattern): 1) Dobavlenie novoy kolonki/tablitsy -> 2) Dvoynaya zapis -> 3) Udalenie staroy.

3. **Performance & Query Optimization**:
   - Strogiy zapret na N+1 problemu (Obyazatelnoe ispolzovanie DataLoader, `JOIN`, ili `Eager Loading`).
   - Otsutstvie `SELECT *`. Vse zaprosy dolzhny yavno ukazyvat vybiraemye polya.
   - Dlitelnye tranzaktsii zapreshcheny. I/O operatsii (vyzovy drugikh API) ne dolzhny nakhoditsya vnutri tranzaktsiy BD.

4. **Caching Strategy**:
   - Ispolzovanie patternov Cache-Aside ili Read-Through/Write-Through po umolchaniyu.
   - Vse zakeshirovannye dannye dolzhny imet TTL (Time To Live), chtoby izbezhat vechnogo chteniya ustarevshikh dannykh (Stale Data).

5. **Events & Queues (Kafka, RabbitMQ, NATS, Celery, BullMQ)**:
   - Vse sobytiya dolzhny publikovatsya v formate soglasovannoy skhemy (napr., Protobuf, Avro, ili validirovannyy JSON Schema).
   - Pattern **Outbox** ili **Listen to Yourself** obyazatelen pri publikatsii sobytiy, chtoby obespechit tranzaktsionnuyu garantiyu (ne otpravit sobytie, esli tranzaktsiya BD otkatilas).

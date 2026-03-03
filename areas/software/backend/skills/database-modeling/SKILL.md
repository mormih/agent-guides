# Skill: Database Modeling & Optimization

**Description**: Patterny proektirovaniya skhem i optimizatsii zaprosov dlya PostgreSQL i ClickHouse.

## PostgreSQL (OLTP)

1. **Normalizatsiya**:
   - Priderzhivatsya 3-y normalnoy formy (3NF), poka ne budet dokazano, chto denormalizatsiya strogo neobkhodima iz-za proizvoditelnosti zaprosov na chtenie.

2. **Indeksirovanie**:
   - Sozdavat indeksy (B-Tree) dlya poley, uchastvuyushchikh v `WHERE`, `JOIN` i `ORDER BY`.
   - Ispolzovat Composite Indexes dlya zaprosov, filtruyushchikh po neskolkim kolonkam. Poryadok kolonok v indekse vazhen (snachala naibolee selektivnye).
   - Primenyat Partial Indexes (naprimer: `CREATE INDEX idx_active_users ON users (id) WHERE status = 'active';`), chtoby ekonomit mesto i uskoryat poisk.
   - Unikalnye indeksy dolzhny ispolzovatsya na urovne BD (a ne tolko validatsiya v kode) dlya obespecheniya tselostnosti dannykh pri race conditions.

3. **Tipy Dannykh**:
   - Ispolzovat `UUIDv7` v kachestve Primary Key dlya raspredelennykh sistem (obespechivayut sortirovku po vremeni sozdaniya bez poteri proizvoditelnosti indeksov, v otlichie ot `UUIDv4`).
   - Ispolzovat `JSONB` tolko dlya skhemloss-dannykh (dynamic attributes), kogda struktura ne fiksirovana. Ne primenyat `JSONB`, esli po polyam neobkhodimy chastye filtratsii ili obnovleniya otdelnykh klyuchey.

4. **Tranzaktsii i Blokirovki**:
   - Primenyat Optimistic Concurrency Control (pole `version` ili `updated_at`) dlya zashchity ot poteryannykh obnovleniy na chtenie/zapis.
   - Ispolzovat `SELECT ... FOR UPDATE` (Pessimistic Locking) dlya garantii eksklyuzivnogo dostupa pri kritichnykh operatsiyakh na balans.

## ClickHouse (OLAP / Analytics)

1. **Storage Engines**:
   - Ispolzovat semeystvo dvizhkov `MergeTree` kak standart.
2. **Order By & Sorting Keys**:
   - Vybor klyucha sortirovki kriticheski vazhen. Vklyuchat te kolonki, po kotorym idet chastoe filtrovanie (date_time, event_type).
3. **Partitioning**:
   - Partitsionirovat dannye po vremeni (PARTITION BY `toYYYYMM(event_date)`), no ne sozdavat slishkom melkikh partitsiy (bolshe 100-1000 - plokho).
4. **Denormalization**:
   - Skhemy ClickHouse obychno predstavlyayut soboy shirokie tablitsy (Star Schema) ili ploskie Data Marts. `JOIN` operatsii v ClickHouse rabotayut khuzhe, chem v PostgreSQL. Zapisyvat v tablitsu ploskie denormalizovannye zapisi.

## Kontekst Vypolneniya (Inputs)
- Pri dobavlenii ili izmenenii tablitsy cherez migratsiyu (parametry `<table>`, `<name>` iz `add-migration`), primenyayte pravila dlya konkretnogo stolbtsa/indeksa, ne lomaya ostalnye tablitsy.
- Pri proektirovanii `<epic-name>` ili `<feature-name>`, opisyvayte tolko te tablitsy, kotorye zatragivayutsya etim biznes-protsessom.

# Workflow: Add Database Migration

**Description**: Protsess bezopasnogo izmeneniya skhemy BD bez dauntayma.

**Inputs**:
- `<table>`: Nazvanie tablitsy.
- `<change-type>`: Tip izmeneniya (`add-column`, `rename-column`, i t.d.).
- `<name>`: Nazvanie kolonki (i t.p.) dlya izmeneniya.

## 1. Otsenka Izmeneniy `<table>.<name>`
- Opredelite, lomaet li novaya struktura tekushchiy rabotayushchiy kod.
- Pereimenovanie kolonok ili tablits zapreshcheno za odin shag.

## 2. Sozdanie faylov migratsii
- Ispolzuyte instrument versionirovaniya (Flyway, Alembic, golang-migrate).
- Sozdayte fayl `V<version>__<description>.sql` (i optsionalno fayl dlya otkata `Undo`).
- Ubedites, chto migratsiya idempotentna, esli etogo ne predostavlyaet sam instrument neyavno.

## 3. Pattern Expand and Contract (Dlya lomayushchikh izmeneniy)
Esli vam nuzhno pereimenovat kolonku `title` v `name`, vy ne ispolzuete `ALTER TABLE RENAME COLUMN`. Vy delaete eto v 3 reliza:
  **Reliz 1 (Expand)**: Vy dobavlyaete kolonku `name`. Vy menyaete kod bekenda tak, chtoby on pisal dannye *v obe* kolonki, no chital tolko iz staroy `title`. Deploy. Obratnyy zapusk skripta, kotoryy kopiruet sushchestvuyushchie `title` v `name`.
  **Reliz 2 (Migrate Data & Switch)**: Vy menyaete kod bekenda tak, chtoby on teper chital iz novoy kolonki `name`. Deploy.
  **Reliz 3 (Contract)**: Vy udalyaete staruyu kolonku `title` iz koda i sozdaete migratsiyu bazy na ee udalenie (DROP COLUMN). Deploy.

## 4. Validatsiya
- Proverte migratsiyu lokalno na dampe bazy dannykh.
- Uchtite, chto nekotorye komandy (naprimer, dobavlenie indeksa na bolshuyu tablitsu) blokiruyut tablitsy (Table Lock). Dlya PostgreSQL vsegda ispolzuyte `CREATE INDEX CONCURRENTLY` v production-migratsiyakh.

## 5. Integratsiya
- Dobavte migratsiyu v PR. CI/CD payplayn dolzhen progonyat migratsii na svezhey testovoy BD pered progonom testov, chtoby ubeditsya v otsutstvii sintaksicheskikh oshibok SQL.

## Svyazannye Navyki (Skills)
- Izuchite pravila migratsiy v `backend/rules/data_access.md`.
- Dlya vybora pravilnykh indeksov i tipov dannykh ispolzuyte `backend/skills/database-modeling/SKILL.md`.

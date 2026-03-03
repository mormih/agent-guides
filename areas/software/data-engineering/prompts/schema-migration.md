# Prompt: `/schema-migration`

## Pereimenovanie kolonki

```
/schema-migration --table dim_users --change rename-column

Pereimenovat: user_email → email_hashed (tip VARCHAR sokhranyaetsya).
Prichina: korporativnyy standart imenovaniya PII-kolonok.

1. Blast radius cherez /lineage-trace: spisok downstream
2. Uvedomit downstream vladeltsev (minimum 5 business days notice)
3. Phased migration: dobavit novuyu kolonku → migrirovat downstream → deprecated staruyu → drop cherez 30 dney
4. Podgotovit SQL dlya kazhdoy fazy
```

## Smena tipa dannykh

```
/schema-migration --table fct_orders --change change-type

Izmenit tip: amount FLOAT → amount NUMERIC(12,4).
Prichina: poterya tochnosti pri finansovykh raschetakh.
Eto breaking change — nuzhen versioned podkhod.
Podgotov: stg_orders_v2 s pravilnym tipom, migration script dlya istoricheskikh dannykh.
```

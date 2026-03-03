# Prompt: `/add-migration`

## Dobavlenie novoy kolonki

```
/add-migration --table users --change add-column --name status

Dobav kolonku `status` v tablitsu `users`.
- Tip: VARCHAR(50).
- Povedenie: Ne dolzhno lokirovat tablitsu na prode pri sozdanii dlya bolshikh tablits PostgreSQL.
- Uchti pravila iz `backend/skills/database-modeling/SKILL.md`.
```

## Izmenenie sushchestvuyushchey kolonki (Expand-and-Contract)

```
/add-migration --table products --change rename-column --from price --to price_usd

Sgeneriruy Phase 1 (Expand) skript dlya pereimenovaniya `price` v `price_usd`.
Sozday novuyu kolonku, trigger dlya sinkhronizatsii staroy i novoy kolonok, i napishi instruktsiyu po obnovleniyu bekend-koda na dvoynuyu zapis. 
Soglasuy eto s pravilom Backward Compatible Migrations v `backend/rules/data_access.md`.
```

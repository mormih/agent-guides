# Prompt: `/drift-check`

## Planovaya proverka

```
/drift-check --env production

Prover drift konfiguratsii production okruzheniya.
Klassifitsiruy kazhdyy drift: A (tegi) / B (konfig) / C (ruchnoe sozdanie) / D (udalenie).
Category D → nemedlenno eskalirovat v #infra-alerts i sozdat P0 intsident.
Category B i C → GitHub issues, assign @platform-team.
Category A → tolko otchet.
```

## S avtoispravleniem

```
/drift-check --env staging --fix

Prover i avtomaticheski isprav drift v staging.
Avto-primenyat TOLKO Category A (tag-only drift).
Dlya B/C/D — tolko otchet, nikakikh izmeneniy bez ruchnogo approve.
```

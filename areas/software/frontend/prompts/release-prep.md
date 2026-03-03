# Prompt: `/release-prep`

## Standartnyy reliz

```
/release-prep 2.4.0

Podgotov frontend k relizu 2.4.0.
Quality gates: TypeScript, ESLint, Vitest (100% pass), coverage baseline ne upala.
Performance: Core Web Vitals po Lighthouse CI, bundle budget.
A11y: sweep po routam /home /catalog /product /checkout /account — blokirovat na Level A violations.
Changelog: iz git log s tega v2.3.0, kategorii feat/fix/perf/breaking.
Vyvod: Go/No-Go po kazhdomu gate s obosnovaniem.
```

## Khotfiks-reliz

```
/release-prep 2.3.8

HOTFIX reliz. Tolko kritichnye proverki: TypeScript, testy, smoke test na staging.
Bundle analyze i visual regression — propustit.
Changelog: tolko ispravlenie ENG-4521 (payment calculation bug).
```

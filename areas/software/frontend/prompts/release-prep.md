# Prompt: `/release-prep`

## Стандартный релиз

```
/release-prep 2.4.0

Подготовь frontend к релизу 2.4.0.
Quality gates: TypeScript, ESLint, Vitest (100% pass), coverage baseline не упала.
Performance: Core Web Vitals по Lighthouse CI, bundle budget.
A11y: sweep по роутам /home /catalog /product /checkout /account — блокировать на Level A violations.
Changelog: из git log с тега v2.3.0, категории feat/fix/perf/breaking.
Вывод: Go/No-Go по каждому gate с обоснованием.
```

## Хотфикс-релиз

```
/release-prep 2.3.8

HOTFIX релиз. Только критичные проверки: TypeScript, тесты, smoke тест на staging.
Bundle analyze и visual regression — пропустить.
Changelog: только исправление ENG-4521 (payment calculation bug).
```

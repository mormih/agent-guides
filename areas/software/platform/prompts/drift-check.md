# Prompt: `/drift-check`

## Плановая проверка

```
/drift-check --env production

Проверь drift конфигурации production окружения.
Классифицируй каждый drift: A (теги) / B (конфиг) / C (ручное создание) / D (удаление).
Category D → немедленно эскалировать в #infra-alerts и создать P0 инцидент.
Category B и C → GitHub issues, assign @platform-team.
Category A → только отчёт.
```

## С автоисправлением

```
/drift-check --env staging --fix

Проверь и автоматически исправь drift в staging.
Авто-применять ТОЛЬКО Category A (tag-only drift).
Для B/C/D — только отчёт, никаких изменений без ручного approve.
```

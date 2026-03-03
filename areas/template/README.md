# Template Area Blueprint

Шаблон для создания новых областей в унифицированном формате `areas/<area>/<specialization>/`.

## Целевая структура

```text
areas/<area>/
  <specialization>/
    AGENTS.md
    rules/
    skills/
    workflows/
    prompts/
```

## Как использовать

1. Создайте директорию области: `areas/<area>/`.
2. Добавьте одну или несколько специализаций (`backend`, `frontend`, `domain`, ...).
3. Для каждой специализации заполните:
   - `AGENTS.md` (полный шаблон инструкции для генерации итогового project `AGENTS.md`),
   - `rules/`,
   - `skills/`,
   - `workflows/`,
   - `prompts/`.
4. Проверьте установку через `agentos-install.sh`:

```bash
./agentos-install.sh install \
  --project-dir /tmp/demo \
  --agent-os default \
  --areas <area> \
  --specializations <area>.<specialization>
```

## Quality gate

- Минимум 3 правила в `rules/`.
- Минимум 3 навыка в `skills/`.
- Минимум 3 workflow в `workflows/`.
- Минимум 3 prompt в `prompts/`.
- `AGENTS.md` специализации содержит Build/Test/Lint, coding style, security, architecture, testing.

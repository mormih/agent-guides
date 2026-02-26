# Template Area Blueprint

Этот каталог — универсальный шаблон новой предметной области по образцу `areas/software/*`.

Цель: быстро создавать новые области (например, `marketing`, `business`, `finance`) в едином формате:

- `modules/<domain>/...` — глубокие артефакты (rules / skills / workflows / prompts),
- `flat/<domain>/...` — компактная «single-file + prompts» версия для быстрого старта,
- совместимость со сценарием установки через `agentos-install.sh --source ...`.

## Структура шаблона

```text
areas/template-area/
├── README.md
├── modules/
│   └── domain/
│       ├── README.md
│       ├── rules/
│       │   └── core-rule-template.md
│       ├── skills/
│       │   └── skill-template.md
│       ├── workflows/
│       │   └── workflow-template.md
│       └── prompts/
│           ├── system-prompt-template.md
│           └── task-prompt-template.md
└── flat/
    └── domain/
        ├── AGENTS.md
        └── PROMPTS.md
```

## Как использовать

1. Скопируй `areas/template-area` в новую область, например `areas/marketing`.
2. Переименуй `domain` в нужный поддомен (например, `brand`, `growth`, `analytics`).
3. Замени все плейсхолдеры:
   - `<AREA_NAME>` — название области,
   - `<DOMAIN_NAME>` — название домена,
   - `<RULE_*>`, `<SKILL_*>`, `<WORKFLOW_*>`, `<TASK_*>` — конкретные сущности.
4. Заполни содержимое артефактов доменной экспертизой.
5. Для установки в проект используй:
   - модульный формат: `./agentos-install.sh install --source ./areas/<AREA_NAME>/modules/<DOMAIN_NAME> --target <project> --format all`
   - flat формат: `./agentos-install.sh install --source ./areas/<AREA_NAME>/flat/<DOMAIN_NAME> --target <project> --format codex`

## Минимальный quality-gate для новой области

- Есть минимум 3 `rules` (инварианты качества/безопасности).
- Есть минимум 3 `skills` (точечные компетенции).
- Есть минимум 3 `workflows` (повторяемые процессы).
- Есть минимум 3 `prompts` (инициализация + task-specific шаблоны).
- `flat/<domain>/AGENTS.md` согласован с `modules/<domain>/*`.

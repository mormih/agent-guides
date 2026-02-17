# `.agent-os` Prompt Index

> Каждый workflow имеет файл с готовыми промптами в директории `prompts/` своего домена.
> Копируй нужный промпт → вставляй в KiloCode / Cursor / Antigravity.

---

## Карта всех промптов

### Frontend Engineering

| Workflow              | Файл                                     | Когда использовать                           |
|:----------------------|:-----------------------------------------|:---------------------------------------------|
| `/scaffold-component` | `frontend/prompts/scaffold-component.md` | Создать новый компонент с тестами и stories  |
| `/visual-regression`  | `frontend/prompts/visual-regression.md`  | Baseline / сравнение / approve diff'ов       |
| `/bundle-analyze`     | `frontend/prompts/bundle-analyze.md`     | Анализ размера JS-бандла в PR или full аудит |
| `/a11y-fix`           | `frontend/prompts/a11y-fix.md`           | Аудит и исправление WCAG нарушений           |
| `/release-prep`       | `frontend/prompts/release-prep.md`       | Подготовка релиза с quality gates            |

### Platform Engineering (DevOps/IaC)

| Workflow             | Файл                                    | Когда использовать                                 |
|:---------------------|:----------------------------------------|:---------------------------------------------------|
| `/provision-env`     | `platform/prompts/provision-env.md`     | Preview для PR или инициализация окружения         |
| `/drift-check`       | `platform/prompts/drift-check.md`       | Плановая проверка или обнаружение ручных изменений |
| `/deploy-production` | `platform/prompts/deploy-production.md` | Canary или hotfix деплой в production              |
| `/cost-audit`        | `platform/prompts/cost-audit.md`        | Ежемесячный аудит или расследование аномалии       |
| `/incident-response` | `platform/prompts/incident-response.md` | P0/P1 инцидент, деградация, outage                 |

### Security (DevSecOps)

| Workflow               | Файл                                      | Когда использовать                          |
|:-----------------------|:------------------------------------------|:--------------------------------------------|
| `/security-scan`       | `security/prompts/security-scan.md`       | SAST/deps/secrets/IaC сканирование          |
| `/threat-model-review` | `security/prompts/threat-model-review.md` | STRIDE анализ для новой фичи или интеграции |
| `/pen-test-sim`        | `security/prompts/pen-test-sim.md`        | OWASP Top 10 automated pentest на staging   |
| `/secret-rotation`     | `security/prompts/secret-rotation.md`     | Плановая или экстренная ротация секретов    |
| `/compliance-report`   | `security/prompts/compliance-report.md`   | SOC2 / GDPR / PCI self-assessment отчёт     |

### Data Engineering

| Workflow                 | Файл                                                | Когда использовать                                          |
|:-------------------------|:----------------------------------------------------|:------------------------------------------------------------|
| `/new-model`             | `data-engineering/prompts/new-model.md`             | Scaffolding dbt модели (staging/mart/intermediate)          |
| `/backfill-data`         | `data-engineering/prompts/backfill-data.md`         | Ретроспективный пересчёт или восстановление после инцидента |
| `/lineage-trace`         | `data-engineering/prompts/lineage-trace.md`         | Blast radius анализ изменения колонки/таблицы               |
| `/data-quality-incident` | `data-engineering/prompts/data-quality-incident.md` | Дубликаты, SLA breach, аномальные данные                    |
| `/schema-migration`      | `data-engineering/prompts/schema-migration.md`      | Breaking/non-breaking schema change с migration plan        |

### MLOps

| Workflow               | Файл                                   | Когда использовать                                  |
|:-----------------------|:---------------------------------------|:----------------------------------------------------|
| `/train-experiment`    | `mlops/prompts/train-experiment.md`    | Новый эксперимент обучения или плановый retrain     |
| `/evaluate-model`      | `mlops/prompts/evaluate-model.md`      | Оценка challenger vs champion или для стейкхолдеров |
| `/deploy-endpoint`     | `mlops/prompts/deploy-endpoint.md`     | Shadow mode или canary деплой модели                |
| `/champion-challenger` | `mlops/prompts/champion-challenger.md` | A/B тест двух версий модели                         |
| `/model-incident`      | `mlops/prompts/model-incident.md`      | Drift, деградация, outage модели                    |

### Mobile Development

| Workflow            | Файл                                 | Когда использовать                      |
|:--------------------|:-------------------------------------|:----------------------------------------|
| `/release-build`    | `mobile/prompts/release-build.md`    | Production сборка iOS/Android/обеих     |
| `/ota-update`       | `mobile/prompts/ota-update.md`       | JS-only hotfix через OTA без App Store  |
| `/crash-triage`     | `mobile/prompts/crash-triage.md`     | Разбор crash после релиза, символикация |
| `/store-submission` | `mobile/prompts/store-submission.md` | Сабмит в App Store или Google Play      |
| `/device-testing`   | `mobile/prompts/device-testing.md`   | Регресс или smoke на device farm        |

### QA & Test Automation

| Workflow                   | Файл                                    | Когда использовать                            |
|:---------------------------|:----------------------------------------|:----------------------------------------------|
| `/regression-suite`        | `qa/prompts/regression-suite.md`        | Critical/full E2E регресс перед деплоем       |
| `/smoke-test`              | `qa/prompts/smoke-test.md`              | Post-deploy проверка или мониторинг окружения |
| `/performance-audit`       | `qa/prompts/performance-audit.md`       | Load / spike / soak тест endpoint'а           |
| `/flakiness-investigation` | `qa/prompts/flakiness-investigation.md` | Расследование нестабильного теста             |
| `/test-coverage-report`    | `qa/prompts/test-coverage-report.md`    | Coverage сравнение с main или аудит модуля    |

---

## Как пользоваться

**Минимальный промпт** — достаточно для стандартного случая:

```
/workflow-name <обязательный-параметр>
```

**Обогащённый промпт** — добавь контекст из списка ниже когда это повышает качество результата:

| Добавь                      | Зачем                                                      |
|:----------------------------|:-----------------------------------------------------------|
| Номер тикета (ENG-1234)     | Трассируемость в commit messages и issue links             |
| Причину изменения           | Помогает выбрать правильную стратегию (hotfix vs плановый) |
| Специфические пороги        | Если стандартные SLO не подходят для конкретного контекста |
| Downstream зависимости      | Чтобы учесть blast radius заранее                          |
| Slack-канал для уведомлений | Куда слать результаты и алерты                             |

**Дефолты при пропуске флагов:**

| Workflow             | Default                       |
|:---------------------|:------------------------------|
| `/deploy-production` | `--strategy canary`           |
| `/drift-check`       | только отчёт, без `--fix`     |
| `/security-scan`     | `--scope all --pr`            |
| `/regression-suite`  | `--scope critical`            |
| `/cost-audit`        | `--period last-month`         |
| `/provision-env`     | `--env preview`               |
| `/deploy-endpoint`   | `--shadow` (безопасный старт) |
| `/ota-update`        | staged rollout 5%→20%→100%    |

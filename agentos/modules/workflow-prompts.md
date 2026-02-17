# `.agent-os` Workflow Prompts

> Готовые промпты для вызова каждого workflow по всем доменам.
> Копируй нужный промпт → вставляй в KiloCode / Cursor / Antigravity.
> Параметры в `<угловых скобках>` — заменяй на реальные значения.

---

## 📁 Навигация по доменам

- [Frontend Engineering](#frontend-engineering)
- [Platform Engineering (DevOps/IaC)](#platform-engineering-devopsiac)
- [Security (DevSecOps)](#security-devsecops)
- [Data Engineering](#data-engineering)
- [MLOps](#mlops)
- [Mobile Development](#mobile-development)
- [QA & Test Automation](#qa--test-automation)

---

## Frontend Engineering

### `/scaffold-component` — Создать новый компонент

**Минимальный вызов:**

```
/scaffold-component SearchInput
```

**Полный вызов:**

```
/scaffold-component SearchInput --type molecule --with-story

Создай компонент SearchInput:
- Тип: molecule (принимает props onSearch и placeholder)
- Включает debounce 300ms на вызов onSearch
- Включить Storybook story с вариантами: default, with placeholder, loading state
- Добавить тест на: рендер, ввод текста, вызов onSearch после debounce, очистку поля
```

**С контекстом проекта:**

```
/scaffold-component UserAvatarDropdown --type organism

Компонент показывает аватар пользователя. При клике — выпадающее меню с пунктами:
"Profile", "Settings", "Logout". Получает: user: User, onLogout: () => void.
Используем compound components pattern. Меню закрывается по клику вне и по Escape.
Добавить aria-label на trigger кнопку и role="menu" на список.
```

---

### `/visual-regression` — Визуальная регрессия

**Запустить сравнение с baseline:**

```
/visual-regression --compare

Запусти визуальное сравнение для всех компонентов, затронутых текущим PR.
Порог: любое изменение > 0.1% пикселей = DIFF.
Сформируй HTML-отчёт с side-by-side сравнением и прикрепи summary к PR.
```

**Обновить baseline после намеренных изменений:**

```
/visual-regression --approve

Мы намеренно обновили цветовую схему бренда (brand-500: #2563eb → #3b82f6).
Одобри все diff'ы в компонентах Button, Badge, Link.
Обнови baseline snapshots.
```

**Установить новый baseline:**

```
/visual-regression --baseline

Первый запуск visual regression для этого репозитория.
Сделай baseline screenshots для всех существующих Storybook stories.
Разрешения: 375px (mobile), 768px (tablet), 1440px (desktop).
```

---

### `/bundle-analyze` — Анализ размера бандла

**Для текущего PR:**

```
/bundle-analyze --pr

Проанализируй влияние текущих изменений на размер JS-бандла.
Сравни с baseline ветки main.
Порог: любое увеличение chunk'а > 5 KB gzipped — флагировать.
Предложи конкретные оптимизации с оценкой экономии в KB.
```

**Полный аудит:**

```
/bundle-analyze --full

Полный анализ production бандла.
Найди: дубликаты зависимостей, неиспользуемые импорты, возможности для tree-shaking.
Отдельно проверь: есть ли moment.js (заменить на date-fns), lodash без tree-shaking, @mui полный импорт.
Выдай отчёт: chunk name | текущий размер | потенциальный размер | действие.
```

---

### `/a11y-fix` — Исправление доступности

**Для конкретного компонента:**

```
/a11y-fix --file src/components/DataTable/DataTable.tsx

Проаудируй компонент DataTable на нарушения WCAG 2.1 AA.
Автоматически исправь: отсутствующие aria-label, alt-тексты, tabindex > 0.
Для нарушений требующих ручного исправления — дай конкретные примеры кода.
```

**Для страницы целиком:**

```
/a11y-fix --route /checkout

Проаудируй страницу Checkout (/checkout) на доступность.
Особое внимание: форма с полями карты, шаги wizard, сообщения об ошибках валидации.
Убедись что все ошибки формы анонсируются через aria-live.
Выдай: до/после по количеству нарушений, список исправлений.
```

---

### `/release-prep` — Подготовка релиза

```
/release-prep 2.4.0

Подготовь frontend к релизу версии 2.4.0:
1. Прогони все quality gates (TS, lint, tests, coverage)
2. Проверь performance budget — Core Web Vitals по Lighthouse CI
3. A11y sweep по всем основным роутам (/home, /catalog, /product, /checkout, /account)
4. Сгенерируй CHANGELOG.md из git log с последнего тега v2.3.0
5. Выдай: Go/No-Go решение с обоснованием по каждому gate
```

---

## Platform Engineering (DevOps/IaC)

### `/provision-env` — Создать окружение

**Preview-окружение для PR:**

```
/provision-env --env preview --branch feature/user-notifications

Подними ephemeral окружение для ветки feature/user-notifications.
Stack: EKS + RDS PostgreSQL + ElastiCache Redis.
Зарегистрируй subdomain: user-notifications.preview.mycompany.com
Оцени стоимость окружения в месяц перед созданием.
После успешного создания — запусти smoke тесты и отпишись в PR.
```

**Инициализация staging:**

```
/provision-env --env staging

Инициализируй staging окружение с нуля.
Region: eu-west-1. Используй модули из terraform/modules/.
Применяй все теги: Owner=platform-team, Environment=staging, CostCenter=engineering.
После применения — выведи все outputs (endpoints, ARNs) и сохрани в SSM Parameter Store.
```

---

### `/drift-check` — Проверка дрейфа конфигурации

**Плановая проверка:**

```
/drift-check --env production

Проверь дрейф конфигурации production окружения.
Классифицируй каждый найденный drift: A (только теги), B (изменение конфига), C (ручное создание), D (удаление).
Категорию D — эскалировать немедленно в #infra-alerts.
Для B и C — создай GitHub issues с деталями и assign на @platform-team.
```

**Автоматическое исправление safe drift:**

```
/drift-check --env staging --fix

Проверь и автоматически исправь drift в staging.
Авто-фикс применять только для Category A (tag-only drift).
Для остальных категорий — только отчёт, без изменений.
```

---

### `/deploy-production` — Деплой в продакшн

**Canary деплой:**

```
/deploy-production --version v2.4.0 --strategy canary

Деплой версии v2.4.0 в production через canary стратегию.
Canary порог: error rate delta > 0.5% или p99 latency delta > 500ms → авторолбэк.
Выдержка на каждом этапе: 10% → 5 мин → 25% → 2 мин → 50% → 2 мин → 100%.
После успешного деплоя — уведомить #deployments с diff-ссылкой.
```

**Хотфикс (ускоренный деплой):**

```
/deploy-production --version v2.3.8 --strategy canary

HOTFIX: критический баг в payment flow (ticket: ENG-4521).
Версия v2.3.8 прошла smoke тесты в staging.
Используй ускоренный canary: 10% → 2 мин → 100%.
Мониторить особенно: /api/payments/* error rate и checkout conversion.
```

---

### `/cost-audit` — Аудит расходов

**Ежемесячный отчёт:**

```
/cost-audit --period last-month --account all

Ежемесячный аудит cloud-расходов за прошлый месяц.
Группировка: по сервису, по environment (staging/production), по team-тегу.
Найди: idle ресурсы, неиспользуемые EBS volumes, oversized инстансы (CPU < 10% за 30 дней).
Выдай топ-10 возможностей для экономии с оценкой в $/мес.
```

**Расследование аномалии:**

```
/cost-audit --period last-week --account production

Аномальный рост расходов на 40% за последнюю неделю.
Найди причину: какой сервис/ресурс дал основной прирост?
Сравни с предыдущей неделей. Выдай конкретный ресурс и рекомендацию.
```

---

### `/incident-response` — Управление инцидентом

**P0 инцидент:**

```
/incident-response --severity P0 --service api

P0 ИНЦИДЕНТ: API вернул 5xx rate = 35% за последние 10 минут.
Сервис: orders-api. Начало: примерно 14:32 UTC.
Последний деплой: v2.3.7, 2 часа назад.
Создай incident channel, сформируй топ-3 гипотезы, выдай команды для диагностики.
```

**P1 деградация:**

```
/incident-response --severity P1 --service db

P1: p99 latency базы данных выросла с 50ms до 8s.
Симптомы: медленные запросы, connection pool exhaustion в logs.
Выдай runbook для диагностики DB: проверка активных запросов, блокировок, размера пула.
```

---

## Security (DevSecOps)

### `/security-scan` — Полное сканирование

**Для PR:**

```
/security-scan --scope all --pr

Запусти полное сканирование безопасности для текущего PR:
- SAST: semgrep с ruleset security-audit
- Зависимости: snyk test + npm audit
- Секреты: trufflehog на последние 50 коммитов
- IaC: checkov на terraform/ директорию

Critical findings → заблокировать merge.
High findings → комментарий с SLA 72 часа.
Сохрани отчёт в .security/scan-{timestamp}.json
```

**Только зависимости:**

```
/security-scan --scope deps --full

Аудит всех зависимостей проекта на CVE.
Проверь: npm пакеты, Docker base images, Python requirements.
Для каждой Critical CVE — найди patched версию или альтернативу.
Выдай таблицу: пакет | CVE | severity | fix версия | действие.
```

---

### `/threat-model-review` — Анализ угроз

```
/threat-model-review --feature payment-splitting

Проведи threat modeling для новой фичи "Payment Splitting":
Описание: пользователь может разделить платёж между несколькими участниками.
Каждый участник получает ссылку-инвайт и оплачивает свою часть независимо.

Данные: сумма платежа, email участников, статус оплаты каждого.
Границы доверия: публичный invite link → authenticated checkout.

Применить STRIDE ко всем trust boundaries.
Выдай threat model документ в .security/threat-models/payment-splitting.md
```

---

### `/pen-test-sim` — Симуляция пентеста

```
/pen-test-sim --target https://staging.mycompany.com --scope owasp-top-10

Запусти automated pentest simulation на staging окружении.
Особое внимание:
- A01: IDOR на /api/orders/{id}, /api/users/{id}, /api/invoices/{id}
- A03: SQLi и XSS на все формы и search параметры
- A07: брутфорс защита на /auth/login (rate limiting)

Не трогать: /admin/* (отдельный scope).
Выдай OWASP-format отчёт с CVSS score для каждого finding.
```

---

### `/secret-rotation` — Ротация секретов

**Плановая ротация:**

```
/secret-rotation --secret-name prod/api/database

Ротация production database credentials.
Текущий секрет: prod/api/database в AWS Secrets Manager.
Использовать dual-read window: приложение должно принимать оба credentials во время переходного периода.
После успешной валидации — отозвать старый секрет.
Зафиксировать в secret inventory: след. ротация через 90 дней.
```

**Экстренная ротация:**

```
/secret-rotation --secret-name prod/api/stripe --emergency

СРОЧНО: Stripe API key мог быть скомпрометирован (попал в git history).
Немедленная ротация без dual-read window.
Допустим кратковременный restart сервиса.
Параллельно — проаудируй git history на наличие секрета (последние 200 коммитов).
```

---

### `/compliance-report` — Отчёт соответствия

```
/compliance-report --standard soc2 --period Q1-2026

Сформируй SOC2 Type II отчёт за Q1 2026.
Собери evidence по контролам:
- CC6: логическая и физическая защита доступа (CloudTrail, IAM policies)
- CC7: system operations (incident logs, monitoring alerts)
- CC8: change management (deployment history, PR approvals)

Для каждого контрола: статус (Compliant/Partial/Non-Compliant) + evidence.
Пометь контролы требующие ручного evidence (training records, legal docs).
```

---

## Data Engineering

### `/new-model` — Создать dbt-модель

**Staging модель:**

```
/new-model stg_payments --layer staging --source raw_payments

Создай staging модель для платежей из источника raw_payments.
Переименовать: payment_id → id, payment_amount → amount_usd, payment_ts → paid_at.
Привести типы: amount_usd → NUMERIC(10,2), paid_at → TIMESTAMP.
Дедупликация по payment_id (оставить последнюю запись по updated_at).
Добавить тест: unique + not_null на id, accepted_values на status.
```

**Mart-модель:**

```
/new-model fct_daily_revenue --layer mart

Создай mart-модель для ежедневной выручки.
Grain: один ряд на дату + currency.
Источники: ref('stg_payments') + ref('dim_currencies').
Метрики: total_amount_usd, transaction_count, avg_transaction_usd.
Материализация: incremental, partition by date.
Добавить recency тест: данные не старше 26 часов.
```

---

### `/backfill-data` — Бэкфилл данных

```
/backfill-data --model fct_orders --start 2025-01-01 --end 2025-06-30

Бэкфилл модели fct_orders за H1 2025.
Причина: ретроспективно применяем новую бизнес-логику расчёта скидок.

Перед выполнением:
1. Оцени blast radius: какие downstream модели зависят от fct_orders
2. Рассчитай объём данных и время выполнения
3. Предложи оптимальный batch size (без OOM)

Выполнять батчами по 1 месяцу. После каждого батча — проверять уникальность ключей.
Запускать в off-peak часы (после 22:00 UTC).
```

---

### `/lineage-trace` — Трассировка lineage

**Влияние изменения колонки:**

```
/lineage-trace --column stg_orders.discount_type --direction downstream

Оцени blast radius изменения колонки discount_type в stg_orders.
Планируем: переименовать discount_type → promotion_type и изменить enum значения.
Найди все downstream модели, дашборды и ML-фичи, использующие эту колонку.
Сформируй migration checklist и оцени усилие (S/M/L).
```

**Трассировка источника:**

```
/lineage-trace --column fct_revenue.net_amount_usd --direction upstream

Откуда берётся колонка net_amount_usd в fct_revenue?
Проследи upstream до исходного source-таблицы.
Какие трансформации применяются по пути? Где происходит расчёт?
```

---

### `/data-quality-incident` — Инцидент качества данных

```
/data-quality-incident --model fct_orders --type duplicate

ИНЦИДЕНТ: обнаружены дубликаты в fct_orders за 2026-02-15.
Симптомы: row count в 2.3x больше обычного, бизнес метрика "orders/day" завышена.
Downstream: финансовый дашборд, ML-модель прогноза спроса.

1. Scope: сколько партиций затронуто?
2. Root cause: pipeline code? upstream дублирование? ошибка деплоя?
3. Quarantine: пометить затронутые данные, уведомить downstream потребителей
4. После фикса — запустить валидацию уникальности
```

---

### `/schema-migration` — Миграция схемы

```
/schema-migration --table dim_users --change rename-column

Нужно переименовать колонку в dim_users:
  user_email → email_hashed (+ тип остаётся VARCHAR)
  
Причина: приводим к корпоративному стандарту именования PII-колонок.

1. Оцени blast radius через /lineage-trace
2. Уведоми downstream владельцев (дай мне список)
3. Предложи phased migration plan с timeline
4. Подготовь SQL для каждой фазы
```

---

## MLOps

### `/train-experiment` — Запуск обучения

```
/train-experiment --model churn-predictor --config config/xgboost_v3.yaml

Запусти эксперимент обучения churn-predictor с конфигом xgboost_v3.yaml.
Изменения vs предыдущий run: добавили 3 новых фичи (days_since_last_login, device_type, plan_upgrade_count).
Данные: snapshot v2026-02-01, train/val/test split 70/15/15.
Random seed: 42. Compute: GPU cluster, max 4 часа.

После обучения — автоматически запусти /evaluate-model и сравни с текущим champion.
```

---

### `/evaluate-model` — Оценка модели

**Стандартная оценка:**

```
/evaluate-model --run-id abc123def456 --compare-to champion

Оцени модель из run abc123def456 и сравни с текущим Production champion.
Primary metric: AUC-ROC.
Business metric: "Revenue retained at top-20% predicted churners".
Fairness analysis: по сегментам plan_type (free/pro/enterprise) и country_region.

Если demographic parity diff > 0.1 — пометить как NEEDS_REVIEW (не блокировать автоматически, но требует ручного approve).
```

**Только бизнес-метрики:**

```
/evaluate-model --run-id abc123def456

Сфокусируй оценку на бизнес-метриках для стейкхолдеров (не ML-аудитория):
- Сколько пользователей корректно идентифицируем как churners в топ-20% скора?
- Какой % реального churn мы ловим (recall)?
- Сколько "ложных тревог" на 1000 предсказаний (false positive rate)?
- Оцени потенциальный revenue impact при ROI retention campaign = $50/user.
```

---

### `/deploy-endpoint` — Деплой модели

**Через shadow mode:**

```
/deploy-endpoint --model churn-predictor --run-id abc123def456 --shadow

Задеплой модель в shadow mode на 48 часов.
Shadow: 100% трафика к текущему champion, параллельно — зеркало запросов на challenger (без ответа клиенту).
Мониторить: prediction distribution, latency (p99 < 150ms), error rate.
Через 48 часов — отчёт о расхождениях между champion и challenger.
```

**Canary деплой после shadow:**

```
/deploy-endpoint --model churn-predictor --run-id abc123def456 --canary

Shadow завершён, расхождение < 5%, модель одобрена.
Запускай canary: 5% → 30 мин мониторинга → 20% → 30 мин → 50% → 1 час → 100%.
Rollback триггер: prediction drift PSI > 0.2 или error rate > 1%.
После 100% — обновить monitoring baseline под новую модель.
```

---

### `/champion-challenger` — A/B тест моделей

```
/champion-challenger --champion churn-predictor-v2 --challenger churn-predictor-v3 --duration 14d

Запусти A/B тест двух версий churn-predictor на 14 дней.
Traffic split: 50/50, hash by user_id (consistent assignment).

Primary metric: 30-day retention rate среди пользователей, которым показали retention offer на основе предсказания.
Guardrail metrics: p99 latency < 200ms, prediction error rate < 0.5%.

Минимальный размер выборки для significance: рассчитай (80% power, α=0.05, MDE=2%).
Промежуточные проверки: на 7-й и 14-й день.
```

---

### `/model-incident` — Инцидент модели

**Drift инцидент:**

```
/model-incident --model fraud-detector --type drift

ИНЦИДЕНТ: fraud-detector PSI > 0.25 на feature "transaction_amount" последние 3 часа.
Возможная причина: новый тип транзакций после вчерашнего продуктового релиза.

1. Scope: какие предсказания затронуты? Какой % трафика?
2. Немедленно: следует ли откатить на previous champion?
3. Долгосрочно: retrain с новыми данными или feature engineering?
```

**Деградация качества:**

```
/model-incident --model churn-predictor --type degradation

Бизнес сообщает: retention campaign по модельным предсказаниям дала только 12% конверсию vs ожидаемых 35%.
Период: последние 2 недели.
Проверь: изменился ли input feature distribution? Есть ли training-serving skew?
Сравни predictions distribution: 2 недели назад vs сейчас.
```

---

## Mobile Development

### `/release-build` — Сборка релиза

**Обе платформы:**

```
/release-build --platform all --env production --version 3.2.0

Собери production builds версии 3.2.0 для iOS и Android.

iOS:
- Scheme: MyApp-Production
- Signing: Distribution certificate + App Store provisioning profile
- Export: App Store Connect

Android:
- Flavor: production
- Sign: release keystore из CI secrets (ANDROID_KEYSTORE_*)
- Output: .aab bundle

После сборки — установи на физические устройства и прогони Detox smoke тесты.
Если все тесты зелёные — загрузи в TestFlight (iOS) и Firebase App Distribution (Android).
```

---

### `/ota-update` — OTA обновление

```
/ota-update --bundle js-only --target 100%

OTA обновление: hotfix для бага в корзине (неверный расчёт скидки).
Подтверди что изменения только в JS (нет новых native dependencies).
Изменённые файлы: src/features/cart/CartCalculator.ts, src/utils/discount.ts

Staged rollout: 5% → мониторинг 30 мин → 20% → мониторинг 30 мин → 100%.
Rollback команда: подготовь и приложи к отчёту.
Мониторить: JS crash rate и cart completion rate.
```

---

### `/crash-triage` — Разбор краша

```
/crash-triage --platform ios --version 3.1.2

Crash-free rate упал с 99.8% до 98.1% после релиза 3.1.2 на iOS.
Топ crash signature: "EXC_BAD_ACCESS KERN_INVALID_ADDRESS" в CheckoutViewController.

1. Скачай dSYM из App Store Connect, символицируй стек
2. Найди все breadcrumbs из Crashlytics перед крашем
3. Воспроизведи условия: какие действия пользователя предшествуют крашу?
4. Предложи fix с regression тестом
5. Нужен OTA или store submission?
```

---

### `/store-submission` — Сабмит в магазин

**App Store:**

```
/store-submission --platform ios --build-path builds/MyApp-3.2.0.ipa

Подготовь и отправь билд 3.2.0 в App Store Review.

Проверь compliance checklist перед сабмитом.
Release notes (en-US): "Bug fixes and performance improvements. Updated checkout flow for faster payments."
Тестовый аккаунт для ревьюеров: test@example.com / TestPass123!
Специальные инструкции: для тестирования Apple Pay нужна карта Visa (кнопка появляется только на реальном устройстве).

После сабмита — отслеживай статус каждые 4 часа. При rejection — сразу уведомить команду.
```

**Google Play:**

```
/store-submission --platform android --build-path builds/app-release-3.2.0.aab

Promote билд 3.2.0 в Google Play Production.
Стратегия rollout: начать с 20%, через 48 часов → 50% → через 48 часов → 100%.
Мониторить: ANR rate и crash rate на каждом этапе (порог: > 0.47% → остановить rollout).
```

---

### `/device-testing` — Тестирование на устройствах

```
/device-testing --suite regression --platform all

Прогони regression suite на device farm перед релизом 3.2.0.

Device matrix:
iOS: iPhone SE (iOS 16), iPhone 15 Pro (iOS 17), iPad Air (iOS 17)
Android: Samsung Galaxy A14 (Android 13), Pixel 7 (Android 14), OnePlus Nord (Android 13)

Критично проверить: checkout flow, push notifications, offline mode, camera (для KYC).
Блокировать релиз если: critical тест упал на > 2 устройствах из 6.
Приложи скриншоты всех failed тестов с device context.
```

---

## QA & Test Automation

### `/regression-suite` — Регрессионное тестирование

**Перед деплоем:**

```
/regression-suite --env staging --scope critical

Запусти critical regression suite на staging перед деплоем v2.4.0.
Scope: auth flows, checkout, payment, account management, notifications.
Если pass rate < 100% — заблокировать деплой и уведомить #qa-alerts.
Выдай Allure report с видео всех упавших тестов.
```

**Ночной full run:**

```
/regression-suite --env staging --scope full

Ночной полный регресс. Scope: все E2E тесты (~300).
Допустимый fail rate: < 2% (исключая quarantined flaky тесты).
Результат отправить в #qa-daily утром в 08:00.
Новые failures (не из списка known flaky) — создать GitHub issues автоматически.
```

---

### `/smoke-test` — Смоук тесты

**После деплоя:**

```
/smoke-test --env production --post-deploy

POST-DEPLOY smoke тест после деплоя v2.4.0 в production.
Тайм-лимит: 5 минут максимум.
При > 1 critical failure → автоматически инициировать rollback и уведомить #deployments.
Обязательно проверить: login, создание заказа, payment с тест-картой, logout.
```

**Мониторинг staging:**

```
/smoke-test --env staging

Плановый smoke тест staging окружения.
Если тест упал — создать GitHub issue и уведомить @platform-team в Slack.
```

---

### `/performance-audit` — Аудит производительности

**Load тест нового endpoint:**

```
/performance-audit --endpoint /api/v2/recommendations --type load

Load тест нового endpoint /api/v2/recommendations.
Профиль нагрузки: ramp up до 500 concurrent users за 5 минут, держать 10 минут.
SLO: p99 < 300ms, error rate < 0.1%, throughput > 1000 rps.

Мониторить параллельно: CPU и memory сервиса, connection pool к БД, cache hit rate.
Если SLO нарушены — определить bottleneck (DB? сеть? CPU?) и дать рекомендации.
```

**Spike тест:**

```
/performance-audit --endpoint /api/orders --type spike

Spike тест: симуляция flash sale нагрузки.
Базовый трафик: 100 rps → резкий spike до 1000 rps за 30 секунд → держать 2 минуты → возврат к 100 rps.
Проверить: автоскейлинг успевает? Есть ли потеря запросов во время spike?
```

---

### `/flakiness-investigation` — Расследование нестабильных тестов

```
/flakiness-investigation --test "checkout with promo code applies discount correctly"

Тест "checkout with promo code applies discount correctly" упал 4 из 20 запусков на этой неделе.
Flakiness rate: 20%.

1. Получи логи всех 4 упавших запусков из CI
2. Классифицируй root cause (race condition? state pollution? timing?)
3. Запусти тест 30 раз локально в изоляции
4. Предложи конкретный fix с объяснением
5. После фикса — подтверди запуском 50 раз (0 failures)
```

---

### `/test-coverage-report` — Отчёт покрытия

**Сравнение с main:**

```
/test-coverage-report --compare main --threshold 80

Сгенерируй coverage отчёт для текущей ветки, сравни с main.
Порог: 80% для бизнес-логики (src/features/, src/services/).
Утилиты (src/utils/) порог: 70%.

Для каждого файла ниже порога:
- Покажи конкретные непокрытые строки
- Предложи тест-кейс для покрытия самой критичной ветки
```

**Аудит покрытия нового модуля:**

```
/test-coverage-report --threshold 80

Новый модуль src/features/subscriptions/ вышел в main.
Проверь coverage по этой директории.
Если < 80% — сгенерируй скелеты тестов для топ-5 непокрытых функций.
Приоритизируй: payment processing > state transitions > error handling > utils.
```

---

## Советы по составлению промптов

### Структура эффективного промпта для workflow

```
/workflow-name [обязательные параметры]

[Контекст: 1-2 предложения о ситуации или причине]
[Ограничения или особые условия]
[Ожидаемый результат или формат вывода]
```

### Что добавить для лучших результатов

| Добавь                    | Когда                                        |
|:--------------------------|:---------------------------------------------|
| Название тикета/задачи    | Для трассируемости и commit messages         |
| Причину изменения         | Помогает агенту выбрать правильную стратегию |
| Специфические ограничения | Если стандартные пороги не подходят          |
| Downstream зависимости    | Если знаешь что затронут другие системы      |
| Контакты/каналы           | Куда слать уведомления по результату         |

### Параметры-флаги по умолчанию

Если не указать флаги — агент использует safe defaults:

| Workflow             | Default поведение                       |
|:---------------------|:----------------------------------------|
| `/deploy-production` | canary strategy, стандартные thresholds |
| `/drift-check`       | только отчёт, без --fix                 |
| `/security-scan`     | --scope all, --pr                       |
| `/regression-suite`  | --scope critical                        |
| `/cost-audit`        | --period last-month                     |
| `/provision-env`     | --env preview                           |
| `/deploy-endpoint`   | --shadow (safe default)                 |

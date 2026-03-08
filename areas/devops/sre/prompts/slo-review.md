# Prompt: `/slo-review`

Use when: conducting a quarterly SLO review — adjusting targets, reviewing error budget burn, planning reliability work.

---

## Example 1 — Q4 SLO review for 6 services

**EN:**
```
/slo-review

Review period: Q3 2024 (July–September)
Services under review: checkout, payment, order, auth, user, notification
Data available in Prometheus (Sloth recording rules)
For each service, evaluate:
  1. SLI achievement: actual ratio vs SLO target for the quarter
  2. Error budget burn: how much was consumed, main events causing consumption
  3. Incidents: count, severity, duration, correlation with budget consumption
  4. Target calibration: is the target too tight (budget always exhausted) or too loose (never burns)?
  5. Action items from previous review: completed? effective?
Recommendations needed:
  - Services to tighten (budget never used → target probably too conservative)
  - Services to loosen (budget always exhausted → target not achievable with current architecture)
  - Reliability investments for Q4 (prioritised by error budget consumed)
Output format: executive summary + per-service table + Q4 recommendations
```

**RU:**
```
/slo-review

Период проверки: Q3 2024 (июль–сентябрь)
Сервисы на проверке: checkout, payment, order, auth, user, notification
Данные доступны в Prometheus (Sloth recording rules)
Для каждого сервиса оценить:
  1. Достижение SLI: фактическое соотношение vs цель SLO за квартал
  2. Сжигание error budget: сколько потрачено, основные события вызвавшие потребление
  3. Инциденты: количество, severity, продолжительность, корреляция с потреблением бюджета
  4. Калибровка цели: слишком жёсткая (бюджет всегда исчерпан) или слишком мягкая (никогда не горит)?
  5. Action items из предыдущего review: выполнены? эффективны?
Необходимые рекомендации:
  - Сервисы для ужесточения (бюджет никогда не расходуется → цель вероятно слишком консервативная)
  - Сервисы для смягчения (бюджет всегда исчерпан → цель недостижима с текущей архитектурой)
  - Инвестиции в надёжность на Q4 (приоритизированы по потреблённому error budget)
Формат вывода: executive summary + таблица по сервисам + рекомендации на Q4
```

---

## Example 2 — Emergency SLO calibration after infra migration

**EN:**
```
/slo-review

Context: migrated from single-AZ to multi-AZ K8s (3 control plane + 6 workers)
Pre-migration: payment-service SLO 99.5%, frequently in Freeze state
Hypothesis: new HA setup should enable tightening to 99.9%
Task:
  1. Review pre-migration error budget consumption (last 3 months)
  2. Classify error budget events: infra-caused vs app-caused vs dependency-caused
  3. Estimate: if all infra-caused events are eliminated, what availability % would have been achieved?
  4. Propose new SLO target with rationale
  5. Set review checkpoint: evaluate new target after 30 days
```

**RU:**
```
/slo-review

Контекст: миграция с single-AZ на multi-AZ K8s (3 control plane + 6 workers)
До миграции: payment-service SLO 99.5%, часто в состоянии Freeze
Гипотеза: новая HA конфигурация должна позволить ужесточить до 99.9%
Задача:
  1. Проверить потребление error budget до миграции (последние 3 месяца)
  2. Классифицировать события error budget: вызванные инфрой / приложением / зависимостями
  3. Оценить: если бы все события вызванные инфрой были исключены, какой % доступности был бы достигнут?
  4. Предложить новую цель SLO с обоснованием
  5. Установить точку проверки: оценить новую цель через 30 дней
```

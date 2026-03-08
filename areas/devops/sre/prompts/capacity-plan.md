# Prompt: `/capacity-plan`

Use when: planning infrastructure capacity for growth, a product launch, or a seasonal peak.

---

## Example 1 — Capacity plan for 3× growth over 6 months

**EN:**
```
/capacity-plan

Service: checkout-service
Current load: 500 RPS peak / 150 RPS average
Projected growth: 3× in 6 months (based on product roadmap: new market launch)
Current resources: 4 pods × (500m CPU / 512Mi memory); HPA max 8; 3 workers (8 CPU, 16Gi each)
Data needed from Prometheus:
  - CPU utilisation at current peak (p95 over 30 days)
  - Memory utilisation at current peak
  - HPA scale-out frequency (how often hitting max replicas?)
  - Database connection pool saturation at peak
Deliverables:
  1. Resource projection for 1500 RPS peak (new pod count, CPU/memory)
  2. Node capacity check: can current 3 workers support 3× load, or add nodes?
  3. Database capacity: will current postgres handle 3× query rate?
  4. Cost delta: estimated monthly cost increase
  5. Timeline: when to act (at what RPS threshold trigger provisioning)
```

**RU:**
```
/capacity-plan

Сервис: checkout-service
Текущая нагрузка: 500 RPS пик / 150 RPS среднее
Прогнозируемый рост: 3× за 6 месяцев (на основе роудмапа: выход на новый рынок)
Текущие ресурсы: 4 пода × (500m CPU / 512Mi memory); HPA max 8; 3 worker ноды (8 CPU, 16Gi каждая)
Необходимые данные из Prometheus:
  - Использование CPU при текущем пике (p95 за 30 дней)
  - Использование памяти при текущем пике
  - Частота горизонтального масштабирования HPA (как часто достигает максимума реплик?)
  - Насыщение connection pool БД при пике
Результаты:
  1. Прогноз ресурсов для 1500 RPS пик (новое количество подов, CPU/память)
  2. Проверка ёмкости нод: выдержат ли текущие 3 worker ноды нагрузку 3×, или нужно добавить?
  3. Ёмкость БД: справится ли текущий postgres с нагрузкой 3× по запросам?
  4. Дельта стоимости: оценка роста ежемесячных затрат
  5. Временная шкала: когда действовать (при каком пороге RPS запускать provisioning)
```

---

## Example 2 — Black Friday capacity runbook

**EN:**
```
/capacity-plan

Event: Black Friday (peak 5× normal traffic, 4-hour window)
Services affected: checkout, payment, order (top 3 by load)
Normal peak: 800 RPS; expected BF peak: 4000 RPS
Pre-event checklist needed:
  - Scale workers from 6 → 10 (pre-provision 48h before event)
  - Set HPA min replicas: checkout→10, payment→8, order→8 (prevent cold start during spike)
  - Pre-warm: connection pools, DNS TTLs flushed, CDN cache warmed
  - Load test: k6 script targeting 4500 RPS (10% above expected peak); run 2 days before
  - DB: pre-warm vacuumed + analysed; connection pool max set to 80% of max_connections
  - War room: open 1h before event; on-call + dev leads + DBA on standby
  - Auto-scale-down: trigger 2h after event peak (cost control)
Output: runbook document + pre-event checklist + post-event scale-down procedure
```

**RU:**
```
/capacity-plan

Событие: Чёрная пятница (пик 5× нормального трафика, 4-часовое окно)
Затронутые сервисы: checkout, payment, order (топ-3 по нагрузке)
Нормальный пик: 800 RPS; ожидаемый пик ЧП: 4000 RPS
Необходимый чеклист перед событием:
  - Масштабировать workers с 6 → 10 (заранее за 48ч до события)
  - Установить HPA min replicas: checkout→10, payment→8, order→8 (предотвратить cold start при скачке)
  - Pre-warm: connection pools, сброс DNS TTL, прогрев CDN кэша
  - Нагрузочное тестирование: k6 скрипт на 4500 RPS (10% сверх ожидаемого пика); запустить за 2 дня
  - БД: прогрев vacuum + analyse; max connection pool = 80% от max_connections
  - Военная комната: открыть за 1ч до события; on-call + dev leads + DBA в режиме ожидания
  - Авто-уменьшение масштаба: через 2ч после пика события (контроль затрат)
Результат: runbook документ + чеклист до события + процедура уменьшения масштаба после события
```

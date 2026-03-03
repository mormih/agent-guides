# Workflow: Debug Issue

**Description**: Sistemnyy podkhod po vyyavleniyu i ustraneniyu problem (bagov, degradatsii proizvoditelnosti) v Backend-mikroservisakh.

**Inputs**:
- `<issue-description>`: Opisanie baga, oshibki ili problemy.

## 1. Izolyatsiya i Vosproizvedenie `<issue-description>`
- Nayti Trace ID problemnogo zaprosa v Sentry, Datadog ili Kibana/Grafana Loki.
- Styanut logi vokrug dannogo Trace ID so vsekh servisov.
- Napisat lokalnyy skript/Unit-test, kotoryy 100% vosproizvodit oshibku na osnove vkhodnykh dannykh iz logov.

## 2. Diagnostika (Root Cause Analysis - RCA)
- Oshibka bazy dannykh (N+1, Deadlock, Timeout)? Proverit EXPLAIN ANALYZE dlya SQL iz loga.
- Oshibka OOM (Out of Memory)? Snyat Heap Dump.
- Setevaya oshibka (Timeout, 502/504)? Proverit nastroyki Circuit Breaker i Retries.
- Oshibka biznes-logiki? Prognat otladchikom kod problemnogo shaga.

## 3. Napisanie Regressionnogo Testa
- DO vneseniya ispravleniy v kod zafiksiruyte bag v vide padayushchego testa (Red-Green-Refactor).
- Test dolzhen dokazyvat nalichie problemy.

## 4. Razrabotka Ispravleniya
- Primenit fiks.
- Udostoveritsya, chto padayushchiy test stal zelenym.
- Proverit blast radius fiksa: ne slomal li on drugie chasti sistemy. Zapustit polnyy Regression Suite lokalno.

## 5. Dobavlenie Observability
- Esli poisk baga zanyal slishkom dolgo iz-za nedostatka logov — dobavit dopolnitelnye polya v strukturirovannye logi ili metriki v ispravlyaemyy uchastok pered deploem.

## Svyazannye Navyki (Skills)
- Vsegda ispolzuyte metody iz `backend/skills/troubleshooting/SKILL.md` dlya klassifikatsii i resheniya problem (OOM, N+1, Race Conditions).
- Dobavlyayte novye logi po standartam `backend/skills/observability/SKILL.md`.
- Ispravlyaya uyazvimosti bezopasnosti, sveryaytes s `backend/rules/security.md`.

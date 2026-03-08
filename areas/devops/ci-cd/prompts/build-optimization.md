# Prompt: `/build-optimize`

Use when: CI builds are slow, Docker layers are bloating, or cache hit rate is low.

---

## Example 1 — Reduce Docker build time from 12 min to < 3 min

**EN:**
```
/build-optimize

Service: order-service / Language: Python 3.12 + FastAPI
Current build time: 12 min (GitHub Actions); cache hit rate: ~15%
Problems observed:
  - pip install runs from scratch every build (no layer caching)
  - Test dependencies bundled into production image
  - Base image pulled fresh every build (no registry mirror)
Goals:
  - Achieve < 3 min build on cache hit
  - Separate build deps from runtime image (multi-stage)
  - Use GitHub Actions cache for pip + Docker layer cache (type=gha)
  - Produce minimal production image (target < 200MB)
Show: before/after Dockerfile + updated GitHub Actions workflow
```

**RU:**
```
/build-optimize

Сервис: order-service / Язык: Python 3.12 + FastAPI
Текущее время сборки: 12 мин (GitHub Actions); cache hit rate: ~15%
Наблюдаемые проблемы:
  - pip install запускается с нуля при каждой сборке (нет layer caching)
  - Зависимости для тестов входят в production образ
  - Base image скачивается заново при каждой сборке (нет registry mirror)
Цели:
  - Достичь < 3 мин при попадании в кэш
  - Разделить build и runtime зависимости (multi-stage)
  - Использовать GitHub Actions cache для pip + Docker layer cache (type=gha)
  - Минимальный production образ (цель < 200MB)
Показать: Dockerfile до/после + обновлённый GitHub Actions workflow
```

---

## Example 2 — Go service: exploit module cache in GitLab CI

**EN:**
```
/build-optimize

Service: payment-processor / Language: Go 1.23
CI: GitLab CI / Runner: self-hosted (bare-metal, Docker executor)
Current: `go build` downloads all modules every run (5–8 min on slow link)
Root cause: no Go module cache persistence between jobs
Fix needed:
  - Cache $GOPATH/pkg/mod keyed on go.sum hash
  - Cache ~/.cache/go-build (build cache) keyed on source hash
  - Verify: cache restore + build completes in < 90 sec on warm cache
  - Bonus: use xx cross-compilation for arm64 image in same pipeline
```

**RU:**
```
/build-optimize

Сервис: payment-processor / Язык: Go 1.23
CI: GitLab CI / Runner: self-hosted (bare-metal, Docker executor)
Проблема: `go build` скачивает все модули каждый раз (5–8 мин на медленном канале)
Корневая причина: нет сохранения Go module cache между заданиями
Необходимое исправление:
  - Кэшировать $GOPATH/pkg/mod по хэшу go.sum
  - Кэшировать ~/.cache/go-build (build cache) по хэшу исходников
  - Проверить: восстановление кэша + сборка < 90 сек при тёплом кэше
  - Бонус: кросс-компиляция arm64 образа через xx в том же pipeline
```

---

## Example 3 — Matrix build: test across 3 Python versions in parallel

**EN:**
```
/build-optimize

Task: add matrix testing across Python 3.10, 3.11, 3.12 without tripling CI time
CI: GitHub Actions
Current: single Python 3.12 test job (4 min)
Goal: matrix across 3 versions; total CI wall time stays < 6 min (parallel execution)
Constraints:
  - Shared pip cache across matrix versions (keyed on version + requirements hash)
  - Upload test results as artifacts per matrix cell
  - Fail fast: cancel other matrix jobs if one fails on main branch; allow failure on PRs
```

**RU:**
```
/build-optimize

Задача: добавить matrix тестирование для Python 3.10, 3.11, 3.12 без утроения времени CI
CI: GitHub Actions
Текущее состояние: одна задача тестирования Python 3.12 (4 мин)
Цель: matrix для 3 версий; общее время CI не превышает 6 мин (параллельное выполнение)
Ограничения:
  - Общий pip cache для всех ячеек matrix (ключ: версия + хэш requirements)
  - Загрузка результатов тестов как артефактов на каждую ячейку matrix
  - Fail fast: отмена других matrix заданий при отказе одного на main; разрешить на PR
```

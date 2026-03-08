# Prompt: `/pipeline-debug`

Use when: a CI/CD pipeline is failing and needs root cause diagnosis and fix.

---

## Example 1 — Auth failure: registry push rejected

**EN:**
```
/pipeline-debug

Pipeline: https://github.com/myorg/order-service/actions/runs/12345678
Stage: build / Step: "Push image to ghcr.io"
Error: "unauthorized: unauthenticated: User cannot be authenticated"
Last successful run: 3 days ago (same workflow, no code changes)
Hypothesis: GITHUB_TOKEN permissions changed, or OIDC trust policy expired
Check: workflow permissions block, repository Settings → Actions → permissions
```

**RU:**
```
/pipeline-debug

Pipeline: https://github.com/myorg/order-service/actions/runs/12345678
Стадия: build / Шаг: "Push image to ghcr.io"
Ошибка: "unauthorized: unauthenticated: User cannot be authenticated"
Последний успешный запуск: 3 дня назад (тот же workflow, без изменений кода)
Гипотеза: изменились разрешения GITHUB_TOKEN или истёк OIDC trust policy
Проверить: блок permissions в workflow, Settings → Actions → permissions репозитория
```

---

## Example 2 — Flaky test causing random failures

**EN:**
```
/pipeline-debug

Pipeline: GitLab CI / Project: backend/payment-service / Branch: main
Stage: test / Failure rate: ~30% (same commit sometimes passes, sometimes fails)
Error: "FAILED tests/test_settlement.py::test_daily_settlement - AssertionError: expected 3 records, got 2"
Suspicion: test depends on datetime.now() — timezone or timing issue in CI runner
Environment: GitLab shared runner (UTC) vs local dev (Europe/Moscow)
Goal: identify root cause + fix test + add to flaky-test tracking
```

**RU:**
```
/pipeline-debug

Pipeline: GitLab CI / Проект: backend/payment-service / Ветка: main
Стадия: test / Частота отказов: ~30% (один и тот же коммит иногда проходит, иногда нет)
Ошибка: "FAILED tests/test_settlement.py::test_daily_settlement - AssertionError: expected 3 records, got 2"
Подозрение: тест зависит от datetime.now() — проблема с timezone или таймингом в CI runner
Окружение: GitLab shared runner (UTC) vs локальная разработка (Europe/Moscow)
Цель: определить корневую причину + исправить тест + добавить в flaky-test tracking
```

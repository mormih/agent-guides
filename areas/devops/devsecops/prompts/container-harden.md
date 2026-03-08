# Prompt: `/container-harden`

Use when: hardening a container image or fixing security context violations in K8s workloads.

---

## Example 1 — Harden existing Python service Dockerfile

**EN:**
```
/container-harden

Service: notification-service / Language: Python 3.12 + FastAPI
Current Dockerfile issues (from Trivy + OPA scan):
  - Runs as root (no USER instruction)
  - Base image: python:3.12 (full, not slim; 800MB with dev tools)
  - No multi-stage (test deps included in production image)
  - Base image tag not pinned to digest
  - COPY . . copies .env and .git into image
Hardening targets:
  1. Distroless or python:3.12-slim@sha256:<digest> base (< 150MB final)
  2. Non-root user (UID 1000)
  3. Multi-stage: builder with pip install; runtime with only app + deps
  4. .dockerignore: exclude .env, .git, tests/, __pycache__, *.pyc
  5. readOnlyRootFilesystem: true in K8s (mount emptyDir for /tmp)
  6. drop ALL capabilities; no privilege escalation
Show: before/after Dockerfile + Helm values securityContext patch
```

**RU:**
```
/container-harden

Сервис: notification-service / Язык: Python 3.12 + FastAPI
Текущие проблемы Dockerfile (из Trivy + OPA скана):
  - Запуск от root (нет инструкции USER)
  - Base image: python:3.12 (полный, не slim; 800MB с dev tools)
  - Нет multi-stage (зависимости для тестов включены в production образ)
  - Тег base image не закреплён с digest
  - COPY . . копирует .env и .git в образ
Цели hardening:
  1. Distroless или python:3.12-slim@sha256:<digest> база (финальный < 150MB)
  2. Не-root пользователь (UID 1000)
  3. Multi-stage: builder с pip install; runtime только с приложением + зависимостями
  4. .dockerignore: исключить .env, .git, tests/, __pycache__, *.pyc
  5. readOnlyRootFilesystem: true в K8s (монтировать emptyDir для /tmp)
  6. drop ALL capabilities; без повышения привилегий
Показать: Dockerfile до/после + патч securityContext в Helm values
```

---

## Example 2 — Fix admission-blocked deployment (security context)

**EN:**
```
/container-harden

Problem: Gatekeeper blocking deployment of order-service v3.2.0 with 3 violations:
  1. "Container 'app' must set runAsNonRoot: true"
  2. "Container 'app' must set allowPrivilegeEscalation: false"
  3. "Container 'app' image must reference a digest (@sha256:...)"
Current Helm values: no securityContext defined; image.tag = "v3.2.0"
Fix needed:
  1. Add securityContext block to deployment template (or Helm values.yaml)
  2. Update image reference to use digest: registry.internal/order-service@sha256:<build-digest>
  3. Verify fix: kubectl apply --dry-run=server; confirm no Gatekeeper violations
  4. Check: does readOnlyRootFilesystem: true break the app? (look for writes to /)
```

**RU:**
```
/container-harden

Проблема: Gatekeeper блокирует деплой order-service v3.2.0 с 3 нарушениями:
  1. "Container 'app' must set runAsNonRoot: true"
  2. "Container 'app' must set allowPrivilegeEscalation: false"
  3. "Container 'app' image must reference a digest (@sha256:...)"
Текущие Helm values: securityContext не определён; image.tag = "v3.2.0"
Необходимое исправление:
  1. Добавить блок securityContext в deployment template (или values.yaml)
  2. Обновить ссылку на образ для использования digest: registry.internal/order-service@sha256:<build-digest>
  3. Проверить исправление: kubectl apply --dry-run=server; подтвердить отсутствие нарушений Gatekeeper
  4. Проверить: сломает ли readOnlyRootFilesystem: true приложение? (найти записи в /)
```

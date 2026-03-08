# Prompt: `/supply-chain`

Use when: implementing or auditing software supply chain security — SBOM, image signing, provenance, dependency pinning.

---

## Example 1 — Add full supply chain to existing pipeline

**EN:**
```
/supply-chain

Service: checkout-service / CI: GitHub Actions
Current state: images built and pushed, no signing, no SBOM
Required:
  1. SBOM: generate CycloneDX SBOM with Syft during build; attach to image with cosign
  2. Signing: sign image with cosign using GitHub OIDC (keyless) after push
  3. Provenance: enable SLSA level 2 via docker/build-push-action (provenance: true)
  4. Verification: add cosign verify step in CD pipeline before every deploy
  5. Policy: Kyverno ClusterPolicy — block unsigned images in production namespace
  6. Dependency pinning: base image must reference @sha256 digest, not tag
Show full updated GitHub Actions workflow + Kyverno policy
```

**RU:**
```
/supply-chain

Сервис: checkout-service / CI: GitHub Actions
Текущее состояние: образы собираются и пушатся, без подписи, без SBOM
Требуется:
  1. SBOM: генерация CycloneDX SBOM через Syft при сборке; прикрепление к образу через cosign
  2. Подпись: подпись образа через cosign с GitHub OIDC (keyless) после push
  3. Provenance: SLSA level 2 через docker/build-push-action (provenance: true)
  4. Верификация: добавить шаг cosign verify в CD pipeline перед каждым деплоем
  5. Политика: Kyverno ClusterPolicy — блокировка неподписанных образов в production namespace
  6. Pinning зависимостей: base image должен ссылаться на @sha256 digest, не тег
Показать полный обновлённый workflow GitHub Actions + Kyverno политику
```

---

## Example 2 — Audit: dependency risk assessment

**EN:**
```
/supply-chain

Task: assess supply chain risk for services ahead of SOC 2 audit
Services: 4 Python services (requirements.txt) + 2 Go services (go.mod)
Checks needed:
  1. Unpinned dependencies (no version = supply chain risk)
  2. Dependencies with no recent commits (abandoned / unmaintained)
  3. Dependencies with known typosquatting history
  4. Transitive dependencies with Critical/High CVEs (trivy fs)
  5. Packages not in approved list (if allowlist exists)
Tool: pip-audit (Python), govulncheck (Go), trivy fs
Output: risk matrix (dependency / risk / recommended action)
```

**RU:**
```
/supply-chain

Задача: оценка рисков supply chain для сервисов перед аудитом SOC 2
Сервисы: 4 Python сервиса (requirements.txt) + 2 Go сервиса (go.mod)
Необходимые проверки:
  1. Незакреплённые зависимости (без версии = риск supply chain)
  2. Зависимости без недавних коммитов (заброшенные / неподдерживаемые)
  3. Зависимости с историей typosquatting
  4. Транзитивные зависимости с Critical/High CVE (trivy fs)
  5. Пакеты не из утверждённого списка (если allowlist существует)
Инструменты: pip-audit (Python), govulncheck (Go), trivy fs
Результат: матрица рисков (зависимость / риск / рекомендуемое действие)
```

# Prompt: `/sbom-sign`

Use when: generating, attaching, or verifying SBOMs and image signatures in the CI/CD pipeline.

---

## Example 1 — Add SBOM + cosign to existing pipeline

**EN:**
```
/sbom-sign

Service: payment-service / CI: GitHub Actions
Image: ghcr.io/myorg/payment-service:${{ github.sha }}
Current state: image built and pushed; no SBOM, no signature
Add to pipeline (after image push step):
  1. Generate SBOM in CycloneDX format using Syft
  2. Attach SBOM to image in OCI registry using cosign attach sbom
  3. Sign image with cosign using GitHub OIDC (keyless — no private key management)
  4. Generate SLSA provenance attestation (via docker/build-push-action provenance:true)
  5. Add verification step in deploy job: cosign verify before helm upgrade
  6. Store SBOM as build artifact (for audit/compliance download)
Show: complete GitHub Actions steps to insert after existing push step
```

**RU:**
```
/sbom-sign

Сервис: payment-service / CI: GitHub Actions
Образ: ghcr.io/myorg/payment-service:${{ github.sha }}
Текущее состояние: образ собирается и пушится; без SBOM, без подписи
Добавить в pipeline (после шага push образа):
  1. Генерация SBOM в формате CycloneDX через Syft
  2. Прикрепление SBOM к образу в OCI registry через cosign attach sbom
  3. Подпись образа через cosign с GitHub OIDC (keyless — без управления приватным ключом)
  4. Генерация SLSA provenance attestation (через docker/build-push-action provenance:true)
  5. Добавить шаг верификации в deploy job: cosign verify перед helm upgrade
  6. Сохранить SBOM как build artifact (для загрузки при аудите/compliance)
Показать: полные шаги GitHub Actions для вставки после существующего шага push
```

---

## Example 2 — SBOM audit: find transitive dependency vulnerability

**EN:**
```
/sbom-sign

Task: use SBOM to investigate if any of our services uses log4j 2.x (post-Log4Shell)
Services: 8 Java services; SBOMs generated during CI, stored in registry as OCI artifacts
Process:
  1. Pull SBOM for each service: cosign download sbom <image>
  2. Parse CycloneDX JSON: search for log4j component, any version
  3. If found: identify exact version; check if >= 2.15.0 (patched) or < 2.15.0 (vulnerable)
  4. Output: service × log4j-version matrix; highlight vulnerable services
  5. For vulnerable services: trigger emergency patch pipeline
Tool available: grype (can scan SBOM directly), cdxgen (for re-generation if needed)
```

**RU:**
```
/sbom-sign

Задача: использовать SBOM для проверки используют ли наши сервисы log4j 2.x (после Log4Shell)
Сервисы: 8 Java сервисов; SBOM генерируются во время CI, хранятся в registry как OCI артефакты
Процесс:
  1. Скачать SBOM для каждого сервиса: cosign download sbom <image>
  2. Парсить CycloneDX JSON: искать компонент log4j, любую версию
  3. Если найден: определить точную версию; проверить >= 2.15.0 (исправленный) или < 2.15.0 (уязвимый)
  4. Результат: матрица сервис × версия-log4j; выделить уязвимые сервисы
  5. Для уязвимых сервисов: запустить экстренный pipeline патча
Доступные инструменты: grype (может сканировать SBOM напрямую), cdxgen (для повторной генерации при необходимости)
```

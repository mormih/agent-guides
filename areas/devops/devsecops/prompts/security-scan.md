# Prompt: `/security-scan`

Use when: running a security scan of a service's container, dependencies, or IaC.

---

## Example 1 — Full pre-release security scan

**EN:**
```
/security-scan

Service: payment-service / Version: v2.5.0
Scope: full scan (code, dependencies, image, IaC)
Pipeline stage: pre-release gate
Scans to run:
  1. SAST: semgrep (ruleset: python, owasp) on src/
  2. Dependency CVE: trivy fs . (CRITICAL+HIGH block)
  3. Secrets: trufflehog git --since-commit HEAD~10
  4. Image: trivy image registry.internal/payment-service:v2.5.0 (CRITICAL+HIGH block)
  5. IaC: tfsec terraform/ (CRITICAL+HIGH block)
  6. SBOM: generate CycloneDX from image; attach via cosign
Expected output: pass/fail per scan + finding summary + exceptions list
Block release if: any unresolved Critical/High without approved exception
```

**RU:**
```
/security-scan

Сервис: payment-service / Версия: v2.5.0
Скоуп: полное сканирование (код, зависимости, образ, IaC)
Стадия pipeline: pre-release gate
Сканирования:
  1. SAST: semgrep (ruleset: python, owasp) на src/
  2. CVE зависимостей: trivy fs . (CRITICAL+HIGH блокируют)
  3. Секреты: trufflehog git --since-commit HEAD~10
  4. Образ: trivy image registry.internal/payment-service:v2.5.0 (CRITICAL+HIGH блокируют)
  5. IaC: tfsec terraform/ (CRITICAL+HIGH блокируют)
  6. SBOM: генерация CycloneDX из образа; прикрепление через cosign
Ожидаемый результат: pass/fail по каждому скану + сводка находок + список исключений
Блокировать релиз если: есть неразрешённые Critical/High без утверждённого исключения
```

---

## Example 2 — Emergency: CVE triage in production image

**EN:**
```
/security-scan

Context: CVE-2024-XXXXX published today, affects Python < 3.12.8
Production images: registry.internal/payment-service:v2.4.1, v2.5.0
Task:
  1. Check if either image uses vulnerable Python version
     trivy image --severity CRITICAL registry.internal/payment-service:v2.4.1
  2. Determine: is CVE exploitable in our usage? (check semgrep rule or manual review)
  3. If exploitable: trigger emergency patch pipeline
  4. If not exploitable: document exception in .trivyignore with expiry 30 days
Output: exploitability assessment + recommended action (patch / accept / workaround)
```

**RU:**
```
/security-scan

Контекст: CVE-2024-XXXXX опубликован сегодня, затрагивает Python < 3.12.8
Образы в production: registry.internal/payment-service:v2.4.1, v2.5.0
Задача:
  1. Проверить использует ли один из образов уязвимую версию Python
     trivy image --severity CRITICAL registry.internal/payment-service:v2.4.1
  2. Определить: эксплуатируемо ли CVE в нашем использовании? (проверить semgrep правило или ручной review)
  3. Если эксплуатируемо: запустить экстренный pipeline патча
  4. Если нет: задокументировать исключение в .trivyignore с истечением через 30 дней
Результат: оценка эксплуатируемости + рекомендуемое действие (патч / принять / обходной путь)
```

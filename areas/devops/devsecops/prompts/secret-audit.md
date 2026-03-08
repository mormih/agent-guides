# Prompt: `/secret-audit`

Use when: scanning for secrets in code, Git history, or running containers.

---

## Example 1 — Pre-commit secret scanning setup

**EN:**
```
/secret-audit

Task: set up pre-commit secret scanning for all repos to prevent secrets entering Git
Tools to configure: trufflehog (Git history scan) + gitleaks (pre-commit hook)
Repos: 12 repos in GitHub org (mix of Python, Go, Terraform)
Required:
  1. gitleaks pre-commit hook: blocks commit if secret detected; show false-positive suppression
  2. GitHub Actions workflow: trufflehog --only-verified on every PR (scan full history to HEAD)
  3. Org-level: GitHub Advanced Security secret scanning (if available)
  4. Custom rules for: internal API key patterns, Vault token patterns (vault:... prefix)
  5. .gitleaks.toml baseline: mark known false-positives as allowed
  6. Incident runbook: what to do if secret found (rotate first, then remove from history)
```

**RU:**
```
/secret-audit

Задача: настроить pre-commit сканирование секретов во всех репозиториях для предотвращения попадания секретов в Git
Инструменты: trufflehog (сканирование Git истории) + gitleaks (pre-commit hook)
Репозитории: 12 репо в GitHub org (смесь Python, Go, Terraform)
Требуется:
  1. pre-commit hook gitleaks: блокирует коммит при обнаружении секрета; показать подавление false-positive
  2. GitHub Actions workflow: trufflehog --only-verified на каждом PR (сканирование полной истории до HEAD)
  3. На уровне организации: GitHub Advanced Security secret scanning (если доступно)
  4. Кастомные правила для: шаблоны внутренних API ключей, шаблоны Vault токенов (префикс vault:...)
  5. Baseline .gitleaks.toml: отметить известные false-positive как разрешённые
  6. Runbook инцидента: что делать при обнаружении секрета (сначала ротировать, потом удалить из истории)
```

---

## Example 2 — Emergency: AWS key found in public repo

**EN:**
```
/secret-audit

Incident: AWS access key found in public GitHub repo (committed 3 days ago in config.py)
Key: AKIAIOSFODNN7EXAMPLE (already visible in GitHub search)
Immediate response checklist:
  1. ROTATE FIRST: disable/delete the key in AWS IAM immediately (before any cleanup)
  2. Check CloudTrail: what actions were performed with this key in last 72h?
  3. Check GuardDuty: any anomalous activity alerts?
  4. Assess blast radius: what permissions did this key have? (iam:GetPolicy)
  5. Remove from repo history: git filter-repo --path config.py --invert-paths OR rewrite specific content
  6. Force-push + GitHub: contact GitHub to clear cached views
  7. Post-incident: add gitleaks pre-commit hook to prevent recurrence
  8. File security incident report
```

**RU:**
```
/secret-audit

Инцидент: AWS access key обнаружен в публичном GitHub репо (закоммичен 3 дня назад в config.py)
Ключ: AKIAIOSFODNN7EXAMPLE (уже виден в поиске GitHub)
Чеклист немедленного реагирования:
  1. СНАЧАЛА РОТАЦИЯ: немедленно отключить/удалить ключ в AWS IAM (до любой очистки)
  2. Проверить CloudTrail: какие действия выполнялись с этим ключом за последние 72ч?
  3. Проверить GuardDuty: есть ли алерты об аномальной активности?
  4. Оценить масштаб ущерба: какие права были у этого ключа? (iam:GetPolicy)
  5. Удалить из истории репо: git filter-repo --path config.py --invert-paths ИЛИ перезаписать конкретный контент
  6. Force-push + GitHub: связаться с GitHub для очистки кешированных просмотров
  7. После инцидента: добавить pre-commit hook gitleaks для предотвращения повторения
  8. Подать отчёт о инциденте безопасности
```

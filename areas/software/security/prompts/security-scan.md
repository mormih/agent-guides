# Prompt: `/security-scan`

## Полное сканирование PR

```
/security-scan --scope all --pr

Полное сканирование текущего PR:
- SAST: semgrep (ruleset security-audit) + snyk code test
- Deps: snyk test + npm audit (или pip-audit)
- Secrets: trufflehog на последние 50 коммитов
- IaC: checkov -d terraform/

Critical → заблокировать merge.
High → комментарий с SLA 72 часа.
Сохранить полный отчёт: .security/scan-{timestamp}.json
```

## Только зависимости

```
/security-scan --scope deps --full

Аудит всех зависимостей на CVE: npm пакеты, Docker base images, Python requirements.
Для каждой Critical CVE — найди patched версию или safe альтернативу.
Таблица: пакет | CVE ID | severity | патченная версия | действие.
```

## Только инфраструктура

```
/security-scan --scope infra --full

IaC security scan: checkov на terraform/, kube-score на k8s manifests.
Маппинг findings на CIS Benchmark контролы.
Приоритет: findings касающиеся IAM wildcard, open security groups, unencrypted storage.
```

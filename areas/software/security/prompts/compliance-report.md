# Prompt: `/compliance-report`

## SOC2

```
/compliance-report --standard soc2 --period Q1-2026

SOC2 Type II отчёт за Q1 2026.
Evidence по контролам:
- CC6 (logical access): CloudTrail, IAM policies, MFA enforcement
- CC7 (system operations): incident logs, monitoring alerts, patch history
- CC8 (change management): deployment history, PR approvals, change records

Для каждого контрола: Compliant / Partial / Non-Compliant + evidence link.
Пометить контролы требующие ручного evidence (training records).
```

## GDPR

```
/compliance-report --standard gdpr --period Q1-2026

GDPR self-assessment за Q1 2026.
Проверить: data processing inventory актуален, right-to-erasure pipeline работает (тест deletion request), cross-border transfer SCCs актуальны, breach notification procedure задокументирована.
Выдать gap analysis с remediation timeline.
```

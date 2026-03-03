# Prompt: `/compliance-report`

## SOC2

```
/compliance-report --standard soc2 --period Q1-2026

SOC2 Type II otchet za Q1 2026.
Evidence po kontrolam:
- CC6 (logical access): CloudTrail, IAM policies, MFA enforcement
- CC7 (system operations): incident logs, monitoring alerts, patch history
- CC8 (change management): deployment history, PR approvals, change records

Dlya kazhdogo kontrola: Compliant / Partial / Non-Compliant + evidence link.
Pometit kontroly trebuyushchie ruchnogo evidence (training records).
```

## GDPR

```
/compliance-report --standard gdpr --period Q1-2026

GDPR self-assessment za Q1 2026.
Proverit: data processing inventory aktualen, right-to-erasure pipeline rabotaet (test deletion request), cross-border transfer SCCs aktualny, breach notification procedure zadokumentirovana.
Vydat gap analysis s remediation timeline.
```

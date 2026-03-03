# Prompt: `/regression-suite`

## Pered deploem (critical)

```
/regression-suite --env staging --scope critical

Zapusti critical regression suite pered deploem v2.4.0.
Scope: auth flows, checkout, payment, account management, email notifications.
Pass rate 100% obyazatelen — lyuboy failure blokiruet deploy.
Pri failure: uvedomit #qa-alerts, sozdat GitHub issue, prilozhit video padeniya.
Vydat Allure report.
```

## Nochnoy polnyy progon

```
/regression-suite --env staging --scope full

Nochnoy full regression (~300 testov). Dopustimyy fail rate: < 2% (bez quarantined flaky).
Zapustit v 23:00 UTC, rezultat v #qa-daily k 08:00 UTC.
Novye failures (ne v spiske known flaky) → avtomaticheski sozdat GitHub issues.
```

## Smoke posle deploya v staging

```
/regression-suite --env staging --scope smoke

Post-deploy smoke dlya staging. Taym-limit: 5 minut.
Pri > 1 critical failure → uvedomit #deployments.
```

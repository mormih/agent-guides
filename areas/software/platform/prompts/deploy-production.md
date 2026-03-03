# Prompt: `/deploy-production`

## Canary deploy

```
/deploy-production --version v2.4.0 --strategy canary

Deploy v2.4.0 v production. Strategiya: canary.
Rollback triggery: error rate delta > 0.5% ili p99 latency delta > 500ms.
Etapy: 10% → 5 min → 25% → 2 min → 50% → 2 min → 100%.
Posle 100% — uvedomit #deployments so ssylkoy na diff.
```

## Hotfix (uskorennyy)

```
/deploy-production --version v2.3.8 --strategy canary

HOTFIX: kriticheskiy bag v payment flow (ENG-4521).
Uskorennyy canary: 10% → 2 min monitoringa → 100%.
Monitorit osobo: /api/payments/* error rate i checkout conversion rate.
Pri lyubom rollback → avtomaticheski sozdat P1 intsident.
```

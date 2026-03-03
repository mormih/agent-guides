# Prompt: `/smoke-test`

## Post-deploy v production

```
/smoke-test --env production --post-deploy

POST-DEPLOY smoke test posle deploya v2.4.0 v production.
Taym-limit: 5 minut maksimum.
Obyazatelnye proverki: login, sozdanie zakaza, payment test-kartoy 4242 4242 4242 4242, logout.
Pri > 1 critical failure → initsiirovat rollback + uvedomit #deployments + sozdat P1 intsident.
```

## Planovyy monitoring staging

```
/smoke-test --env staging

Planovyy smoke staging okruzheniya (zapuskaetsya po cron kazhdye 30 minut).
Pri failure: sozdat GitHub issue, uvedomit @platform-team v Slack, ne blokirovat production.
```

## Posle vosstanovleniya ot intsidenta

```
/smoke-test --env production --post-deploy

POST-INCIDENT verification posle vosstanovleniya ot P1 intsidenta.
Osobo proverit: [ukazat zatronutyy servis] rabotaet korrektno.
Rezultat zafiksirovat v incident timeline.
```

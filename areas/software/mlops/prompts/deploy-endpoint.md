# Prompt: `/deploy-endpoint`

## Shadow mode (safe start)

```
/deploy-endpoint --model churn-predictor --run-id abc123def456 --shadow

Zadeploy v shadow mode na 48 chasov.
100% trafika → champion (otvety klientu ot nego).
Zerkalo zaprosov → challenger (bez otveta klientu).
Monitorit: prediction distribution, latency p99, error rate.
Cherez 48 chasov — otchet o divergence mezhdu champion i challenger.
Esli divergence > 15% — HALT, ne perekhodit k canary bez ruchnogo review.
```

## Canary (posle shadow)

```
/deploy-endpoint --model churn-predictor --run-id abc123def456 --canary

Shadow zavershen: divergence 3%, latency OK. Model odobrena ML lead.
Canary: 5% → 30 min → 20% → 30 min → 50% → 1 chas → 100%.
Rollback: PSI > 0.2 na lyuboy fiche ili error rate > 1%.
Posle 100% → obnovit drift monitoring baseline pod novuyu model.
```

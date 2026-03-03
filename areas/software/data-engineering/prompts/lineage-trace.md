# Prompt: `/lineage-trace`

## Otsenka vliyaniya izmeneniya kolonki

```
/lineage-trace --column stg_orders.discount_type --direction downstream

Planiruem: pereimenovat discount_type → promotion_type i izmenit enum znacheniya (FIXED→flat, PERCENT→pct).
Naydi vse downstream modeli, dashbordy, ML-fichi, API, ispolzuyushchie etu kolonku.
Otseni blast radius: N modeley, M dashbordov zatronuto.
Sformiruy migration checklist s phased approach i otsenkoy usiliy (S/M/L).
```

## Trassirovka istochnika metriki

```
/lineage-trace --column fct_revenue.net_amount_usd --direction upstream

Otkuda beretsya net_amount_usd v fct_revenue?
Prosledi upstream do source-tablitsy. Kakie transformatsii primenyayutsya?
Gde proiskhodit konvertatsiya valyut? Est li promezhutochnaya model s biznes-logikoy?
```

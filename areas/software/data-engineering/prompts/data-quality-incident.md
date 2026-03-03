# Prompt: `/data-quality-incident`

## Dublikaty

```
/data-quality-incident --model fct_orders --type duplicate

Obnaruzheny dublikaty v fct_orders za 2026-02-15: row count v 2.3x bolshe normy.
Downstream effekt: finansovyy dashbord zavyshaet revenue, ML-model poluchaet nevernye obuchayushchie dannye.

1. Scope: skolko partitsiy zatronuto?
2. Root cause: pipeline code? upstream? oshibka deploya?
3. Quarantine: pometit zatronutye partitsii, uvedomit #data-consumers
4. Posle fiksa — zapustit dbt test na unique
```

## SLA breach

```
/data-quality-incident --model fct_daily_revenue --type sla_breach

fct_daily_revenue ne obnovlyalas s 02:00 UTC (SLA: obnovlenie do 04:00 UTC).
Seychas 07:30 UTC — prosrochka 3.5 chasa.
Prover: Airflow DAG status, upstream modeli, warehouse dostupnost.
Uvedomit: finance team chto dashbord pokazyvaet vcherashnie dannye.
```

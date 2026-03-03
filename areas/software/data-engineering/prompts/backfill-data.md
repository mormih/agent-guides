# Prompt: `/backfill-data`

## Retrospektivnyy bekfill

```
/backfill-data --model fct_orders --start 2025-01-01 --end 2025-06-30

Prichina: retrospektivno primenyaem novuyu logiku rascheta skidok (discount_v2).
Pered vypolneniem:
1. Otseni blast radius — kakie downstream modeli zavisyat ot fct_orders
2. Rasschitay obem dannykh i vremya vypolneniya
3. Predlozhi optimalnyy batch size (ne bolee 1 mesyatsa za raz)

Vypolnyat v off-peak (posle 22:00 UTC). Posle kazhdogo batcha — proveryat unique na order_id.
Uvedomit #data-platform po zaversheniyu s row counts do/posle.
```

## Bekfill posle data quality intsidenta

```
/backfill-data --model stg_events --start 2026-02-10 --end 2026-02-14

Prichina: pipeline padal 10-14 fevralya, dannye za etot period otsutstvuyut ili nepolny.
Istochnik dannykh dlya bekfilla: raw.events_backup (arkhivnye dannye za tot zhe period).
Posle bekfilla: sravni row counts s backup-istochnikom, prover net li gaps po chasam.
```

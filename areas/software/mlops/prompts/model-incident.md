# Prompt: `/model-incident`

## Drift

```
/model-incident --model fraud-detector --type drift

INTsIDENT: PSI > 0.25 na feature transaction_amount poslednie 3 chasa.
Vozmozhnaya prichina: novyy tip tranzaktsiy posle vcherashnego produktovogo reliza.

1. Scope: kakie predskazaniya zatronuty (% trafika)?
2. Nemedlenno: otkatit na previous champion ili prodolzhat s monitoringom?
3. Dolgosrochno: retrain na novykh dannykh ili feature engineering nuzhen?
Taymaut na reshenie: 30 minut.
```

## Degradatsiya kachestva

```
/model-incident --model churn-predictor --type degradation

Biznes: retention campaign konvertiruet 12% vs ozhidaemykh 35% (poslednie 2 nedeli).
Gipoteza: training-serving skew ili model rot.
Proverit: izmenilsya li input feature distribution (PSI)? Izmenilos li povedenie polzovateley (concept drift)?
Sravni predictions distribution: 4 nedeli nazad vs tekushchiy moment.
```

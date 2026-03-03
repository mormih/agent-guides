# Prompt: `/evaluate-model`

## Polnaya otsenka so sravneniem

```
/evaluate-model --run-id abc123def456 --compare-to champion

Primary metric: AUC-ROC.
Business metric: "Revenue retained pri top-20% predicted churners" (assume $50 retention cost, $200 LTV).
Fairness: po plan_type (free/pro/enterprise) i country_region — flagirovat esli demographic parity diff > 0.1.
Esli challenger luchshe champion statisticheski znachimo (p < 0.05) → rekomendovat PROMOTE.
Vydat scorecard v .mlops/evaluations/run-abc123-scorecard.json
```

## Uproshchennyy otchet dlya steykkholderov

```
/evaluate-model --run-id abc123def456

Otsenka dlya netekhnicheskoy auditorii (product/finance).
Perevedi metriki v biznes-yazyk:
- Skolko churners poymaem v top-20% skora?
- Skolko "lozhnykh trevog" na 1000 klientov?
- Otseni ROI retention campaign pri konversii 35%.
Bez tekhnicheskikh terminov (AUC, F1 — vo vtorichnom bloke).
```

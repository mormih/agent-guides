# Prompt: `/test-coverage-report`

## Sravnenie s main

```
/test-coverage-report --compare main --threshold 80

Sravni coverage tekushchey vetki s main.
Porog: 80% dlya src/features/ i src/services/. Utility (src/utils/): 70%.
Dlya kazhdogo fayla nizhe poroga:
- Pokazhi konkretnye nepokrytye stroki (nomera)
- Predlozhi test-keys dlya pokrytiya samoy kritichnoy vetki
Vyvod: proshel / ne proshel coverage gate s detalyami.
```

## Audit novogo modulya

```
/test-coverage-report --threshold 80

Novyy modul src/features/subscriptions/ tolko chto smerzhen v main.
Prover coverage imenno po etoy direktorii.
Esli < 80% → sgeneriruy skelety testov dlya top-5 nepokrytykh funktsiy.
Prioritet: payment_processing > state_transitions > error_handling > notifications > utils.
```

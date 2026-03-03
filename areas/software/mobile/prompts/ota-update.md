# Prompt: `/ota-update`

## Staged rollout

```
/ota-update --bundle js-only --target 100%

Hotfix: nevernyy raschet skidki v korzine.
Izmenennye fayly: src/features/cart/CartCalculator.ts, src/utils/discount.ts
Podtverdi chto net novykh native dependencies.

Staged rollout: 5% → monitoring 30 min → 20% → monitoring 30 min → 100%.
Metriki monitoringa: JS crash rate, cart completion rate.
Prilozhi rollback komandu k otchetu (na sluchay problem).
```

## Ekstrennoe obnovlenie

```
/ota-update --bundle js-only --target 50%

Kriticheskiy UI bag: knopka "Pay" ne vidna na iPhone SE (375px ekran).
Fiks tolko v CSS/layout, native ne zatronut.
Rollout tolko do 50% — zhdem QA approval na realnom iPhone SE pered 100%.
```

# Prompt: `/ota-update`

## Staged rollout

```
/ota-update --bundle js-only --target 100%

Hotfix: неверный расчёт скидки в корзине.
Изменённые файлы: src/features/cart/CartCalculator.ts, src/utils/discount.ts
Подтверди что нет новых native dependencies.

Staged rollout: 5% → мониторинг 30 мин → 20% → мониторинг 30 мин → 100%.
Метрики мониторинга: JS crash rate, cart completion rate.
Приложи rollback команду к отчёту (на случай проблем).
```

## Экстренное обновление

```
/ota-update --bundle js-only --target 50%

Критический UI баг: кнопка "Pay" не видна на iPhone SE (375px экран).
Фикс только в CSS/layout, native не затронут.
Rollout только до 50% — ждём QA approval на реальном iPhone SE перед 100%.
```

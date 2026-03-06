# Prompt: `/ota-update`

Use when: deploying a JavaScript bundle update via Expo EAS Update or CodePush without a store review cycle.

---

## Example 1 — Critical bug fix OTA

**EN:**
```
/ota-update

Tool: Expo EAS Update
Change: hotfix — payment confirmation screen showed wrong total (display bug only, no data corruption)
Target versions: 3.1.x and 3.2.x (both affected)
Rollout: 100% immediately (critical display bug, low risk)
Validation: test on iOS 16+ and Android 12+ before push
Rollback plan: revert to previous update bundle if error rate increases
```

**RU:**
```
/ota-update

Инструмент: Expo EAS Update
Изменение: хотфикс — экран подтверждения платежа показывал неверную сумму (только визуальный баг, данные не повреждены)
Целевые версии: 3.1.x и 3.2.x (обе затронуты)
Выкатка: 100% сразу (критический визуальный баг, низкий риск)
Валидация: протестировать на iOS 16+ и Android 12+ перед публикацией
План отката: откатить к предыдущему bundle если вырастет error rate
```

# Prompt: `/visual-regression`

Use when: detecting unintended UI changes before merging a PR or releasing.

---

## Example 1 — PR visual diff review

**EN:**
```
/visual-regression

Scope: components changed in PR #156 (Button, Card, Modal)
Baseline: main branch snapshots (Percy baseline)
Changed: updated design tokens (spacing +4px, border-radius change)
Expected diffs: all Button, Card sizes will have slightly more padding — intentional
Unexpected diffs to catch: any text overflow, icon misalignment, broken dark mode
Designer must review: all diffs before baseline is updated
```

**RU:**
```
/visual-regression

Скоуп: компоненты изменённые в PR #156 (Button, Card, Modal)
Baseline: снапшоты ветки main (Percy baseline)
Изменено: обновлены design tokens (spacing +4px, изменение border-radius)
Ожидаемые diff: все размеры Button, Card будут иметь немного больше отступов — намеренно
Неожиданные diff для обнаружения: любое переполнение текста, смещение иконок, сломанный dark mode
Дизайнер должен проверить: все diff перед обновлением baseline
```

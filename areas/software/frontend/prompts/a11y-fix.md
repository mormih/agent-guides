# Prompt: `/a11y-fix`

Use when: resolving accessibility issues found in a WCAG audit or accessibility testing tool.

---

## Example 1 — Audit findings batch fix

**EN:**
```
/a11y-fix

Target: /checkout route (all 3 steps)
Audit tool: axe-core via jest-axe + manual keyboard testing
Findings:
  - [Critical] Step 2 payment form: credit card number input has no label (axe: label-content-name-mismatch)
  - [Critical] Error messages appear visually but not announced by screen reader
  - [Serious] "Continue" button disabled state not conveyed to AT (missing aria-disabled)
  - [Moderate] Focus order on mobile: jumps from address field to order summary (skips city/zip)
Designer decisions needed: error message copy (ARIA live region wording)
```

**RU:**
```
/a11y-fix

Цель: маршрут /checkout (все 3 шага)
Инструмент аудита: axe-core через jest-axe + ручное тестирование клавиатурой
Находки:
  - [Critical] Шаг 2 форма оплаты: поле номера карты без label (axe: label-content-name-mismatch)
  - [Critical] Сообщения об ошибках отображаются визуально, но не объявляются screen reader'ом
  - [Serious] Состояние disabled кнопки "Продолжить" не передаётся AT (отсутствует aria-disabled)
  - [Moderate] Порядок фокуса на мобильном: перескакивает с поля адреса на сводку заказа (пропускает city/zip)
Решения дизайнера нужны: текст сообщений об ошибках (формулировка ARIA live region)
```

# Prompt: `/visual-regression`

## Установить baseline (первый запуск)

```
/visual-regression --baseline

Первый запуск visual regression для этого проекта.
Создай baseline screenshots для всех Storybook stories.
Viewports: 375px (mobile), 768px (tablet), 1440px (desktop).
Сохранить в: tests/visual-snapshots/
```

## Сравнение в PR

```
/visual-regression --compare

Запусти сравнение для компонентов, затронутых текущим PR.
Порог: изменение > 0.1% пикселей = DIFF.
Сформируй HTML-отчёт с side-by-side и добавь summary в PR comment.
```

## Одобрить намеренные изменения

```
/visual-regression --approve

Обновили цветовую схему бренда: brand-500 #2563eb → #3b82f6.
Одобри diff'ы в компонентах: Button, Badge, Link, Alert.
Обнови baseline snapshots для этих компонентов.
```

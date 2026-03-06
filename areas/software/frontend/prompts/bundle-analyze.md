# Prompt: `/bundle-analyze`

Use when: investigating bundle size regressions or optimizing for performance budgets.

---

## Example 1 — Regression investigation

**EN:**
```
/bundle-analyze

Build artifacts: dist/ (webpack build)
Baseline: performance-budget.json (main branch)
Detected: main bundle +87KB after merging PR #203
PR added: recharts library for new dashboard charts
Budget: main bundle < 250KB gzipped (currently 337KB)
Goal: identify the culprit and options (tree-shake, lazy-load charts, or alternative library)
```

**RU:**
```
/bundle-analyze

Артефакты сборки: dist/ (webpack build)
Baseline: performance-budget.json (ветка main)
Обнаружено: main bundle +87KB после мержа PR #203
PR добавил: библиотеку recharts для новых графиков dashboard
Бюджет: main bundle < 250KB gzipped (сейчас 337KB)
Цель: определить виновника и варианты решения (tree-shake, lazy-load графиков, или альтернативная библиотека)
```

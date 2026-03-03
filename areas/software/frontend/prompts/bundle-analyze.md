# Prompt: `/bundle-analyze`

## Для PR

```
/bundle-analyze --pr

Проанализируй влияние текущего PR на размер бандла.
Сравни с baseline ветки main.
Флагировать: любой chunk увеличился > 5 KB gzipped.
Предложи оптимизации с оценкой экономии в KB.
```

## Полный аудит

```
/bundle-analyze --full

Полный аудит production бандла.
Найди: дублирующиеся зависимости, неиспользуемые импорты, candidates для tree-shaking.
Проверь наличие: moment.js (→ date-fns), lodash без named imports (→ lodash-es), @mui полный импорт.
Отчёт: chunk | текущий размер | рекомендация | потенциальная экономия.
```

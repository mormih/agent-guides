# Prompt: `/release-prep`

Use when: preparing a frontend release with coordinated quality, performance, and stakeholder sign-off.

---

## Example 1 — Planned release

**EN:**
```
/release-prep

Release: v2.8.0
Scope: 3 new features (dark mode, notification center, dashboard redesign)
Target version: 2.8.0
Success criteria:
- Lighthouse performance score ≥ 85 on key pages
- Zero new WCAG A violations
- All regression tests pass
- Bundle size within budget (< 300KB gzipped main)
Known risk: notification center uses WebSocket — first time in the app
Release notes audience: end users (non-technical)
```

**RU:**
```
/release-prep

Релиз: v2.8.0
Скоуп: 3 новые фичи (dark mode, центр уведомлений, редизайн dashboard)
Целевая версия: 2.8.0
Критерии успеха:
- Lighthouse performance score ≥ 85 на ключевых страницах
- Ноль новых WCAG A нарушений
- Все regression tests проходят
- Размер bundle в рамках бюджета (< 300KB gzipped main)
Известный риск: центр уведомлений использует WebSocket — первый раз в приложении
Аудитория release notes: конечные пользователи (нетехнические)
```

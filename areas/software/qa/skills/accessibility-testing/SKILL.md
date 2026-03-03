# Skill: Accessibility Testing

## When to load

When running automated a11y checks, reviewing UI for WCAG compliance, or setting up CI a11y gates.

## Playwright + axe-core Integration

```typescript
import AxeBuilder from '@axe-core/playwright';

test('homepage has no critical a11y violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])  // WCAG 2.1 AA
    .analyze();

  expect(results.violations.filter(v => v.impact === 'critical')).toHaveLength(0);
});
```

## Manual Keyboard Testing Checklist

- [ ] Tab through all interactive elements in visual order
- [ ] Activate buttons/links with Enter and Space
- [ ] Dismiss modals with Escape; focus returns to trigger
- [ ] Navigate dropdowns with Arrow keys
- [ ] All functionality accessible without mouse

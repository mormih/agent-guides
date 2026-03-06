---
name: accessibility-testing
type: skill
description: Run automated WCAG audits, manual keyboard/screen reader testing, and CI a11y gates.
related-rules:
  - test-strategy.md
  - quality-gates.md
allowed-tools: Read, Write, Edit, Bash
---

# Accessibility Testing Skill

> **Expertise:** axe-core automation, WCAG 2.1 AA, keyboard testing, screen reader testing (NVDA/VoiceOver), CI gates.

## Automated Testing (Playwright + axe-core)

```typescript
// tests/a11y/checkout.a11y.spec.ts
import AxeBuilder from '@axe-core/playwright';

test.describe('Checkout a11y', () => {
  test('step 1 address form has no WCAG AA violations', async ({ page }) => {
    await page.goto('/checkout/address');
    await page.waitForLoadState('networkidle');  // Wait for dynamic content

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('#third-party-widget')  // Exclude known third-party violations
      .analyze();

    // Report violations with full context for easier debugging
    if (results.violations.length > 0) {
      const report = results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        elements: v.nodes.map(n => n.html).slice(0, 3),
      }));
      console.log(JSON.stringify(report, null, 2));
    }

    // Block on critical/serious only; log moderate/minor as warnings
    const blocking = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(blocking).toHaveLength(0);
  });

  test('form inputs all have associated labels', async ({ page }) => {
    await page.goto('/checkout/address');
    const results = await new AxeBuilder({ page })
      .withRules(['label', 'label-content-name-mismatch'])
      .analyze();
    expect(results.violations).toHaveLength(0);
  });
});
```

## Keyboard Navigation Checklist (Manual)

Run this checklist on every new feature with interactive elements:

```
Tab order:
[ ] Tab key moves focus through all interactive elements in visual order
[ ] Focus never gets trapped (except modals — see below)
[ ] Focus is always visible (never hidden by CSS outline: none)

Activation:
[ ] Buttons activate with Enter and Space
[ ] Links activate with Enter only
[ ] Select/dropdown navigates with Arrow keys

Modal dialogs:
[ ] Focus moves to modal when it opens
[ ] Tab is trapped inside modal while open
[ ] Escape key closes modal
[ ] Focus returns to the trigger element when modal closes

Forms:
[ ] Each input has a visible label (not just placeholder)
[ ] Error messages are associated with their input (aria-describedby)
[ ] Required fields marked with aria-required="true"
[ ] Submit activates with Enter from any field
```

## Screen Reader Testing (Quick Reference)

### VoiceOver (macOS/iOS)
```
Enable:  Cmd + F5
Navigate: VO + Right (next element), VO + Left (previous)
Forms:   VO + Shift + Down (enter form mode)
Tables:  VO + Shift + Right/Left (navigate columns)
```

### NVDA (Windows — free)
```
Download: nvaccess.org/download
Navigate: Tab (interactive), H (headings), F (forms), L (lists)
Test:     Browse mode (default) vs. Forms mode (Enter to switch)
```

### Things to verify with screen reader:
- [ ] Page title is descriptive and unique
- [ ] Headings form a logical hierarchy (h1 → h2 → h3)
- [ ] Images have meaningful alt text (or alt="" for decorative)
- [ ] Error messages read aloud when form submitted with errors
- [ ] Dynamic content changes (toast notifications) announced via `aria-live`
- [ ] Form field labels and error messages read together

## CI Integration

```yaml
# .github/workflows/a11y.yml
a11y:
  steps:
    - name: Run accessibility audit
      run: npx playwright test tests/a11y/ --reporter=html
    - name: Upload report
      uses: actions/upload-artifact@v4
      with:
        name: a11y-report
        path: playwright-report/
```

## WCAG 2.1 AA Quick Reference

| Criterion | Level | What it means |
|---|---|---|
| 1.1.1 Non-text content | A | Images need alt text |
| 1.3.1 Info & Relationships | A | Structure conveyed programmatically |
| 1.4.3 Contrast (Minimum) | AA | 4.5:1 normal text, 3:1 large text |
| 2.1.1 Keyboard | A | All functionality keyboard accessible |
| 2.4.3 Focus Order | A | Focus order preserves meaning |
| 2.4.7 Focus Visible | AA | Keyboard focus always visible |
| 3.3.1 Error Identification | A | Errors described in text |
| 3.3.2 Labels or Instructions | A | Form inputs have labels |
| 4.1.2 Name, Role, Value | A | UI components have accessible names |

# Workflow: `/a11y-fix`

**Trigger**: `/a11y-fix [--file path/to/Component.tsx | --route /dashboard]`

**Purpose**: Audit a component or page for accessibility violations and apply automated fixes.

## Steps

```
Step 1: AUDIT target
  - Run axe-core against the target component or rendered route
  - Categorize violations: critical / serious / moderate / minor (WCAG impact)

Step 2: AUTO-FIX safe violations
  Automatically apply:
  - Missing aria-labels on icon buttons (infer from context)
  - Missing alt text on decorative images (add alt="")
  - Missing htmlFor on label elements
  - tabindex values > 0 (remove, restructure DOM order)

Step 3: REPORT manual fixes required
  For violations requiring human judgment:
  - Describe violation, WCAG criterion, and user impact
  - Provide 2–3 fix approaches with code examples
  - Estimate effort (S/M/L)

Step 4: VERIFY fixes
  - Re-run axe-core after auto-fixes
  - Confirm violation count decreased
  - Run keyboard navigation simulation (tab sequence)

Step 5: OUTPUT summary
  - Before/after violation count
  - List of auto-applied fixes
  - List of manual fixes required with guidance
```

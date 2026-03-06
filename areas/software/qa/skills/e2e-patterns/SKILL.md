---
name: e2e-patterns
type: skill
description: Write robust E2E tests with Playwright — page objects, resilient waiting, auth, and CI integration.
related-rules:
  - test-strategy.md
  - flakiness-policy.md
allowed-tools: Read, Write, Edit, Bash
---

# E2E Testing Patterns (Playwright) Skill

> **Expertise:** Playwright page objects, resilient locators, auth fixtures, parallel execution, CI configuration.

## Page Object Model

```typescript
// pages/OrderPage.ts
export class OrderPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ✅ Role-based locators — resilient to CSS changes + tests a11y
  get orderItems() { return this.page.getByRole('listitem', { name: /order item/i }); }
  get submitButton() { return this.page.getByRole('button', { name: 'Place order' }); }
  get confirmationMessage() { return this.page.getByText('Order confirmed'); }

  async addItem(productName: string, quantity: number) {
    await this.page.getByLabel('Product').selectOption(productName);
    await this.page.getByLabel('Quantity').fill(String(quantity));
    await this.page.getByRole('button', { name: 'Add to cart' }).click();
  }

  async checkout(address: Address) {
    await this.page.getByLabel('Street').fill(address.street);
    await this.page.getByLabel('City').fill(address.city);
    await this.submitButton.click();
    await expect(this.confirmationMessage).toBeVisible({ timeout: 10000 });
  }
}
```

## Resilient Waiting — Never Use `sleep`

```typescript
// ❌ Arbitrary sleep — flaky and slow
await page.waitForTimeout(2000);

// ✅ Wait for specific condition
await page.waitForURL('**/dashboard');
await expect(page.getByText('Welcome back')).toBeVisible();

// ✅ Wait for network request to complete
await Promise.all([
  page.waitForResponse(resp => resp.url().includes('/api/orders') && resp.status() === 201),
  page.getByRole('button', { name: 'Place order' }).click(),
]);

// ✅ Wait for element to reach a specific state
await expect(page.getByRole('status')).toHaveText('Processing...', { timeout: 5000 });
await expect(page.getByRole('status')).toHaveText('Complete', { timeout: 30000 });
```

## Authentication Fixture (Reuse Across Tests)

```typescript
// fixtures/auth.ts — store session state, avoid re-logging in per test
import { test as base } from '@playwright/test';

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ browser }, use) => {
    // Load stored auth state (set up once with `playwright auth`)
    const context = await browser.newContext({
      storageState: 'tests/.auth/user.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

// Set up auth state (run once before test suite)
// playwright.config.ts globalSetup points to this
export async function setupAuth() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('/login');
  await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL!);
  await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: 'tests/.auth/user.json' });
  await browser.close();
}
```

## Playwright Config (CI-Ready)

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,   // Retry on CI only
  workers: process.env.CI ? 4 : 2,
  timeout: 30000,

  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],  // For CI parsing
  ],

  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',      // Capture trace on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'setup', testMatch: /global.setup.ts/ },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: 'tests/.auth/user.json' },
    },
  ],
});
```

## Flakiness Prevention Checklist

- [ ] No `waitForTimeout` — all waits target specific conditions
- [ ] Test data created fresh per test (factory functions, not shared fixtures)
- [ ] Tests don't depend on order (can run in any sequence)
- [ ] Network requests mocked when testing UI-only behavior
- [ ] Assertions use `toBeVisible()` not `isVisible()` — auto-waits
- [ ] `retries: 2` in CI config catches transient infrastructure failures (not logic bugs)

## Locator Priority (Most to Least Resilient)

```
1. getByRole()         — semantic, tests a11y
2. getByLabel()        — form elements
3. getByText()         — visible text
4. getByTestId()       — data-testid attribute (explicit contract)
5. locator('css')      — fragile, avoid
6. locator('xpath')    — most fragile, never use
```

# Skill: E2E Testing Patterns (Playwright)

## When to load

When writing or debugging Playwright tests, designing the E2E suite, or implementing page objects.

## Page Object Model

```typescript
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email address');  // Role-based: resilient + tests a11y
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.submitButton.click();
  }
}
```

## Resilient Waiting (Never Use `sleep`)

```typescript
// ❌
await page.waitForTimeout(2000);

// ✅
await page.waitForURL('**/dashboard');
await expect(page.getByText('Welcome back')).toBeVisible();
await Promise.all([
  page.waitForResponse('**/api/users'),
  page.getByRole('button', { name: 'Load Users' }).click(),
]);
```

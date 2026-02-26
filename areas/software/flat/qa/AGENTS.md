# `.agent-os` Domain Package: QA & Test Automation

> **Version**: 1.0.0
> **Stack**: Playwright / Jest / Vitest / k6 / Allure / GitHub Actions
> **Scope**: End-to-end testing, regression suites, performance testing, test infrastructure, quality gates
> **Inherits from**: `@agent-os/global`
> **Note**: QA is a horizontal domain — it provides patterns consumed by Frontend, Backend, Mobile, and Data domains.

---

## Package Structure

```
.agent-os/
└── qa/
    ├── rules/
    │   ├── test-strategy.md
    │   ├── quality-gates.md
    │   ├── test-data.md
    │   └── flakiness-policy.md
    ├── skills/
    │   ├── test-pyramid.md
    │   ├── e2e-patterns.md
    │   ├── api-testing.md
    │   ├── performance-testing.md
    │   ├── accessibility-testing.md
    │   └── test-data-management.md
    └── workflows/
        ├── regression-suite.md
        ├── smoke-test.md
        ├── performance-audit.md
        ├── flakiness-investigation.md
        └── test-coverage-report.md
```

---

## RULES (Kernel)

---

### `rules/test-strategy.md`

# Rule: Test Strategy

**Priority**: P0 — Untested code cannot be promoted to production.

## Constraints

1. **Test pyramid proportions**: For every 1 E2E test, there must be ~5 integration tests and ~20 unit tests. Inverted pyramids (more E2E than unit) are a maintenance liability and must be refactored.
2. **Tests ship with code**: New features and bug fixes must include tests as part of the same PR. Test-later is forbidden for production code.
3. **Coverage baselines**: Coverage may not decrease on merge. New code must meet the project's minimum threshold (default: 80% line coverage for business logic).
4. **No production hotfixes without tests**: Even emergency hotfixes must include a regression test for the specific bug fixed before the fix is considered complete.
5. **Test naming convention**: Tests must describe behavior, not implementation. Format: `[component/feature] [action/scenario] [expected outcome]`
   - ✅ `"checkout with expired card shows error message"`
   - ❌ `"test_checkout_2"` or `"handlePayment works"`

---

### `rules/quality-gates.md`

# Rule: Quality Gates

**Priority**: P0 — Gates are non-negotiable; CI must enforce them automatically.

## Required Gates (Block Merge)

| Gate | Threshold | Enforcement |
|:---|:---|:---|
| Unit test pass rate | 100% | CI hard fail |
| Integration test pass rate | 100% | CI hard fail |
| Coverage (business logic) | ≥ 80% (project baseline) | CI hard fail |
| SAST scan | Zero Critical/High | CI hard fail |
| Dependency audit | Zero Critical CVEs | CI hard fail |
| Type check | Zero errors | CI hard fail |
| Lint | Zero errors | CI hard fail |

## Release Gates (Block Deploy)

| Gate | Threshold | Enforcement |
|:---|:---|:---|
| E2E smoke suite | 100% pass | Deploy pipeline |
| Performance regression | p99 latency +20% vs. baseline | Deploy pipeline |
| Accessibility scan | Zero WCAG Level A violations | Deploy pipeline |
| E2E regression suite | ≥ 98% pass rate | Deploy pipeline |

## Flakiness Gate

Any test that fails intermittently > 2% of runs on `main` branch is automatically quarantined (removed from blocking gates, added to flaky-tests tracking issue) until fixed.

---

### `rules/test-data.md`

# Rule: Test Data Management

**Priority**: P1 — Improper test data causes production incidents.

## Constraints

1. **No production data in tests**: Tests must never use real customer data, even anonymized dumps. Use synthetic data generators or fixtures.
2. **Test data is deterministic**: Tests must not depend on data created by other tests or on pre-existing database state. Each test creates its own data and cleans up after itself.
3. **No shared mutable state between tests**: Tests that share state (database records, in-memory state, files) create ordering dependencies and flakiness. Isolation is mandatory.
4. **Factories over fixtures**: Use factory patterns (factory_boy, Fishery, @faker-js/faker) to generate test data. Raw SQL fixtures become stale; factories evolve with the schema.
5. **Sensitive data in tests must be obviously fake**: Email addresses must use `@example.com`, phone numbers must use `555-` prefix, SSNs must use `000-00-XXXX` format.

---

### `rules/flakiness-policy.md`

# Rule: Flakiness Policy

**Priority**: P1 — Flaky tests destroy team trust in CI and mask real failures.

## Constraints

1. **Flakiness SLA**: Any test identified as flaky must be fixed within 5 business days or be permanently removed. Indefinitely quarantined tests are deleted.
2. **Flakiness root cause classification**: Before fixing, classify the root cause:
   - **Race condition**: Test doesn't wait for async operation properly
   - **State pollution**: Test depends on another test's side effects
   - **Environment dependency**: Test depends on external service availability
   - **Time dependency**: Test hardcodes dates or depends on `Date.now()`
   - **Order dependency**: Test only passes in specific execution order
3. **No `sleep()` to fix flakiness**: Using arbitrary `sleep`/`wait` to make tests pass is forbidden. Use proper await conditions (waitForSelector, polling assertions).
4. **Flakiness tracking**: A GitHub issue must be created for every quarantined test with reproduction steps and classification.

---

## SKILLS (Libraries)

---

### `skills/test-pyramid.md`

# Skill: Test Pyramid Strategy

## When to load

When deciding what kind of test to write, evaluating test suite health, or reviewing test coverage.

## Layer Definitions & Decision Matrix

```
                    /\
                   /E2E\          ← User journeys (5-10 per critical flow)
                  /------\
                 /  Integ  \      ← Component contracts, API contracts (1 per integration point)
                /------------\
               /  Unit Tests  \   ← Business logic, utilities, components (1 per behavior)
              /-----------------\
```

## Deciding Which Test to Write

```
New code to test → Ask these questions in order:

1. Is this a user-visible workflow? (login → action → confirmation)
   → YES: Write E2E test
   → NO: continue

2. Does this code call external systems? (DB, API, queue, file system)
   → YES: Write integration test (with real or containerized dependency)
   → NO: continue

3. Is this pure business logic, calculation, or transformation?
   → YES: Write unit test

The "test closest to the code" principle:
Prefer the smallest test scope that gives you confidence.
Don't write an E2E test when a unit test would catch the same bug.
```

## Test Doubles Decision Guide

```
Mock     → When you want to verify a function WAS called (behavior verification)
           e.g., assert sendEmail() was called once with the right arguments

Stub     → When you want to control what a dependency returns (state verification)
           e.g., make getUser() return a specific user object

Fake     → When you need a working but simplified implementation
           e.g., in-memory database instead of real PostgreSQL

Spy      → When you want to observe calls without replacing behavior
           e.g., wrap console.error to verify it was called

Contract → When testing integration boundaries between services
           e.g., Pact contract testing between consumer and provider

Rule: Never mock what you don't own. Don't mock third-party libraries;
wrap them in your own adapter and mock the adapter.
```

---

### `skills/e2e-patterns.md`

# Skill: E2E Testing Patterns (Playwright)

## When to load

When writing or debugging Playwright tests, designing the E2E test suite, or implementing page objects.

## Page Object Model (POM)

```typescript
// tests/pages/LoginPage.ts
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // ✅ Role-based selectors: resilient to CSS/HTML changes, tests a11y simultaneously
    this.emailInput = page.getByLabel('Email address');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }
}

// tests/login.spec.ts
test('login with invalid credentials shows error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('wrong@example.com', 'wrongpassword');
  await loginPage.expectError('Invalid email or password');
});
```

## Test Isolation with fixtures

```typescript
// tests/fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

// ✅ Authenticated fixture: reuse auth state across tests without re-logging in
export const test = base.extend<{
  authenticatedPage: Page;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
}>({
  // Reuse stored auth state (speeds up tests dramatically)
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'tests/.auth/user.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

// playwright.config.ts — global setup saves auth state once
export default defineConfig({
  globalSetup: './tests/global-setup.ts', // Logs in once, saves storageState
  projects: [
    {
      name: 'chromium',
      use: { storageState: 'tests/.auth/user.json' },
    },
  ],
});
```

## Resilient Waiting (Never Use `sleep`)

```typescript
// ❌ Never do this — brittle and slow
await page.waitForTimeout(2000);

// ✅ Wait for specific condition
await page.waitForURL('**/dashboard');
await expect(page.getByText('Welcome back')).toBeVisible();
await expect(page.getByRole('status')).toHaveText('Saved');

// ✅ Wait for network request to complete
await Promise.all([
  page.waitForResponse('**/api/users'),
  page.getByRole('button', { name: 'Load Users' }).click(),
]);
```

---

### `skills/api-testing.md`

# Skill: API Testing Patterns

## When to load

When writing API integration tests, testing contract compliance, or implementing API test automation.

## API Test Structure (Supertest / REST Assured)

```typescript
// tests/api/orders.test.ts
describe('POST /api/orders', () => {
  it('creates order for authenticated user', async () => {
    const { body, status } = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        items: [{ product_id: 'prod_123', quantity: 2 }],
        shipping_address_id: 'addr_456',
      });

    expect(status).toBe(201);
    expect(body).toMatchObject({
      id: expect.stringMatching(/^ord_/),
      status: 'pending',
      total_amount: expect.any(Number),
    });
    // Verify in DB
    const order = await db.orders.findById(body.id);
    expect(order).toBeTruthy();
  });

  it('returns 401 without authentication', async () => {
    const { status } = await request(app).post('/api/orders').send({});
    expect(status).toBe(401);
  });

  it('returns 422 with invalid items', async () => {
    const { body, status } = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ items: [] });

    expect(status).toBe(422);
    expect(body.errors).toContainEqual(
      expect.objectContaining({ field: 'items', code: 'min_items' })
    );
  });
});
```

## Contract Testing (Pact)

```typescript
// consumer side: defines expected contract
const orderProvider = new PactV3({
  consumer: 'frontend',
  provider: 'orders-api',
});

describe('Orders API contract', () => {
  it('returns order by ID', async () => {
    await orderProvider
      .given('order ord_123 exists')
      .uponReceiving('a request for order ord_123')
      .withRequest({ method: 'GET', path: '/api/orders/ord_123' })
      .willRespondWith({
        status: 200,
        body: like({
          id: 'ord_123',
          status: string('pending'),
          total_amount: decimal(49.99),
        }),
      })
      .executeTest(async (mockServer) => {
        const order = await apiClient.getOrder('ord_123', mockServer.url);
        expect(order.id).toBe('ord_123');
      });
  });
});
```

---

### `skills/performance-testing.md`

# Skill: Performance Testing

## When to load

When load testing a new API, establishing performance baselines, or investigating latency regressions.

## k6 Load Test Template

```javascript
// tests/performance/checkout-flow.k6.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const checkoutDuration = new Trend('checkout_duration', true);

export const options = {
  stages: [
    { duration: '2m', target: 50 },    // Ramp up to 50 users
    { duration: '5m', target: 50 },    // Sustain 50 users
    { duration: '2m', target: 200 },   // Spike to 200 users
    { duration: '5m', target: 200 },   // Sustain spike
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<2000'],  // SLO thresholds
    errors: ['rate<0.01'],                             // < 1% error rate
    checkout_duration: ['p(95)<3000'],                 // Business-critical metric
  },
};

export default function () {
  const startTime = Date.now();

  // 1. Add item to cart
  const cartRes = http.post(`${BASE_URL}/api/cart`, JSON.stringify({
    product_id: 'prod_123', quantity: 1,
  }), { headers: { 'Content-Type': 'application/json' } });

  check(cartRes, { 'cart item added': (r) => r.status === 200 });
  errorRate.add(cartRes.status !== 200);

  // 2. Checkout
  const checkoutRes = http.post(`${BASE_URL}/api/checkout`, JSON.stringify({
    cart_id: cartRes.json('cart_id'),
    payment_method_id: 'pm_test_123',
  }), { headers: { 'Content-Type': 'application/json' } });

  check(checkoutRes, { 'checkout successful': (r) => r.status === 201 });
  checkoutDuration.add(Date.now() - startTime);

  sleep(1);
}
```

## Performance Baseline Process

```
Step 1: Establish baseline on stable release (not during active development)
Step 2: Run suite under realistic production-like load
Step 3: Record: p50, p95, p99 latency; error rate; throughput
Step 4: Store baseline in performance-baselines.json
Step 5: On each release candidate, compare against baseline
         - p99 regression > 20%: block deploy, investigate
         - p99 regression 10-20%: warning, document justification
         - p99 regression < 10%: acceptable, note in release notes
```

---

### `skills/test-data-management.md`

# Skill: Test Data Management

## When to load

When setting up test fixtures, implementing test factories, managing test databases, or debugging test pollution.

## Factory Pattern (TypeScript)

```typescript
// tests/factories/user.factory.ts
import { faker } from '@faker-js/faker';

interface UserOverrides {
  email?: string;
  role?: 'admin' | 'editor' | 'viewer';
  plan?: 'free' | 'pro' | 'enterprise';
}

export function buildUser(overrides: UserOverrides = {}) {
  return {
    id: `usr_${faker.string.alphanumeric(8)}`,
    email: faker.internet.email({ provider: 'example.com' }),  // Never real domains
    name: faker.person.fullName(),
    role: 'viewer' as const,
    plan: 'free' as const,
    created_at: faker.date.past({ years: 1 }).toISOString(),
    ...overrides,  // Overrides applied last
  };
}

// Database-persisted factory
export async function createUser(overrides: UserOverrides = {}) {
  const userData = buildUser(overrides);
  const user = await db.users.create(userData);
  return user;
}

// Usage in tests:
const adminUser = await createUser({ role: 'admin' });
const proUser = buildUser({ plan: 'pro' });  // In-memory only
```

## Database Isolation Strategies

```typescript
// Strategy 1: Transaction rollback (fastest — unit/integration tests)
beforeEach(async () => {
  await db.beginTransaction();
});
afterEach(async () => {
  await db.rollback();  // All test data gone; no cleanup needed
});

// Strategy 2: Truncate tables (slower but compatible with all ORMs)
afterEach(async () => {
  await db.raw('TRUNCATE users, orders, products CASCADE');
});

// Strategy 3: Test containers (for E2E — fresh DB per suite)
// Uses testcontainers library to spin up real DB in Docker
beforeAll(async () => {
  container = await new PostgreSqlContainer().start();
  await runMigrations(container.getConnectionUri());
});
```

---

## WORKFLOWS (Applications)

---

### `workflows/regression-suite.md`

# Workflow: `/regression-suite`

**Trigger**: `/regression-suite [--env staging|production] [--scope full|critical|smoke]`

**Purpose**: Execute the full regression suite and produce a quality report before or after deployment.

## Steps

```
Step 1: SELECT test scope
  smoke:    ~20 tests covering the top 5 critical user paths (< 5 min)
  critical: ~100 tests covering all revenue/auth/data flows (< 20 min)
  full:     All E2E tests (< 60 min, run nightly or pre-release only)

Step 2: PREPARE environment
  - Verify target environment health (endpoint responding, auth working)
  - Reset test data to known state (seed users, products, settings)
  - Set test flags (disable rate limiting, use test payment methods)

Step 3: EXECUTE suite
  - Run Playwright tests in parallel (max workers = CPU count × 2)
  - Record video on failure (always); on pass (for critical tests only)
  - Capture screenshots on failure automatically

Step 4: ANALYZE results
  - Identify: passed / failed / skipped / flaky (passed on retry)
  - For failures: classify as new failure vs. known flaky
  - For new failures: extract error, screenshot, and reproduction steps

Step 5: REPORT
  - Generate Allure HTML report
  - Summary: pass rate, duration, coverage of user flows
  - Failure details: stack trace, screenshot, last passing run reference
  - Post summary to PR/Slack

Step 6: GATE decision
  - smoke/critical: any failure = block
  - full: < 2% failure (known flaky excluded) = pass
```

---

### `workflows/smoke-test.md`

# Workflow: `/smoke-test`

**Trigger**: `/smoke-test [--env staging|production] [--post-deploy]`

**Purpose**: Rapid validation that core functionality works after a deployment or infrastructure change.

## Steps

```
Step 1: VERIFY environment
  - Health check: all service endpoints respond with 200
  - Auth endpoint: test login with smoke-test account
  - Database: simple read query succeeds

Step 2: EXECUTE critical path tests
  Run the 15-20 highest-priority tests:
  - User authentication (login/logout/password reset)
  - Core business transaction (e.g., create order, submit form)
  - Payment flow (with test payment method)
  - Key API endpoints (expected status codes and response shapes)

Step 3: VERIFY integrations
  - Third-party webhooks: trigger and confirm receipt
  - Email: send test email, verify delivery log
  - Background jobs: enqueue test job, verify completion

Step 4: REPORT
  - Duration: must complete in < 5 minutes
  - Pass/fail per test with timing
  - If any failure: post alert to #deployments channel immediately
  - Auto-trigger rollback if --post-deploy flag and > 1 critical test fails
```

---

### `workflows/performance-audit.md`

# Workflow: `/performance-audit`

**Trigger**: `/performance-audit [--endpoint /api/orders] [--type load|stress|spike|soak]`

**Purpose**: Measure and report on API/system performance against defined SLOs.

## Steps

```
Step 1: CONFIGURE test scenario
  load:   Simulate expected peak traffic (e.g., 200 concurrent users)
  stress: Find breaking point (ramp until errors > 5%)
  spike:  Simulate sudden 10× traffic surge
  soak:   Run at normal load for 2 hours (find memory leaks, slow degradation)

Step 2: ESTABLISH baseline (if first run)
  - Run test against last stable production version
  - Record: p50, p95, p99 latency; throughput; error rate; resource utilization

Step 3: EXECUTE test
  - Run k6 scenario against target environment
  - Monitor APM dashboards in parallel
  - Record infrastructure metrics (CPU, memory, connections) during test

Step 4: COMPARE to baseline and SLOs
  - Regression check: p99 vs. baseline
  - SLO check: p99 vs. defined threshold

Step 5: IDENTIFY bottlenecks
  - Slow queries (if DB monitoring enabled)
  - Memory pressure (GC pauses, heap growth)
  - CPU saturation points
  - External service latency contribution

Step 6: REPORT
  - Performance summary table: metric | baseline | current | delta | status
  - Bottleneck analysis with specific recommendations
  - Infrastructure scaling recommendations if needed
```

---

### `workflows/flakiness-investigation.md`

# Workflow: `/flakiness-investigation`

**Trigger**: `/flakiness-investigation [--test "test name or file path"]`

**Purpose**: Diagnose and fix a flaky test following a structured root cause analysis process.

## Steps

```
Step 1: GATHER data
  - Fetch last 20 CI runs for the test
  - Compute flakiness rate: (failures / total runs) × 100
  - Identify pattern: random? time-of-day? specific environment? after specific tests?

Step 2: CLASSIFY root cause
  Run the test 10 times locally in isolation to check:
  - Passes 10/10 in isolation: likely STATE POLLUTION (depends on another test)
  - Fails sometimes in isolation: likely RACE CONDITION or TIME DEPENDENCY

  Check test code for:
  - sleep() calls: → replace with proper await
  - Date.now() / new Date(): → mock time in tests
  - Shared variables between test cases: → move to beforeEach
  - Missing await on async operations: → add await
  - External service calls without mocking: → mock or use test environment

Step 3: REPRODUCE reliably
  - Run test 50 times: npx playwright test --repeat-each=50 test-name.spec.ts
  - Confirm reproduction rate

Step 4: IMPLEMENT fix
  - Apply fix based on root cause classification
  - Add comments explaining why the fix is necessary

Step 5: VERIFY fix
  - Run test 50 times: confirm 0 failures
  - Remove from flaky-tests quarantine list
  - Close tracking issue
```

---

### `workflows/test-coverage-report.md`

# Workflow: `/test-coverage-report`

**Trigger**: `/test-coverage-report [--compare main] [--threshold 80]`

**Purpose**: Generate a coverage report, identify gaps, and recommend tests for uncovered critical paths.

## Steps

```
Step 1: RUN coverage
  - Execute full test suite with coverage instrumentation
  - Collect: line, branch, function, statement coverage

Step 2: COMPARE branches (if --compare flag)
  - Download coverage from target branch (main/previous release)
  - Compute delta: which files increased/decreased coverage?

Step 3: IDENTIFY critical gaps
  Prioritize uncovered code by:
  - Revenue-critical paths (checkout, payment, auth) → HIGH priority
  - Error handling branches → MEDIUM priority  
  - Utility functions → LOW priority

  Flag files below threshold (default 80%):
  - Show specific uncovered lines
  - Estimate lines of test code needed to reach threshold

Step 4: GENERATE recommendations
  For top 5 coverage gaps:
  - Describe what scenario is untested
  - Generate a test skeleton for the gap

Step 5: REPORT
  - Overall coverage: current vs. baseline vs. threshold
  - Coverage by module/feature area
  - Top 10 uncovered critical functions with test suggestions
  - PR comment with summary table and trend
```

---

## Domain Boundary Notes

### QA ↔ Frontend
- **Overlap**: Component testing, visual regression, accessibility testing.
- **Decision**: Frontend owns unit and component tests (RTL). QA owns E2E flows and regression suites. Visual regression and a11y automation live in both — Frontend defines component-level checks, QA defines page-level flows.

### QA ↔ Backend SDLC
- **Overlap**: API testing, integration testing, contract testing.
- **Decision**: Backend owns unit tests for service logic. QA owns API integration tests and cross-service contract tests. Performance testing of APIs is owned by QA.

### QA ↔ Platform
- **Overlap**: CI/CD pipeline integration, test environment provisioning.
- **Decision**: Platform owns the pipeline infrastructure. QA defines the test stages, thresholds, and gates that run within that pipeline.

---

## Changelog

| Version | Date | Changes |
|:---|:---|:---|
| 1.0.0 | 2026-02-16 | Initial release. Playwright/k6/Pact stack. Full pyramid coverage. |

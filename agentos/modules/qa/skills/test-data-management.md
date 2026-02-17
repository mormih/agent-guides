# Skill: Test Data Management

## When to load

When setting up test fixtures, implementing test factories, or debugging test pollution.

## Factory Pattern

```typescript
import { faker } from '@faker-js/faker';

export function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: `usr_${faker.string.alphanumeric(8)}`,
    email: faker.internet.email({ provider: 'example.com' }),  // Never real domains
    name: faker.person.fullName(),
    role: 'viewer' as const,
    ...overrides,
  };
}

export async function createUser(overrides = {}) {
  return db.users.create(buildUser(overrides));
}
```

## Database Isolation

```typescript
// Fastest: transaction rollback
beforeEach(async () => { await db.beginTransaction(); });
afterEach(async () => { await db.rollback(); });

// Compatible: truncate tables
afterEach(async () => { await db.raw('TRUNCATE users, orders CASCADE'); });
```

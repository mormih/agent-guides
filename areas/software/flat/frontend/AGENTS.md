# `agent-config` Domain Package: Frontend Engineering

> **Version**: 1.0.0
> **Stack**: React / TypeScript / Tailwind CSS / Vite
> **Scope**: Browser-based web applications, component libraries, design systems

---

## Package Structure

```
agent-config/
└── frontend/
    ├── rules/
    │   ├── accessibility.md
    │   ├── architecture.md
    │   ├── performance.md
    │   └── quality.md
    ├── skills/
    │   ├── component-design.md
    │   ├── state-management.md
    │   ├── performance-tuning.md
    │   ├── a11y-audit.md
    │   ├── css-architecture.md
    │   ├── testing-patterns.md
    │   ├── api-integration.md
    │   └── error-handling.md
    └── workflows/
        ├── scaffold-component.md
        ├── visual-regression.md
        ├── bundle-analyze.md
        ├── a11y-fix.md
        └── release-prep.md
```

---

## RULES (Kernel)

> Rules are **always active**. The agent must never violate these constraints.
> They represent non-negotiable architectural and quality decisions for this domain.

---

### `rules/accessibility.md`

# Rule: Accessibility First

**Priority**: P0 — Blocks merge if violated.

## Constraints

1. Every interactive element (`button`, `a`, `input`, `select`, custom widget) **must** have an accessible name via `aria-label`, `aria-labelledby`, or visible text content.
2. Color contrast ratio must be **≥ 4.5:1** for normal text and **≥ 3:1** for large text (WCAG 2.1 AA).
3. All functionality must be operable via **keyboard only** (Tab, Shift+Tab, Enter, Space, Arrow keys).
4. Images must have meaningful `alt` attributes; decorative images use `alt=""`.
5. Dynamic content updates (toasts, modals, form errors) must be announced via `aria-live` regions or focus management.
6. No `tabindex` values greater than `0` are permitted.

## Verification

The agent must run `axe-core` or `eslint-plugin-jsx-a11y` checks before considering any UI component complete.

---

### `rules/architecture.md`

# Rule: Component Architecture

**Priority**: P0 — Structural violations require refactor before shipping.

## Constraints

1. **Atomic Design Boundary**: Atoms have no internal state. Molecules compose atoms. Organisms own local UI state. Pages own data-fetching. Templates are layout-only.
2. **No Prop Drilling beyond 2 levels**: Pass data via context, state management, or composition — never chain props more than 2 components deep.
3. **Co-location**: A component's styles, tests, and stories must live in the same directory as the component file.
4. **Single Responsibility**: One component = one visual responsibility. A component that fetches data AND renders a complex layout must be split into a container and a presentational component.
5. **No Business Logic in Components**: Domain logic (calculations, transformations, validation rules) must live in custom hooks (`use*.ts`) or utility modules (`lib/`), not in JSX.
6. **No Circular Imports**: Module dependency graph must be a DAG. Use `eslint-plugin-import` to enforce.

## Directory Convention

```
src/
├── components/        # Atoms, Molecules, Organisms (pure UI)
├── features/          # Feature slices (container + domain logic)
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── store/
│       └── types.ts
├── pages/             # Route-level components (data orchestration)
├── lib/               # Shared utilities, helpers, constants
├── hooks/             # Shared custom hooks
└── types/             # Global TypeScript types
```

---

### `rules/performance.md`

# Rule: Performance Budget

**Priority**: P1 — Must be resolved before release; tracked per PR.

## Core Web Vitals Targets (Production)

| Metric | Target | Hard Limit |
|:---|:---|:---|
| LCP (Largest Contentful Paint) | < 2.0s | < 2.5s |
| INP (Interaction to Next Paint) | < 100ms | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.05 | < 0.1 |

## Bundle Constraints

1. **Initial JS bundle**: ≤ 200 KB gzipped for the critical path (above-the-fold).
2. **Route-level chunks**: Every route must be lazy-loaded via `React.lazy()` + `Suspense`.
3. **Third-party libraries**: Any dependency > 50 KB gzipped must be explicitly approved in `bundle-policy.md`.
4. **No synchronous localStorage access** in the render path.
5. Images must use modern formats (WebP/AVIF) and include `width`/`height` attributes to prevent layout shift.

## Enforcement

Bundle size is tracked via `bundlesize` in CI. PRs that increase the initial bundle by > 5 KB trigger a mandatory `/bundle-analyze` workflow run.

---

### `rules/quality.md`

# Rule: Code Quality

**Priority**: P1 — Violations block merge via automated lint gates.

## Constraints

1. **TypeScript strict mode** is non-negotiable (`strict: true` in `tsconfig.json`). No `any` without an explicit `// eslint-disable` comment explaining why.
2. **No hardcoded user-facing strings**: All copy must use i18n keys from the localization system (`t('key.path')`).
3. **No direct DOM manipulation**: Never use `document.getElementById`, `querySelector`, or `innerHTML` from within React components. Use refs (`useRef`) where necessary.
4. **State immutability**: Never mutate state objects directly. All state updates must produce a new reference.
5. **Test coverage**: New components must ship with ≥ 1 rendering test and ≥ 1 interaction test. Coverage may not drop below project baseline.
6. **No `console.log` in committed code**: Use the project's structured logger (`lib/logger.ts`).

---

## SKILLS (Libraries)

> Skills are **loaded on demand** by the agent based on semantic relevance to the current task.
> Each skill contains condensed, actionable knowledge — patterns, anti-patterns, and decision trees.

---

### `skills/component-design.md`

# Skill: Component Design Patterns

## When to load

When creating a new UI component, refactoring an existing one, designing a component API, or reviewing component structure.

## Pattern 1: Compound Components

Use when a component has multiple related parts that share implicit state.

```tsx
// ✅ Good: Compound pattern for Menu
const Menu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div role="menu">{children}</div>
    </MenuContext.Provider>
  );
};
Menu.Trigger = MenuTrigger;
Menu.Item = MenuItem;

// Usage:
<Menu>
  <Menu.Trigger>Options</Menu.Trigger>
  <Menu.Item onSelect={handleDelete}>Delete</Menu.Item>
</Menu>
```

**Anti-pattern**: Passing all parts as props to a monolithic component (`<Menu triggerLabel="Options" items={[...]} />`). This couples the parent to Menu's internal structure.

## Pattern 2: Render Props / Slots via `children`

Use for maximum flexibility when the consumer controls rendering.

```tsx
// ✅ Good: Slot-based Card
interface CardProps {
  header: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}
const Card = ({ header, footer, children }: CardProps) => (
  <div className="card">
    <div className="card__header">{header}</div>
    <div className="card__body">{children}</div>
    {footer && <div className="card__footer">{footer}</div>}
  </div>
);
```

## Pattern 3: Controlled vs Uncontrolled

- **Uncontrolled**: Component manages its own state. Simple, less flexible. Use for isolated UI.
- **Controlled**: Parent owns the state. Required for form libraries, validation, cross-component sync.
- **Hybrid (Recommended for library components)**: Accept optional `value` + `onChange` props. If `value` is provided, behave as controlled; otherwise manage internally.

```tsx
const Input = ({ value, onChange, defaultValue }: InputProps) => {
  const [internal, setInternal] = useState(defaultValue ?? '');
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternal(e.target.value);
    onChange?.(e.target.value);
  };
  return <input value={current} onChange={handleChange} />;
};
```

## Decision Tree: Which Pattern to Use?

```
Does the component have multiple visual "zones" (header, body, footer)?
  → YES: Use Slots/Render Props
Does the component have coordinated subcomponents (tabs + panels, menu + items)?
  → YES: Use Compound Components
Is this a form input that needs to work with react-hook-form or similar?
  → YES: Use Controlled/Hybrid
Is this a simple, self-contained widget?
  → Use Uncontrolled with clear defaults
```

---

### `skills/state-management.md`

# Skill: State Management

## When to load

When deciding where to put state, choosing between local/global state, integrating server state, or debugging stale data.

## State Classification Matrix

| State Type | Example | Solution |
|:---|:---|:---|
| **Local UI State** | Modal open/close, input focus | `useState` / `useReducer` |
| **Shared UI State** | Theme, sidebar collapse | React Context + `useReducer` |
| **Server/Remote State** | API data, pagination | React Query / SWR |
| **URL State** | Filters, search params, active tab | `useSearchParams` (React Router) |
| **Global App State** | Auth session, shopping cart | Zustand / Redux Toolkit |
| **Form State** | Input values, validation errors | React Hook Form |

## Rule: Colocate State

State should live as **close to where it's used** as possible. Only lift state up when two components genuinely need to share it.

```
❌ Bad: Storing modal visibility in a global store
✅ Good: Storing modal visibility in the component that renders the modal

❌ Bad: Using Context for a value only used in one subtree
✅ Good: Using useState at the nearest common ancestor
```

## React Query: Key Patterns

```tsx
// ✅ Correct: Query keys are arrays and encode all dependencies
const { data } = useQuery({
  queryKey: ['users', { page, filters }],
  queryFn: () => fetchUsers({ page, filters }),
  staleTime: 5 * 60 * 1000, // 5 minutes — avoid over-fetching
});

// ✅ Correct: Mutations invalidate related queries
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
});
```

## Zustand: Slice Pattern

```ts
// store/auth.slice.ts
interface AuthState {
  user: User | null;
  token: string | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: async (credentials) => {
    const { user, token } = await authApi.login(credentials);
    set({ user, token });
  },
  logout: () => set({ user: null, token: null }),
}));
```

---

### `skills/performance-tuning.md`

# Skill: Frontend Performance Tuning

## When to load

When optimizing Core Web Vitals, reducing bundle size, diagnosing render performance, or reviewing images/fonts.

## Re-render Prevention Checklist

```tsx
// 1. Memoize expensive computations
const sorted = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items]  // Only recalculates when items changes
);

// 2. Stable callback references
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);  // Only changes when id changes

// 3. Memoize child components that receive object/function props
const ExpensiveList = React.memo(({ items, onSelect }: ListProps) => (
  // ... rendering
));

// ⚠️ Common mistake: inline objects/arrays create new references every render
// ❌ Bad:
<MyComponent config={{ timeout: 3000 }} />
// ✅ Good:
const CONFIG = { timeout: 3000 };
<MyComponent config={CONFIG} />
```

## Code Splitting Strategy

```tsx
// Route-level splitting (mandatory per performance rules)
const UserDashboard = lazy(() => import('./features/users/UserDashboard'));
const AdminPanel = lazy(() => import('./features/admin/AdminPanel'));

// Feature-level: split heavy UI libraries
const RichTextEditor = lazy(() =>
  import('./components/RichTextEditor').then(m => ({ default: m.RichTextEditor }))
);

// Always wrap lazy components with Suspense + meaningful fallback
<Suspense fallback={<PageSkeleton />}>
  <UserDashboard />
</Suspense>
```

## Image Optimization Checklist

- [ ] Use `<img>` with explicit `width` and `height` to prevent CLS
- [ ] Serve WebP/AVIF via `<picture>` with JPG/PNG fallback
- [ ] Use `loading="lazy"` for below-fold images
- [ ] Use `loading="eager"` + `fetchpriority="high"` for LCP image
- [ ] Images from CDN: enable responsive sizing via `srcset`

## Bundle Analysis: Identify Heaviest Dependencies

```bash
# Generate a visual bundle map
npx vite-bundle-visualizer
# or for webpack:
npx webpack-bundle-analyzer stats.json
```

**Common culprits and solutions:**

| Library | Problem | Solution |
|:---|:---|:---|
| `moment.js` | 300KB+ | Replace with `date-fns` (tree-shakeable) |
| `lodash` | Entire lib imported | Use `lodash-es` + named imports |
| `@mui/material` | Full import | Use path imports: `@mui/material/Button` |
| Large icons | All icons bundled | Use dynamic icon loading or SVG sprites |

---

### `skills/a11y-audit.md`

# Skill: Accessibility Audit & Remediation

## When to load

When building interactive components, reviewing a PR for accessibility, fixing a11y lint errors, or preparing a WCAG audit report.

## Automated Checks (Run First)

```bash
# In development: real-time browser feedback
# Install axe DevTools Chrome extension

# In CI: programmatic checks
npm install --save-dev @axe-core/playwright
# Configure in e2e tests to run axe on key pages
```

## Most Common Violations & Fixes

### 1. Missing button accessible name
```tsx
// ❌ Violation: icon-only button with no label
<button onClick={onClose}>
  <CloseIcon />
</button>

// ✅ Fix: aria-label describes the action
<button onClick={onClose} aria-label="Close dialog">
  <CloseIcon aria-hidden="true" />
</button>
```

### 2. Form inputs without labels
```tsx
// ❌ Violation: placeholder is not a label
<input type="email" placeholder="Email address" />

// ✅ Fix: explicit label association
<label htmlFor="email">Email address</label>
<input id="email" type="email" placeholder="jane@example.com" />
```

### 3. Focus management in modals
```tsx
// ✅ Correct modal focus management
const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) firstFocusableRef.current?.focus();
  }, [isOpen]);

  return isOpen ? (
    <div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      {children}
      <button ref={firstFocusableRef} onClick={onClose}>Close</button>
    </div>
  ) : null;
};
```

### 4. Dynamic content announcements
```tsx
// ✅ Live region for status messages (toasts, form feedback)
const StatusMessage = ({ message }: { message: string }) => (
  <div aria-live="polite" aria-atomic="true" className="sr-only">
    {message}
  </div>
);
```

## Keyboard Navigation Checklist

- [ ] Tab order follows visual reading order (no `tabindex > 0`)
- [ ] Custom dropdown: Arrow keys navigate options, Escape closes, Enter selects
- [ ] Modals: Focus trapped inside; Escape closes; returns focus to trigger
- [ ] Tables: Arrow key navigation for complex data grids
- [ ] All hover interactions have a keyboard equivalent

---

### `skills/css-architecture.md`

# Skill: CSS Architecture (Tailwind-first)

## When to load

When styling components, creating design tokens, organizing CSS, or reviewing for style consistency.

## Token Hierarchy (Design System)

```ts
// tailwind.config.ts — extend, never override base values
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',  // Primary action color
          900: '#1e3a5f',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          elevated: '#f1f5f9',
        },
      },
      spacing: {
        '4.5': '1.125rem',  // Only add if genuinely needed
      },
    },
  },
};
```

## Class Organization Convention (DTCV)

Order Tailwind classes as: **D**isplay → **T**ypography → **C**olor → **V**isuals

```tsx
// ✅ Readable and consistent order
<div className="
  flex items-center gap-3        // Display / Layout
  text-sm font-medium            // Typography
  text-gray-700                  // Color
  bg-white rounded-lg shadow-sm  // Visuals / Decoration
  p-4 hover:bg-gray-50           // Spacing / States
  transition-colors duration-150 // Animation
">
```

## When to Reach for CSS Modules (vs Tailwind)

Use CSS Modules (`.module.css`) for:
- Complex animations (`@keyframes`)
- `:before` / `:after` pseudo-elements with substantial styles
- Styles that depend on CSS custom properties set at runtime

Use Tailwind for everything else.

## Component Variants Pattern

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const button = cva(
  // Base styles (always applied)
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        primary: 'bg-brand-500 text-white hover:bg-brand-600',
        secondary: 'bg-surface-muted text-gray-700 hover:bg-surface-elevated',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = ({ variant, size, className, ...props }: ButtonProps) => (
  <button className={button({ variant, size, className })} {...props} />
);
```

---

### `skills/testing-patterns.md`

# Skill: Frontend Testing Patterns

## When to load

When writing tests for components, hooks, or integration flows; when reviewing test quality; when debugging flaky tests.

## Testing Philosophy

Test **behavior**, not implementation. A user doesn't know or care that you called `setState`. They care that clicking "Submit" shows a success message.

```
❌ Bad (testing implementation):
expect(component.state.isLoading).toBe(true);

✅ Good (testing behavior):
expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
```

## Component Test Template

```tsx
// UserCard.test.tsx
import { render, screen, userEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

const defaultUser: User = {
  id: '1',
  name: 'Jane Smith',
  email: 'jane@example.com',
  role: 'admin',
};

describe('UserCard', () => {
  it('renders user information', () => {
    render(<UserCard user={defaultUser} />);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    render(<UserCard user={defaultUser} onEdit={onEdit} />);

    await userEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledWith(defaultUser.id);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('shows admin badge for admin users', () => {
    render(<UserCard user={{ ...defaultUser, role: 'admin' }} />);
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  it('hides edit button when onEdit is not provided', () => {
    render(<UserCard user={defaultUser} />);
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
  });
});
```

## Custom Hook Testing

```tsx
// useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

it('increments count', () => {
  const { result } = renderHook(() => useCounter(0));
  act(() => { result.current.increment(); });
  expect(result.current.count).toBe(1);
});
```

## MSW: Mock API Calls in Tests

```ts
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () =>
    HttpResponse.json([{ id: '1', name: 'Jane' }])
  ),
  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: '2', ...body }, { status: 201 });
  }),
];
```

## What Requires Each Test Type?

| Scenario | Test Type |
|:---|:---|
| Component renders correctly | Unit (RTL) |
| User interaction flow (click, type, submit) | Unit (RTL + userEvent) |
| Data fetching + loading/error states | Unit (RTL + MSW) |
| Cross-component navigation flow | Integration (RTL) |
| Full user journey (login → action → result) | E2E (Playwright) |

---

### `skills/api-integration.md`

# Skill: API Integration Patterns

## When to load

When connecting a component to a REST or GraphQL API, handling loading/error states, implementing optimistic updates, or managing pagination.

## Standard Fetch Layer

```ts
// lib/api-client.ts — centralized HTTP client
const apiClient = {
  get: async <T>(path: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
        ...options?.headers,
      },
    });
    if (!res.ok) throw new ApiError(res.status, await res.json());
    return res.json();
  },
  // post, put, patch, delete follow same pattern
};
```

## Loading & Error State Pattern

```tsx
// ✅ Consistent pattern for all data-fetching components
const UserList = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get<User[]>('/users'),
  });

  if (isLoading) return <UserListSkeleton />;  // Always use skeleton, not spinner for lists
  if (isError) return <ErrorMessage message={error.message} />;

  return <ul>{data.map(user => <UserItem key={user.id} user={user} />)}</ul>;
};
```

## Optimistic Updates

```tsx
const mutation = useMutation({
  mutationFn: (id: string) => apiClient.delete(`/todos/${id}`),
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previous = queryClient.getQueryData<Todo[]>(['todos']);
    // Optimistically remove
    queryClient.setQueryData<Todo[]>(['todos'], old => old?.filter(t => t.id !== id));
    return { previous }; // snapshot for rollback
  },
  onError: (_err, _id, context) => {
    queryClient.setQueryData(['todos'], context?.previous); // Rollback
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});
```

---

### `skills/error-handling.md`

# Skill: Frontend Error Handling

## When to load

When adding error boundaries, handling async errors, logging client-side errors, or building error UI states.

## Error Boundary Pattern

```tsx
// components/ErrorBoundary.tsx — required wrapper for all route-level components
class ErrorBoundary extends React.Component<
  { fallback: React.ComponentType<{ error: Error; reset: () => void }> },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error('UI Error', { error: error.message, componentStack: info.componentStack });
  }

  render() {
    if (this.state.error) {
      const Fallback = this.props.fallback;
      return <Fallback error={this.state.error} reset={() => this.setState({ error: null })} />;
    }
    return this.props.children;
  }
}

// Usage at route level:
<ErrorBoundary fallback={RouteErrorFallback}>
  <UserDashboard />
</ErrorBoundary>
```

## Async Error Classification

```ts
// lib/errors.ts
export class ApiError extends Error {
  constructor(public status: number, public body: unknown) {
    super(`API Error ${status}`);
  }
}

// In components: differentiate error types for better UX
if (error instanceof ApiError) {
  if (error.status === 401) return <LoginRedirect />;
  if (error.status === 403) return <ForbiddenMessage />;
  if (error.status === 404) return <NotFound />;
}
return <GenericError message={error.message} />;
```

---

## WORKFLOWS (Applications)

> Workflows are **explicitly triggered** by the developer with a slash command.
> Each workflow is a sequential procedure the agent executes autonomously.

---

### `workflows/scaffold-component.md`

# Workflow: `/scaffold-component`

**Trigger**: `/scaffold-component [ComponentName] [--type atom|molecule|organism] [--with-story] [--with-api]`

**Purpose**: Generate a complete, production-ready component with all required collocated files.

## Steps

```
Step 1: PARSE inputs
  - Extract ComponentName (PascalCase validation)
  - Determine atomic level from --type flag or prompt user
  - Identify target directory based on type

Step 2: GENERATE component files
  Create: src/components/[ComponentName]/
  ├── [ComponentName].tsx          ← Main component (typed props, forwardRef if input)
  ├── [ComponentName].test.tsx     ← 4 baseline tests: render, interaction, variants, a11y
  ├── [ComponentName].stories.tsx  ← Storybook story (Default + all variants)
  └── index.ts                     ← Barrel export

Step 3: VALIDATE generated files
  - Run TypeScript compiler: tsc --noEmit
  - Run ESLint with a11y plugin on generated file
  - Run the generated tests: vitest run [ComponentName]

Step 4: GENERATE barrel export
  - Add export to src/components/index.ts

Step 5: OUTPUT summary
  - List created files
  - Show any TS/lint warnings
  - Suggest next steps (e.g., "Add to design system Storybook")
```

## Output Example

```
✅ Created: src/components/SearchInput/
   ├── SearchInput.tsx        (34 lines)
   ├── SearchInput.test.tsx   (52 lines, 4 tests passing)
   ├── SearchInput.stories.tsx (28 lines)
   └── index.ts
⚠️  Warning: SearchInput uses onSearch callback — consider debouncing (see skill: performance-tuning)
```

---

### `workflows/visual-regression.md`

# Workflow: `/visual-regression`

**Trigger**: `/visual-regression [--baseline | --compare | --approve]`

**Purpose**: Detect unintended visual changes to UI components between branches.

## Steps

```
Step 1: IDENTIFY scope
  - Determine which Storybook stories are affected by changed files (via git diff)
  - Limit scope to changed components (avoid running all stories on small PRs)

Step 2: RUN screenshot capture
  - Build Storybook: storybook build
  - Run Playwright against built Storybook
  - Capture screenshots for each affected story at [mobile: 375px, tablet: 768px, desktop: 1440px]

Step 3: COMPARE to baseline
  - Load baseline screenshots from /tests/visual-snapshots/
  - Compute pixel diff using pixelmatch
  - Threshold: > 0.1% pixel change = DIFF detected

Step 4: REPORT results
  - List all components with diffs (with diff percentage)
  - Generate HTML report with side-by-side comparisons
  - Annotate PR comment with summary and link to report

Step 5: AWAIT approval (if diffs detected)
  - If /visual-regression --approve is run: update baseline snapshots
  - If no diffs: mark check as passed automatically
```

---

### `workflows/bundle-analyze.md`

# Workflow: `/bundle-analyze`

**Trigger**: `/bundle-analyze [--pr | --full]`

**Purpose**: Analyze the impact of current changes on JavaScript bundle size and identify optimization opportunities.

## Steps

```
Step 1: BUILD with stats
  - Run: vite build --mode production
  - Generate bundle stats: vite-bundle-visualizer --json stats.json

Step 2: COMPARE against baseline (main branch)
  - Fetch stats.json from the last successful main branch build
  - Compute deltas per chunk: initial, vendor, feature chunks

Step 3: ANALYZE impact
  - Flag any chunk that increased by > 5 KB gzipped
  - Identify top 5 heaviest modules in the diff
  - Check for duplicate dependencies (same library at multiple versions)

Step 4: SUGGEST optimizations
  - Match heavy modules against known optimization patterns (skill: performance-tuning)
  - Generate specific, actionable suggestions:
    e.g. "lodash (45 KB) → import from lodash-es with tree shaking saves ~32 KB"

Step 5: OUTPUT report
  - Summary table: chunk name | baseline | current | delta | status
  - Detailed module list for any flagged chunks
  - Optimization recommendations with estimated savings
```

---

### `workflows/a11y-fix.md`

# Workflow: `/a11y-fix`

**Trigger**: `/a11y-fix [--file path/to/Component.tsx | --route /dashboard]`

**Purpose**: Audit a component or page for accessibility violations and apply automated fixes.

## Steps

```
Step 1: AUDIT target
  - Run axe-core against the target component or rendered route
  - Categorize violations by: critical / serious / moderate / minor (WCAG impact)

Step 2: AUTO-FIX safe violations
  Automatically apply fixes for:
  - Missing aria-labels on icon buttons (add based on context analysis)
  - Missing alt text on decorative images (add alt="")
  - Missing htmlFor on label elements
  - tabindex values > 0 (remove and restructure DOM order)

Step 3: REPORT manual fixes required
  For violations that require human judgment:
  - Describe the violation, its WCAG criterion, and the user impact
  - Provide 2–3 possible fix approaches with code examples
  - Estimate implementation effort (S/M/L)

Step 4: VERIFY fixes
  - Re-run axe-core after auto-fixes
  - Confirm violation count has decreased
  - Run keyboard navigation check (simulate tab sequence)

Step 5: OUTPUT summary
  - Before/after violation count
  - List of auto-applied fixes
  - List of manual fixes required with guidance
```

---

### `workflows/release-prep.md`

# Workflow: `/release-prep`

**Trigger**: `/release-prep [version]` (e.g., `/release-prep 2.4.0`)

**Purpose**: Prepare the frontend for a production release — validation gates, changelog generation, and pre-flight checks.

## Steps

```
Step 1: VALIDATE quality gates
  - TypeScript: tsc --noEmit (zero errors required)
  - Lint: eslint src/ (zero errors; warnings summarized)
  - Tests: vitest run (100% pass rate required)
  - Coverage: check baseline not regressed

Step 2: CHECK performance budget
  - Run /bundle-analyze --full
  - Verify all Core Web Vitals pass in Lighthouse CI
  - Flag any budget violations as release blockers

Step 3: RUN accessibility sweep
  - Execute /a11y-fix --route for all primary routes
  - Fail release if any WCAG Level A violations exist

Step 4: GENERATE changelog
  - Parse git log from last release tag to HEAD
  - Categorize commits by: feat / fix / perf / breaking
  - Generate CHANGELOG.md entry in Keep a Changelog format
  - Bump version in package.json

Step 5: CREATE release artifact
  - Tag commit: git tag -a v[version] -m "Release [version]"
  - Generate release notes summary for Slack/Jira announcement
  - Output: Go/No-Go decision with all gate results
```

---

## Domain Boundary Notes

### Frontend ↔ Mobile (Client Engineering)
- **Overlap**: React Native and Flutter share state management and component thinking.
- **Decision point**: If the project uses React Native *only* with no native modules, consider a single `client-react` package. If there are native Swift/Kotlin modules, maintain separate `frontend-web` and `mobile-native` packages.

### Frontend ↔ Backend (Full-Stack)
- **Overlap**: Next.js/Remix blur the line — Server Components, Server Actions, and API routes live in the same codebase.
- **Decision point**: Apply Frontend rules to all client-rendered code. For Server Components performing DB queries, apply Backend SDLC rules (security, SQL safety, auth). A full-stack `agent-config` config should import both domain packages.

### Frontend ↔ Design System
- **Overlap**: If a team maintains a shared component library, many of the Frontend skills apply, but the audience is other developers, not end users.
- **Recommendation**: Create a child domain `design-system` that extends `frontend` with additional skills for `token-governance`, `component-versioning`, and `api-stability`.

---

## Changelog

| Version | Date | Changes |
|:---|:---|:---|
| 1.0.0 | 2026-02-16 | Initial release. Covers React/TypeScript/Tailwind/Vite stack. |

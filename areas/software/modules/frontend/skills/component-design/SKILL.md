# Skill: Component Design Patterns

## When to load

When creating a new UI component, refactoring an existing one, designing a component API, or reviewing component structure.

## Pattern 1: Compound Components

Use when a component has multiple related parts that share implicit state.

```tsx
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
```

## Pattern 2: Slots via children props

```tsx
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

## Pattern 3: Controlled / Uncontrolled Hybrid

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

## Decision Tree

```
Multiple visual "zones"?      → Slots/Render Props
Coordinated subcomponents?    → Compound Components
Works with react-hook-form?   → Controlled/Hybrid
Self-contained widget?        → Uncontrolled with defaults
```

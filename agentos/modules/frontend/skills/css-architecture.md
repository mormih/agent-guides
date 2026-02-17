# Skill: CSS Architecture (Tailwind-first)

## When to load

When styling components, creating design tokens, organizing CSS, or reviewing for style consistency.

## Token Hierarchy

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: { 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a5f' },
        surface: { DEFAULT: '#ffffff', muted: '#f8fafc', elevated: '#f1f5f9' },
      },
    },
  },
};
```

## Class Organization (DTCV Order)

Display → Typography → Color → Visuals

```tsx
<div className="
  flex items-center gap-3
  text-sm font-medium
  text-gray-700
  bg-white rounded-lg shadow-sm
  p-4 hover:bg-gray-50
  transition-colors duration-150
">
```

## Component Variants (cva)

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const button = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
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
```

## When to Use CSS Modules vs Tailwind

Use CSS Modules for: complex `@keyframes`, `:before`/`:after` with substantial styles, runtime CSS custom properties.
Use Tailwind for everything else.

# Workflow: `/scaffold-component`

**Trigger**: `/scaffold-component [ComponentName] [--type atom|molecule|organism] [--with-story]`

**Purpose**: Generate a complete, production-ready component with all required collocated files.

## Steps

```
Step 1: PARSE inputs
  - Extract ComponentName (validate PascalCase)
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
  - Run ESLint with a11y plugin
  - Run the generated tests: vitest run [ComponentName]

Step 4: ADD to barrel export
  - Append export to src/components/index.ts

Step 5: OUTPUT summary
  - List created files with line counts
  - Show any TS/lint warnings
```

## Output Example

```
✅ Created: src/components/SearchInput/
   ├── SearchInput.tsx        (34 lines)
   ├── SearchInput.test.tsx   (52 lines, 4 tests passing)
   ├── SearchInput.stories.tsx (28 lines)
   └── index.ts
⚠️  Warning: SearchInput uses onSearch callback — consider debouncing
```

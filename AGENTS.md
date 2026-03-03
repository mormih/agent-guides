# AGENTS

## Dynamic loading of guidance

The set of loaded guidance is configurable by the user and may change per project.
Do not assume only statically listed files are available.

In addition to built-in guidance, discover and load custom files from the target project directory when present.

## Expected project tree

```text
project_dir/
└── .agent/
    ├── rules/
    ├── skills/
    ├── workflows/
    └── prompts/
```

## Discovery patterns

- `project_dir/.agent/rules/*`
- `project_dir/.agent/skills/*`
- `project_dir/.agent/workflows/*`
- `project_dir/.agent/prompts/*`

Prefer relative paths in references inside markdown files.

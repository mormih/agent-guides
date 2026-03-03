# AGENTS

## Dynamic loading of guidance

The set of loaded guidance is configurable by the user and may change per project.
Do not assume only statically listed files are available.

In addition to built-in `rules`, `skills`, and `workflows`, also discover and load custom files from the target project directory when present, for example:

- `project_dir/.agent/rules/*`
- `project_dir/.agent/skills/*`
- `project_dir/.agent/workflows/*`

Prefer relative paths in references inside markdown files.

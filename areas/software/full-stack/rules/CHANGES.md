# Rules Cleanup: full-stack → general migration

## Files to DELETE from full-stack/rules/ (duplicates of general/)
These files are exact duplicates or covered by general/rules — remove from full-stack to avoid loading twice:

- `code-style-guide.md` → duplicate of `general/rules/code-style-guide.md`
- `git-versioning-guide.md` → covered by `general/rules/git-workflow-guide.md`
- `docker-compose-guide.md` → duplicate of `general/rules/docker-compose-guide.md` (if present, or move there)
- `lint-format-guide.md` → duplicate of `general/rules/lint-format-guide.md`
- `project-setup-guide.md` → move to `general/rules/` (cross-cutting concern)
- `ci-cd-deployment-guide.md` → move to `general/rules/` (cross-cutting concern)
- `env-settings-guide.md` → move to `general/rules/` (cross-cutting concern)

## Files to KEEP in full-stack/rules/ (genuinely full-stack specific)
- `backend-architecture-rule.md`
- `api-design-guide.md`
- `async-concurrency-guide.md`
- `background-jobs-guide.md`
- `code-quality-guide.md`
- `database-access-guide.md`
- `database-migrations-guide.md`
- `domain-models-guide.md`
- `e2e-test-guide.md`
- `error-handling-guide.md`
- `logging-observability-guide.md`
- `project-guide.md`
- `python-venv-guide.md`
- `security-guide.md`
- `svt-test-guide.md`
- `testing-ci-guide.md`

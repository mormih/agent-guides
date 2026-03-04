---
name: project-setup-workflow
type: workflow
description: Standard workflow for bootstrapping a new software project with tooling, CI, and documentation.
inputs:
  - project_name
  - language_or_framework
  - target_platform
outputs:
  - initialized_repository
  - ci_pipeline_configured
  - readme_and_docs
roles-involved:
  - product-owner
  - pm
  - team-lead
  - developer
  - qa
  - designer
related-rules:
  - git-workflow-guide.md
  - makefile-guide.md
  - docker-compose-guide.md
  - lint-format-guide.md
uses-skills:
  - general-dev-tools
---

## Goal

Bootstrap a new project with a clean, reproducible development environment and CI pipeline from day one.

## Phase 1 — Repository Setup

1. Create repository on GitHub/GitLab with a meaningful name and description.
2. Clone locally and set up branch protection on `main`.
3. Add `.gitignore` for the language/framework (use `gitignore.io` or GitHub templates).
4. Add `README.md` with:
   - Project description and purpose
   - Prerequisites
   - Quick start (`make install && make dev`)
   - Links to docs, CI status badge

## Phase 2 — Development Environment

1. Create `Makefile` with standard targets: `install`, `dev`, `test`, `lint`, `fmt`, `clean`, `help`.
2. If multi-service: create `docker-compose.yml` with health checks and `.env.example`.
3. Configure language toolchain (virtual env, node_modules, go modules, etc.).
4. Add `.editorconfig` for consistent whitespace across editors.

## Phase 3 — Code Quality Tooling

1. Add linter config (`.eslintrc`, `pyproject.toml [tool.ruff]`, `.golangci.yml`).
2. Add formatter config (`prettier.config.js`, `[tool.black]`, etc.).
3. Configure `pre-commit`:
   ```yaml
   repos:
     - repo: https://github.com/pre-commit/pre-commit-hooks
       hooks: [trailing-whitespace, end-of-file-fixer, check-yaml]
   ```
4. Run `pre-commit install` and `pre-commit run --all-files` — fix any issues.

## Phase 4 — CI Pipeline

1. Create CI config (`.github/workflows/ci.yml` or `.gitlab-ci.yml`).
2. Pipeline must run: lint → test → build on every PR.
3. Set up branch protection: require passing CI before merge.
4. Add CI status badge to README.

## Phase 5 — First Commit

1. `git add -A && git commit -m "chore: initial project setup"`.
2. Push and verify CI passes on the default branch.
3. Create first `CHANGELOG.md` entry: `## [Unreleased]`.


## Subagent Step Ownership

1. **Requirements framing** — Owner: `@product-owner` (+ `@pm` for delivery constraints).
2. **Design/plan validation** — Owner: `@team-lead` (+ `@designer` for UX-facing work).
3. **Implementation** — Owner: `@developer`.
4. **Verification and risk assessment** — Owner: `@qa`.
5. **Review and release decision** — Owner: `@team-lead` + `@product-owner` (coordinated by `@pm`).

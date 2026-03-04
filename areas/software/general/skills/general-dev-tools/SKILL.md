---
name: general-dev-tools
type: skill
description: Proficiency with core software development tools used across any project — git, docker, make, and CI/CD platforms.
inputs:
  - task_description
  - project_context
outputs:
  - working_environment
  - executed_commands
related-rules:
  - git-workflow-guide.md
  - makefile-guide.md
  - docker-compose-guide.md
  - lint-format-guide.md
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# General Dev Tools Skill

> **Expertise:** Git, Docker Compose, Makefile, GitHub Actions, GitLab CI, shell scripting, linting, formatting.

## Mindset

- **Repeatability:** All setup steps must be automatable via `make` targets or scripts.
- **Portability:** Commands must work consistently across developer machines and CI environments.
- **Security:** Never expose secrets; use environment variables and secret managers.
- **Observability:** Always check command exit codes; prefer explicit error messages over silent failures.

## Toolkit

| Category            | Tool                           | Usage                                     |
| :------------------ | :----------------------------- | :---------------------------------------- |
| **Version Control** | `git`                          | Branching, commits, tags, merges          |
| **Containers**      | `docker`, `docker-compose`     | Local environment, service orchestration  |
| **Build**           | `make`                         | Task runner, developer ergonomics         |
| **CI/CD**           | GitHub Actions / GitLab CI     | Automated pipelines                       |
| **Linting**         | `ruff`, `eslint`, `shellcheck` | Code quality enforcement                  |
| **Formatting**      | `black`, `prettier`, `gofmt`   | Consistent code style                     |
| **Hooks**           | `pre-commit`                   | Automated checks before commit            |

## Implementation Checklist

1. **Project Initialization:**
   - `git init` + create `.gitignore` appropriate for the language/framework.
   - Create `Makefile` with `install`, `dev`, `test`, `lint`, `fmt`, `clean`, `help` targets.
   - Create `docker-compose.yml` if any services are needed.
   - Configure `.pre-commit-config.yaml` with relevant hooks.

2. **CI/CD Setup:**
   - Create pipeline config (`.github/workflows/ci.yml` or `.gitlab-ci.yml`).
   - Pipeline stages: lint → test → build → (deploy).
   - Store secrets in the platform's secret store.

3. **Code Quality:**
   - Run `make lint` — zero errors.
   - Run `make fmt` — all files formatted.
   - Run `make test` — all tests pass.

4. **Git Workflow:**
   - Create feature branch: `git checkout -b feature/<task-id>-description`.
   - Commit with conventional format: `git commit -m "feat(scope): message"`.
   - Open PR/MR with description, linked issue, and passing CI.

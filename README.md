# Software Instruction Areas

This repository provides reusable instruction bundles for AI coding agents.
The core idea is to **copy standardized artifacts** into a target project so the agent starts with strong domain guidance and lower prompt-context overhead.

## Why this approach

Instruction copying gives every run a predictable baseline for:

- architecture and coding constraints (`rules`),
- contextual task capabilities (`skills`),
- execution sequences (`workflows`),
- ready-to-run invocation templates (`prompts`),
- tool-facing entrypoint policies (`AGENTS.md`).

As a result, different coding tools can execute a more reliable SDLC path: design → implementation → testing → debugging → release.

---

## Installer usage

Use `agentos-install.sh` to copy a selected module or flat package into your project.

```bash
./agentos-install.sh list modules
./agentos-install.sh list flat
./agentos-install.sh install --module frontend --target ./my-app --format all
./agentos-install.sh install --flat frontend --target ./my-app --format codex
```

---

## AI coding tool vs expected project artifacts

| AI coding tool | Installer format | Expected artifacts in target project |
|---|---|---|
| Antigravity | `antigravity` | `./.agent/rules`, `./.agent/skills`, `./.agent/workflows`, `./.agent/prompts` |
| KiloCode | `kilocode` | `./.kilocode/rules`, `./.kilocode/skills`, `./.kilocode/workflows`, `./.kilocode/prompts` |
| Cursor | `cursor` | `./.cursor/rules`, `./.cursor/skills`, `./.cursor/workflows`, `./.cursor/prompts` |
| Codex | `codex` | `./AGENTS.md` (plus copied trees when using `all`/`both`) |
| Claude | `claude` | `./AGENTS.md` (plus copied trees when using `all`/`both`) |
| OpenCode | `opencode` | `./AGENTS.md` (plus copied trees when using `all`/`both`) |
| Generic agents | `agents` | `./AGENTS.md` |

---

## Detailed script examples per AI tool

### Antigravity
```bash
./agentos-install.sh install --module backend --target ./project-antigravity --format antigravity
```

### KiloCode
```bash
./agentos-install.sh install --module qa --target ./project-kilocode --format kilocode
```

### Cursor
```bash
./agentos-install.sh install --module mobile --target ./project-cursor --format cursor
```

### Codex
```bash
./agentos-install.sh install --flat platform --target ./project-codex --format codex
```

### Claude
```bash
./agentos-install.sh install --flat security --target ./project-claude --format claude
```

### OpenCode
```bash
./agentos-install.sh install --flat frontend --target ./project-opencode --format opencode
```

### All compatible artifacts at once
```bash
./agentos-install.sh install --module frontend --target ./project-all --format all
```

---

## Repository catalogs

## 1) Modules catalog (`areas/software/modules`)

Each module contains operational artifacts:

- `rules/`
- `skills/` (`skills/<name>/SKILL.md`)
- `workflows/`
- `prompts/`

Examples:

- Backend module: [`areas/software/modules/backend/rules/architecture.md`](areas/software/modules/backend/rules/architecture.md)
- Backend skill: [`areas/software/modules/backend/skills/api-design/SKILL.md`](areas/software/modules/backend/skills/api-design/SKILL.md)
- Frontend workflow: [`areas/software/modules/frontend/workflows/scaffold-component.md`](areas/software/modules/frontend/workflows/scaffold-component.md)

## 2) Flat catalog (`areas/software/flat`)

Each flat package is self-contained and includes:

- `AGENTS.md`
- `PROMPTS.md`

Examples:

- Frontend flat package: [`areas/software/flat/frontend/AGENTS.md`](areas/software/flat/frontend/AGENTS.md)
- Frontend prompts: [`areas/software/flat/frontend/PROMPTS.md`](areas/software/flat/frontend/PROMPTS.md)
- Security flat package: [`areas/software/flat/security/AGENTS.md`](areas/software/flat/security/AGENTS.md)
- Security prompts: [`areas/software/flat/security/PROMPTS.md`](areas/software/flat/security/PROMPTS.md)

---

## Prompt files index

### modules/*/prompts/*
- [`areas/software/modules/backend/prompts/add-migration.md`](areas/software/modules/backend/prompts/add-migration.md)
- [`areas/software/modules/backend/prompts/code-review.md`](areas/software/modules/backend/prompts/code-review.md)
- [`areas/software/modules/backend/prompts/create-endpoint.md`](areas/software/modules/backend/prompts/create-endpoint.md)
- [`areas/software/modules/backend/prompts/debug-issue.md`](areas/software/modules/backend/prompts/debug-issue.md)
- [`areas/software/modules/backend/prompts/develop-epic.md`](areas/software/modules/backend/prompts/develop-epic.md)
- [`areas/software/modules/backend/prompts/develop-feature.md`](areas/software/modules/backend/prompts/develop-feature.md)
- [`areas/software/modules/backend/prompts/refactor-module.md`](areas/software/modules/backend/prompts/refactor-module.md)
- [`areas/software/modules/backend/prompts/system-prompt.md`](areas/software/modules/backend/prompts/system-prompt.md)
- [`areas/software/modules/backend/prompts/test-feature.md`](areas/software/modules/backend/prompts/test-feature.md)
- [`areas/software/modules/data-engineering/prompts/backfill-data.md`](areas/software/modules/data-engineering/prompts/backfill-data.md)
- [`areas/software/modules/data-engineering/prompts/data-quality-incident.md`](areas/software/modules/data-engineering/prompts/data-quality-incident.md)
- [`areas/software/modules/data-engineering/prompts/lineage-trace.md`](areas/software/modules/data-engineering/prompts/lineage-trace.md)
- [`areas/software/modules/data-engineering/prompts/new-model.md`](areas/software/modules/data-engineering/prompts/new-model.md)
- [`areas/software/modules/data-engineering/prompts/schema-migration.md`](areas/software/modules/data-engineering/prompts/schema-migration.md)
- [`areas/software/modules/frontend/prompts/a11y-fix.md`](areas/software/modules/frontend/prompts/a11y-fix.md)
- [`areas/software/modules/frontend/prompts/bundle-analyze.md`](areas/software/modules/frontend/prompts/bundle-analyze.md)
- [`areas/software/modules/frontend/prompts/release-prep.md`](areas/software/modules/frontend/prompts/release-prep.md)
- [`areas/software/modules/frontend/prompts/scaffold-component.md`](areas/software/modules/frontend/prompts/scaffold-component.md)
- [`areas/software/modules/frontend/prompts/visual-regression.md`](areas/software/modules/frontend/prompts/visual-regression.md)
- [`areas/software/modules/full-stack/prompts/backend-feature-impl.md`](areas/software/modules/full-stack/prompts/backend-feature-impl.md)
- [`areas/software/modules/full-stack/prompts/backend-new-project.md`](areas/software/modules/full-stack/prompts/backend-new-project.md)
- [`areas/software/modules/full-stack/prompts/backend-run-tests.md`](areas/software/modules/full-stack/prompts/backend-run-tests.md)
- [`areas/software/modules/full-stack/prompts/frontend-run-tests.md`](areas/software/modules/full-stack/prompts/frontend-run-tests.md)
- [`areas/software/modules/mlops/prompts/champion-challenger.md`](areas/software/modules/mlops/prompts/champion-challenger.md)
- [`areas/software/modules/mlops/prompts/deploy-endpoint.md`](areas/software/modules/mlops/prompts/deploy-endpoint.md)
- [`areas/software/modules/mlops/prompts/evaluate-model.md`](areas/software/modules/mlops/prompts/evaluate-model.md)
- [`areas/software/modules/mlops/prompts/model-incident.md`](areas/software/modules/mlops/prompts/model-incident.md)
- [`areas/software/modules/mlops/prompts/train-experiment.md`](areas/software/modules/mlops/prompts/train-experiment.md)
- [`areas/software/modules/mobile/prompts/crash-triage.md`](areas/software/modules/mobile/prompts/crash-triage.md)
- [`areas/software/modules/mobile/prompts/device-testing.md`](areas/software/modules/mobile/prompts/device-testing.md)
- [`areas/software/modules/mobile/prompts/ota-update.md`](areas/software/modules/mobile/prompts/ota-update.md)
- [`areas/software/modules/mobile/prompts/release-build.md`](areas/software/modules/mobile/prompts/release-build.md)
- [`areas/software/modules/mobile/prompts/store-submission.md`](areas/software/modules/mobile/prompts/store-submission.md)
- [`areas/software/modules/platform/prompts/cost-audit.md`](areas/software/modules/platform/prompts/cost-audit.md)
- [`areas/software/modules/platform/prompts/deploy-production.md`](areas/software/modules/platform/prompts/deploy-production.md)
- [`areas/software/modules/platform/prompts/drift-check.md`](areas/software/modules/platform/prompts/drift-check.md)
- [`areas/software/modules/platform/prompts/incident-response.md`](areas/software/modules/platform/prompts/incident-response.md)
- [`areas/software/modules/platform/prompts/provision-env.md`](areas/software/modules/platform/prompts/provision-env.md)
- [`areas/software/modules/qa/prompts/flakiness-investigation.md`](areas/software/modules/qa/prompts/flakiness-investigation.md)
- [`areas/software/modules/qa/prompts/performance-audit.md`](areas/software/modules/qa/prompts/performance-audit.md)
- [`areas/software/modules/qa/prompts/regression-suite.md`](areas/software/modules/qa/prompts/regression-suite.md)
- [`areas/software/modules/qa/prompts/smoke-test.md`](areas/software/modules/qa/prompts/smoke-test.md)
- [`areas/software/modules/qa/prompts/test-coverage-report.md`](areas/software/modules/qa/prompts/test-coverage-report.md)
- [`areas/software/modules/security/prompts/compliance-report.md`](areas/software/modules/security/prompts/compliance-report.md)
- [`areas/software/modules/security/prompts/pen-test-sim.md`](areas/software/modules/security/prompts/pen-test-sim.md)
- [`areas/software/modules/security/prompts/secret-rotation.md`](areas/software/modules/security/prompts/secret-rotation.md)
- [`areas/software/modules/security/prompts/security-scan.md`](areas/software/modules/security/prompts/security-scan.md)
- [`areas/software/modules/security/prompts/threat-model-review.md`](areas/software/modules/security/prompts/threat-model-review.md)

### flat/*/PROMPTS.md
- [`areas/software/flat/backend/PROMPTS.md`](areas/software/flat/backend/PROMPTS.md)
- [`areas/software/flat/data-engineering/PROMPTS.md`](areas/software/flat/data-engineering/PROMPTS.md)
- [`areas/software/flat/frontend/PROMPTS.md`](areas/software/flat/frontend/PROMPTS.md)
- [`areas/software/flat/mlops/PROMPTS.md`](areas/software/flat/mlops/PROMPTS.md)
- [`areas/software/flat/mobile/PROMPTS.md`](areas/software/flat/mobile/PROMPTS.md)
- [`areas/software/flat/platform/PROMPTS.md`](areas/software/flat/platform/PROMPTS.md)
- [`areas/software/flat/qa/PROMPTS.md`](areas/software/flat/qa/PROMPTS.md)
- [`areas/software/flat/security/PROMPTS.md`](areas/software/flat/security/PROMPTS.md)

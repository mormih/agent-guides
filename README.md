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
./agentos-install.sh install --flat agent-os-frontend --target ./my-app --format codex
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
./agentos-install.sh install --flat agent-os-platform --target ./project-codex --format codex
```

### Claude
```bash
./agentos-install.sh install --flat agent-os-security --target ./project-claude --format claude
```

### OpenCode
```bash
./agentos-install.sh install --flat agent-os-frontend --target ./project-opencode --format opencode
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

- Frontend flat package: [`areas/software/flat/agent-os-frontend/AGENTS.md`](areas/software/flat/agent-os-frontend/AGENTS.md)
- Frontend prompts: [`areas/software/flat/agent-os-frontend/PROMPTS.md`](areas/software/flat/agent-os-frontend/PROMPTS.md)
- Security flat package: [`areas/software/flat/agent-os-security/AGENTS.md`](areas/software/flat/agent-os-security/AGENTS.md)
- Security prompts: [`areas/software/flat/agent-os-security/PROMPTS.md`](areas/software/flat/agent-os-security/PROMPTS.md)

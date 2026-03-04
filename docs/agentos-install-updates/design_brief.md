# Design Brief: AgentOS Install Updates

## Problem Statement

The current `agentos-install.sh` script uses a uniform approach for copying files to target projects, placing all content in `.agent/` directories. However, different AI coding assistants (agent OS) have different expected directory structures:

- **opencode**: expects `.opencode/commands` for workflows
- **cursor**: uses `.cursor/` with rules and skills
- **kilocode**: uses `.kilocode/` with full directory support
- **antigravity**: shares kilocode's structure

Additionally, there is no centralized location for general software development practices that apply across all specializations.

---

## Design Goals

1. **Agent-specific directory mapping**: Support different directory structures per agent OS
2. **Maintain backward compatibility**: Ensure existing installations continue to work
3. **Consistent content structure**: Follow existing patterns from other software areas
4. **Clear separation of concerns**: Keep general practices separate from specialized domains

---

## Technical Design

### Agent Directory Mapping

```bash
# Configuration structure for agent-specific paths
declare -A AGENTOS_DIR_MAP=(
    [opencode_rules]=".opencode/rules"
    [opencode_skills]=".opencode/skills"
    [opencode_workflows]=".opencode/commands"
    [cursor_rules]=".cursor/rules"
    [cursor_skills]=".cursor/skills"
    [kilocode_rules]=".kilocode/rules"
    [kilocode_skills]=".kilocode/skills"
    [kilocode_workflows]=".kilocode/workflows"
)
```

### File Copy Logic

1. Check if source directory exists in project root (../rules, ../skills, ../workflows)
2. Look up destination based on agent OS type
3. Copy contents maintaining directory structure
4. Log all copy operations

### Root AGENTS.md Structure

The updated root AGENTS.md will include:

1. **Git Practices**
   - Branching strategy (main, develop, feature/*, bugfix/*)
   - Commit message conventions
   - PR/merge request workflow

2. **Platform Integration**
   - GitLab CI/CD basics
   - GitHub Actions patterns
   - Pull request best practices

3. **Development Tools**
   - Makefile conventions
   - docker-compose usage
   - Environment configuration

4. **Code Quality**
   - Linting standards
   - Formatting conventions
   - Pre-commit hooks

5. **Methodology**
   - SDLC overview
   - Code review process
   - Release workflow

### General Area Structure

```
.agent/
├── AGENTS.md              # Index file
├── rules/
│   ├── git-best-practices.md
│   ├── github-workflow.md
│   ├── gitlab-ci-basics.md
│   ├── makefile-conventions.md
│   ├── docker-compose-guide.md
│   ├── lint-format-standards.md
│   ├── sdlc-methodology.md
│   └── code-style-guidelines.md
├── skills/
│   └── general-dev-tools/
│       └── SKILL.md
└── workflows/
    └── standard-development-flow.md
```

---

## Edge Cases

1. **Missing source directories**: Skip copying if source doesn't exist
2. **Existing destination files**: Overwrite with newer versions
3. **Invalid agent OS**: Fall back to default `.agent/` structure
4. **Partial installations**: Handle cases where only some directories exist

---

## Backward Compatibility

- Default agent OS continues to use `.agent/` structure
- Existing install scripts remain functional
- No breaking changes to CLI interface

---

## Success Metrics

- All four agent OS types (opencode, cursor, kilocode, antigravity) install correctly
- Files are placed in the correct agent-specific directories
- General area is discoverable alongside other software areas
- Root AGENTS.md provides clear guidance for developers

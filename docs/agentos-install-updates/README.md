# AgentOS Install Updates - Feature Documentation

## Overview

This feature introduces three major updates:
1. Modify `agentos-install.sh` to support different directory structures for specific agentos (opencode, cursor, kilocode, antigravity)
2. Update root AGENTS.md with general software development practices
3. Create new area `areas/software/general/` for basic development tools and industry rules

---

## Feature Components

### 1. AgentOS Install Script Modifications

**Feature Name**: Agent-specific Directory Structure Support

**Description**: Modify `agentos-install.sh` to copy files with different directory mappings based on the target agent OS.

**Binding**: `agentos-install.sh` script

**User Stories**:
- As a developer using opencode, I want rules copied to `.opencode/rules`, skills to `.opencode/skills`, and workflows to `.opencode/commands`
- As a developer using cursor, I want rules copied to `.cursor/rules` and skills to `.cursor/skills`
- As a developer using kilocode, I want rules copied to `.kilocode/rules`, skills to `.kilocode/skills`, and workflows to `.kilocode/workflows`
- As a developer using antigravity, I want the same directory structure as kilocode

**Directory Mapping**:

| Agent OS | Source | Destination |
|----------|--------|-------------|
| opencode | ../rules | .opencode/rules |
| opencode | ../skills | .opencode/skills |
| opencode | ../workflows | .opencode/commands |
| cursor | ../rules | .cursor/rules |
| cursor | ../skills | .cursor/skills |
| kilocode | ../rules | .kilocode/rules |
| kilocode | ../skills | .kilocode/skills |
| kilocode | ../workflows | .kilocode/workflows |
| antigravity | ../rules | .kilocode/rules |
| antigravity | ../skills | .kilocode/skills |
| antigravity | ../workflows | .kilocode/workflows |

**Technical Requirements**:
- Add new function `copy_agentos_specific_assets()` to handle agent-specific directory mappings
- Add configuration mapping for each supported agent OS
- Handle the case where source directories don't exist
- Preserve existing extension copying logic for backward compatibility

---

### 2. Root AGENTS.md Updates

**Feature Name**: General Software Development Practices

**Description**: Add comprehensive software development practices to the root AGENTS.md file.

**Binding**: Root `AGENTS.md` file

**Topics to Include**:
- Git best practices (branching strategy, commit messages, PR workflow)
- GitLab and GitHub workflows
- Makefile usage and conventions
- Docker-compose basics
- Linting and formatting standards
- SDLC methodology overview
- Code style guidelines

**User Stories**:
- As a developer, I want to understand the project's git workflow
- As a new team member, I want to understand the SDLC methodology
- As a developer, I want clear code style guidelines

---

### 3. New Area: software/general

**Feature Name**: Software General Knowledge Base

**Description**: Create a new area for general software development tools and industry rules.

**Binding**: `areas/software/general/` directory

**Directory Structure**:

```
areas/software/general/
├── AGENTS.md
├── rules/
│   ├── git-best-practices.md
│   ├── docker-compose-guide.md
│   ├── makefile-conventions.md
│   ├── lint-format-standards.md
│   ├── sdlc-methodology.md
│   └── code-style-guidelines.md
├── skills/
│   └── general-dev-tools/
│       └── SKILL.md
└── workflows/
    └── standard-development-flow.md
```

**User Stories**:
- As a developer, I want access to general development tool guides
- As a team lead, I want consistent rules across all projects
- As a QA engineer, I want to understand the standard development workflow

---

## Data Requirements

### Source Files to Create

1. **Root AGENTS.md**: Update existing file with new content
2. **areas/software/general/**: Create new directory structure with:
   - AGENTS.md (index file)
   - rules/*.md (8-10 rule files)
   - skills/general-dev-tools/SKILL.md
   - workflows/*.md (2-3 workflow files)

### No API Requirements

This feature does not require any external APIs.

---

## Implementation Notes

### agentos-install.sh Changes

1. Add agent-specific directory mapping configuration
2. Create new function to handle agent-specific copying
3. Update the install flow to use agent-specific paths
4. Ensure backward compatibility with default agent OS

### General Area Content

The new `areas/software/general/` should include:
- Clear, concise rules that apply to all software projects
- Practical examples where helpful
- Links to deeper resources
- Industry-standard practices

---

## Acceptance Criteria

1. The install script correctly copies files to agent-specific directories
2. Each agent OS (opencode, cursor, kilocode, antigravity) gets the correct directory structure
3. Root AGENTS.md contains comprehensive development practices
4. New general area follows the same structure as other software areas
5. All new content is well-organized and discoverable

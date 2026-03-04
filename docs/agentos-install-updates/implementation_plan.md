# Implementation Plan: AgentOS Install Updates

## Phase 1: Modify agentos-install.sh

### Task 1.1: Add Agent Directory Configuration
- **Description**: Add configuration array for agent-specific directory mappings
- **File**: `agentos-install.sh`
- **Steps**:
  1. Add `AGENTOS_DIR_MAP` associative array
  2. Define mappings for opencode, cursor, kilocode, antigravity

### Task 1.2: Create copy_agentos_specific_assets Function
- **Description**: New function to handle agent-specific file copying
- **File**: `agentos-install.sh`
- **Steps**:
  1. Create function with parameters (project_dir, agent_os)
  2. Look up source directories from project root
  3. Map to correct destination based on agent type
  4. Call copy_dir_contents for each valid mapping

### Task 1.3: Update Install Flow
- **Description**: Integrate agent-specific copying into main install process
- **File**: `agentos-install.sh`
- **Steps**:
  1. Add call to copy_agentos_specific_assets in run_install
  2. Ensure it runs after copy_extension
  3. Test with all four agent OS types

### Estimated Time: 2-3 hours

---

## Phase 2: Update Root AGENTS.md

### Task 2.1: Add Git Practices Section
- **Description**: Document git branching, commits, PR workflow
- **File**: `AGENTS.md`
- **Sections**:
  - Branching strategy
  - Commit message format
  - PR/MR guidelines

### Task 2.2: Add Platform Integration Section
- **Description**: GitLab and GitHub specific workflows
- **File**: `AGENTS.md`
- **Sections**:
  - GitHub Actions basics
  - GitLab CI/CD overview

### Task 2.3: Add Development Tools Section
- **Description**: Makefile, docker-compose, linting, formatting
- **File**: `AGENTS.md`
- **Sections**:
  - Makefile conventions
  - Docker-compose usage
  - Lint/format standards

### Task 2.4: Add SDLC and Code Style Section
- **Description**: Methodology and code style guidelines
- **File**: `AGENTS.md`
- **Sections**:
  - SDLC overview
  - Code style principles

### Estimated Time: 2 hours

---

## Phase 3: Create .agent/

### Task 3.1: Create Directory Structure
- **Description**: Set up new general area directories
- **Files**: Create directories:
  - `.agent/rules/`
  - `.agent/skills/general-dev-tools/`
  - `.agent/workflows/`

### Task 3.2: Create AGENTS.md Index
- **Description**: Index file for the general area
- **File**: `.agent/AGENTS.md`
- **Content**: List all rules, skills, workflows following full-stack pattern

### Task 3.3: Create Rules Files (8 files)
- **Files**:
  1. `git-best-practices.md`
  2. `github-workflow.md`
  3. `gitlab-ci-basics.md`
  4. `makefile-conventions.md`
  5. `docker-compose-guide.md`
  6. `lint-format-standards.md`
  7. `sdlc-methodology.md`
  8. `code-style-guidelines.md`

### Task 3.4: Create Skills File
- **File**: `.agent/skills/general-dev-tools/SKILL.md`
- **Content**: General development tools skill

### Task 3.5: Create Workflows File
- **File**: `.agent/workflows/standard-development-flow.md`
- **Content**: Standard development workflow

### Estimated Time: 4-5 hours

---

## Testing Plan

### Unit Tests
1. Test agentos-install.sh with --dry-run for all agent OS types
2. Verify correct directory mapping for each agent

### Integration Tests
1. Run full installation for each agent OS
2. Verify file structure matches expectations
3. Test backward compatibility with default agent

### Content Verification
1. Review all new AGENTS.md files for clarity
2. Verify general area follows existing patterns
3. Check cross-references are valid

---

## Dependencies

- No external dependencies required
- All changes are self-contained
- Uses existing bash patterns from current script

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent path conflicts | Medium | Use unique prefix for each agent |
| Content duplication | Low | Cross-reference from specialized areas |
| Script errors | High | Extensive dry-run testing |

---

## Review Checklist

- [ ] All four agent OS types install correctly
- [ ] Directory structure matches specification
- [ ] Root AGENTS.md is comprehensive
- [ ] General area is discoverable
- [ ] Backward compatibility maintained
- [ ] Tests pass for all scenarios

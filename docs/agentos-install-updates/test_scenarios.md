# Test Scenarios: AgentOS Install Updates

## Test Environment Setup

### Prerequisites
- Bash 4.0+
- Test project directory: `/tmp/agentos-test-project`
- Clean state between tests

---

## Test Case 1: OpenCode Agent Installation

### Objective
Verify files are copied to correct opencode-specific directories

### Steps
```bash
cd /path/to/agent-guides
./agentos-install.sh install \
  --project-dir /tmp/agentos-test \
  --agent-os opencode \
  --areas software \
  --specializations software.general
```

### Expected Results
- `.opencode/rules/` contains rule files
- `.opencode/skills/` contains skill files  
- `.opencode/commands/` contains workflow files (mapped from workflows/)
- `.opencode/opencode.json` or similar extension files present

### Pass Criteria
- All three directories exist
- Files are present in each directory
- Directory names match expected structure

---

## Test Case 2: Cursor Agent Installation

### Objective
Verify files are copied to correct cursor-specific directories

### Steps
```bash
./agentos-install.sh install \
  --project-dir /tmp/agentos-test-cursor \
  --agent-os cursor \
  --areas software \
  --specializations software.general
```

### Expected Results
- `.cursor/rules/` contains rule files
- `.cursor/skills/` contains skill files
- No commands/workflows directory for cursor

### Pass Criteria
- `.cursor/rules/` exists with files
- `.cursor/skills/` exists with files
- No `.cursor/commands/` or `.cursor/workflows/`

---

## Test Case 3: KiloCode Agent Installation

### Objective
Verify files are copied to correct kilocode-specific directories

### Steps
```bash
./agentos-install.sh install \
  --project-dir /tmp/agentos-test-kilo \
  --agent-os kilocode \
  --areas software \
  --specializations software.general
```

### Expected Results
- `.kilocode/rules/` contains rule files
- `.kilocode/skills/` contains skill files
- `.kilocode/workflows/` contains workflow files

### Pass Criteria
- All three directories exist with files

---

## Test Case 4: Antigravity Agent Installation

### Objective
Verify antigravity uses kilocode directory structure

### Steps
```bash
./agentos-install.sh install \
  --project-dir /tmp/agentos-test-anti \
  --agent-os antigravity \
  --areas software \
  --specializations software.general
```

### Expected Results
- Same as kilocode: `.kilocode/rules/`, `.kilocode/skills/`, `.kilocode/workflows/`

### Pass Criteria
- Files in `.kilocode/` directories (not `.antigravity/`)

---

## Test Case 5: Default Agent Installation (Backward Compatibility)

### Objective
Verify default agent OS still uses `.agent/` structure

### Steps
```bash
./agentos-install.sh install \
  --project-dir /tmp/agentos-test-default \
  --agent-os default \
  --areas software \
  --specializations software.general
```

### Expected Results
- `.agent/rules/` contains rule files
- `.agent/skills/` contains skill files
- `.agent/workflows/` contains workflow files

### Pass Criteria
- Standard `.agent/` directory structure used

---

## Test Case 6: Dry Run Verification

### Objective
Verify dry-run shows correct operations without creating files

### Steps
```bash
./agentos-install.sh install \
  --project-dir /tmp/agentos-test-dry \
  --agent-os opencode \
  --areas software \
  --specializations software.general \
  --dry-run
```

### Expected Results
- Output shows planned copy operations
- No directories created in target location

### Pass Criteria
- Output mentions .opencode paths
- Target directory does not exist

---

## Test Case 7: Missing Source Directories

### Objective
Verify graceful handling when source directories don't exist

### Steps
1. Create empty test project directory
2. Run install without source rules/skills/workflows in project root

### Expected Results
- No errors or warnings about missing sources
- Installation completes successfully

### Pass Criteria
- Exit code 0
- Warning logged if source missing (optional)

---

## Test Case 8: General Area Content Verification

### Objective
Verify new software/general area is installed correctly

### Steps
```bash
./agentos-install.sh install \
  --project-dir /tmp/agentos-test-general \
  --agent-os default \
  --areas software \
  --specializations software.general
```

### Expected Results
- Rules installed from areas/software/general/rules/
- Skills installed from areas/software/general/skills/
- Workflows installed from areas/software/general/workflows/

### Pass Criteria
- Files from general area present in .agent/ directories

---

## Test Case 9: Root AGENTS.md Update Verification

### Objective
Verify root AGENTS.md contains new development practices

### Steps
1. Check `/path/to/agent-guides/AGENTS.md`
2. Look for new sections

### Expected Results
- Git practices section present
- GitLab/GitHub sections present
- Makefile, docker-compose sections present
- SDLC methodology section present

### Pass Criteria
- All new topics documented in root AGENTS.md

---

## Test Case 10: Multiple Agent Installations

### Objective
Verify multiple different agents can be installed to same project

### Steps
1. Install opencode to project
2. Add cursor support to same project
3. Verify both structures coexist

### Expected Results
- Both `.opencode/` and `.cursor/` directories exist
- No conflicts between agents

### Pass Criteria
- Both agent directories present
- Files in each are correct for respective agent

---

## Execution Summary

| Test Case | Agent OS | Expected Duration | Status |
|-----------|----------|-------------------|--------|
| 1 | opencode | 30s | Pending |
| 2 | cursor | 30s | Pending |
| 3 | kilocode | 30s | Pending |
| 4 | antigravity | 30s | Pending |
| 5 | default | 30s | Pending |
| 6 | dry-run | 15s | Pending |
| 7 | edge case | 15s | Pending |
| 8 | general area | 30s | Pending |
| 9 | content check | 10s | Pending |
| 10 | multi-agent | 45s | Pending |

**Total Estimated Time**: ~4 minutes

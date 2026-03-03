#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
INSTALLER="$ROOT_DIR/agentos-install.sh"
TMP_ROOT="$(mktemp -d /tmp/agentos-install-e2e.XXXXXX)"
trap 'rm -rf "$TMP_ROOT"' EXIT

fail() {
  echo "[e2e][FAIL] $1" >&2
  exit 1
}

assert_exists() {
  local path="$1"
  [[ -e "$path" ]] || fail "Expected path to exist: $path"
}

assert_file_contains() {
  local path="$1"
  local needle="$2"
  grep -Fq "$needle" "$path" || fail "Expected '$needle' in $path"
}

echo "[e2e] Scenario 1: CLI opencode + software.backend"
P1="$TMP_ROOT/project-opencode"
"$INSTALLER" install \
  --project-dir "$P1" \
  --agent-os opencode \
  --areas software \
  --specializations software.backend

assert_exists "$P1/.opencode"
assert_exists "$P1/.agent/rules"
assert_exists "$P1/.agent/skills"
assert_exists "$P1/.agent/workflows"
assert_exists "$P1/AGENTS.md"
assert_file_contains "$P1/AGENTS.md" "software/backend"

echo "[e2e] Scenario 2: CLI codex + software.frontend"
P2="$TMP_ROOT/project-codex"
"$INSTALLER" install \
  --project-dir "$P2" \
  --agent-os codex \
  --areas software \
  --specializations software.frontend

assert_exists "$P2/.codex"
assert_exists "$P2/.agent/rules"
assert_exists "$P2/.agent/skills"
assert_exists "$P2/.agent/workflows"
assert_exists "$P2/AGENTS.md"
assert_file_contains "$P2/AGENTS.md" "software/frontend"

echo "[e2e] Scenario 3: TUI default + software backend+frontend"
P3="$TMP_ROOT/project-tui"
# menu sequence:
# 1) project dir
# 2) agentos selection (1=default)
# 3) areas (1=software)
# 4) specs for software (1,3 -> backend,frontend)
printf '%s\n' "$P3" "1" "1" "1,3" | "$INSTALLER" tui

assert_exists "$P3/.agent/rules"
assert_exists "$P3/.agent/skills"
assert_exists "$P3/.agent/workflows"
assert_exists "$P3/AGENTS.md"
assert_file_contains "$P3/AGENTS.md" "software/backend"
assert_file_contains "$P3/AGENTS.md" "software/frontend"

echo "[e2e] All scenarios passed"

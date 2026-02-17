#!/usr/bin/env bash

set -euo pipefail

SCRIPT_NAME="$(basename "$0")"

usage() {
  cat <<EOF
AgentOS Package Installer

Usage:
  $SCRIPT_NAME install --package <name> --target <dir> [options]

Options:
  -p, --package     Package name (directory with rules/skills/workflows)
  -t, --target      Target project directory
  -f, --format      Target format: agent | kilocode | both (default: both)
  -d, --dry-run     Show what would be copied
  -h, --help        Show this help

Examples:
  $SCRIPT_NAME install -p agentos/modules/backend -t ./my-project
  $SCRIPT_NAME install -p agentbase -t ./my-project -f agent
  $SCRIPT_NAME install -p agentos/modules/mlops -t . --dry-run
EOF
}

log() {
  echo "[agentos] $1"
}

copy_dir() {
  local src="$1"
  local dest="$2"

  if [ "$DRY_RUN" = true ]; then
    log "DRY-RUN: cp -a $src -> $dest/"
  else
    cp -a "$src" "$dest/"
  fi
}

# Defaults
FORMAT="both"
DRY_RUN=false

if [ $# -eq 0 ]; then
  usage
  exit 1
fi

COMMAND="$1"
shift

if [ "$COMMAND" != "install" ]; then
  usage
  exit 1
fi

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--package)
      PACKAGE_PATH="$2"
      shift 2
      ;;
    -t|--target)
      TARGET_ROOT="$2"
      shift 2
      ;;
    -f|--format)
      FORMAT="$2"
      shift 2
      ;;
    -d|--dry-run)
      DRY_RUN=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

if [ -z "${PACKAGE_PATH:-}" ] || [ -z "${TARGET_ROOT:-}" ]; then
  echo "Error: --package and --target are required."
  usage
  exit 1
fi

if [ ! -d "$PACKAGE_PATH" ]; then
  echo "Error: package directory not found: $PACKAGE_PATH"
  exit 1
fi

SOURCE_DIRS=(rules skills workflows prompts)

case "$FORMAT" in
  agent)
    TARGET_SUB_DIRS=(.agent)
    ;;
  kilocode)
    TARGET_SUB_DIRS=(.kilocode)
    ;;
  both)
    TARGET_SUB_DIRS=(.agent .kilocode)
    ;;
  *)
    echo "Invalid format: $FORMAT"
    exit 1
    ;;
esac

log "Installing package: $PACKAGE_PATH"
log "Target project: $TARGET_ROOT"
log "Format: $FORMAT"
log "Dry-run: $DRY_RUN"

for target in "${TARGET_SUB_DIRS[@]}"; do
  TARGET_PATH="$TARGET_ROOT/$target"

  if [ "$DRY_RUN" = false ]; then
    mkdir -p "$TARGET_PATH"
  fi

  for src_dir in "${SOURCE_DIRS[@]}"; do
    SRC_PATH="$PACKAGE_PATH/$src_dir"

    if [ -d "$SRC_PATH" ]; then
      log "Copying $src_dir → $TARGET_PATH"
      copy_dir "$SRC_PATH" "$TARGET_PATH"
    else
      log "Skipping $src_dir (not found)"
    fi
  done
done

log "Done."

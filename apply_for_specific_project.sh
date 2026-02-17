#!/usr/bin/env bash

set -euo pipefail

if [ $# -ne 2 ]; then
  echo "Usage: $0 <target_directory> <source_package>"
  exit 1
fi

TARGET_ROOT="$1"
SOURCE_PACKAGE="$2"

SOURCE_DIRS=(rules skills workflows)
TARGET_SUB_DIRS=(.agent .kilocode)

for target in "${TARGET_SUB_DIRS[@]}"; do
  TARGET_PATH="$TARGET_ROOT/$target"

  echo "Processing $TARGET_PATH"
  mkdir -p "$TARGET_PATH"

  for src_dir in "${SOURCE_DIRS[@]}"; do
    SRC_PATH="$SOURCE_PACKAGE/$src_dir"

    if [ -d "$SRC_PATH" ]; then
      echo "  Copying $SRC_PATH -> $TARGET_PATH/"
      cp -a "$SRC_PATH" "$TARGET_PATH/"
    else
      echo "  Skipping $SRC_PATH (not found)"
    fi
  done
done

echo "Done."

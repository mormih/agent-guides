# Changelog

## 1.1.0 - 2026-02-26

### Added
- Enhanced `agentos-install.sh` with source resolution for `--domain`, `--package`, or `--source`.
- Added `list` command to discover available domains and standardized packages.
- Added automatic target directory creation for AGENTS rendering.

### Changed
- Standardized domain skills layout to `skills/<skill-name>/SKILL.md` across domains.
- Standardized package artifacts to `agentos/packages/<package-name>/AGENTS.md`.
- Updated internal references from legacy `skills/<name>.md` paths to `skills/<name>/SKILL.md`.
- Updated documentation package index paths to the new package layout.

### Validation
- Performed end-to-end installer checks for domain/package install flows and format variants.

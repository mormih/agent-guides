# Changelog

## 1.2.0 - 2026-02-26

### Changed
- Reorganized repository structure from `agentos/*` to `areas/software/*`.
- Renamed catalogs to `modules` and `flat`:
  - `areas/software/modules` for `rules/skills/workflows/prompts`
  - `areas/software/flat` for package-style `AGENTS.md` and `PROMPTS.md`
- Removed legacy `docs/` directory.
- Added root `README.md` with installation model, tool mapping table, and complete script examples.
- Updated `agentos-install.sh` CLI and help to align with new structure (`--module`, `--flat`, `list modules|flat`).

### Added
- `PROMPTS.md` next to every flat package `AGENTS.md` with ready-to-use command prompts.

### Validation
- Ran end-to-end install checks across module/flat sources and all target tool formats.

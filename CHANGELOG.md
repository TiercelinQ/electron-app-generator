# Changelog

All notable changes to this generator are documented in this file.
The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.
(This is the changelog of the **generator** itself, distinct from the `docs/release/CHANGELOG.md` of each generated app.)

## [1.2.0] - 2026-07-18
### Added
- Data table columns are sortable ascending and descending (header click, Lucide `ChevronUp`/`ChevronDown` indicator).
- Main window is centered on the primary display at launch; a saved window position (restore-position preference) takes precedence.
- Post-delivery reminder: the Phase 5 delivery summary and the generated app `CLAUDE.md` now list the maintenance commands and `/electron-release`.

### Changed
- Sidebar (P2) labels word-wrap within the fixed 240px width instead of truncating.
- Phase 1 Salesforce CLI question is shown only when the objective mentions Salesforce (otherwise off, still enabled on explicit request).

## [1.1.0] - 2026-07-17
### Added
- App changelog + SemVer versioning system for generated apps: new `rules/versioning.md`, new `/electron-release` skill, and a seeded `docs/release/CHANGELOG.md` (Keep a Changelog, English).
- Maintenance skills (`add-feature`, `fix-issue`, `refactor-code`, `migrate-design`) now record their change under `## [Unreleased]`; `/electron-load-project` offers to initialize the changelog retroactively on a legacy app.

### Changed
- `CLAUDE.md`, `p5-development`, `verification.md`, `electron-app`, `show-state` updated for the versioning system.

## [1.0.0]
- Unified edition baseline: 5-phase generation pipeline (p1 scoping to p5 development), calibration, MVC contract, error contract (`IpcResult<T>`, toasts), Electron security lock, design system v2.0 (depth by stroke, Lucide icons), Salesforce `sf` v2 integration, and the maintenance skill set.

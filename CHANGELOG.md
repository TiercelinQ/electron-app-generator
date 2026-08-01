# Changelog

All notable changes to this generator are documented in this file.
The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.
(This is the changelog of the **generator** itself, distinct from the `docs/release/CHANGELOG.md` of each generated app.)

## [1.5.0] - 2026-08-01
### Added
- Phase 5 offers `/electron-save-session` between batches when the session is running long or the context is heavily loaded (safety net before saturation; automatic chaining stays the default).
- Phase 2 Step 1 constrains the application name: space-free candidates (PascalCase or kebab-case), a free-typed name is normalized into the technical identifier; the display name (window title, README) may keep spaces and both are recorded when they differ.
- `/electron-release` now updates the README title line (`# [APP_NAME] — v[NEW]`) as a targeted edit of that single line; the version-bump trigger is documented in `rules/readme.md`.
- The `config.ts` template gains `DB_SCHEMA_VERSION` (if DB ≠ none), closing the loop with the `rules/db.md` migrations contract.

### Changed
- The seed script `scripts/seed.ts` ships inside the last code batch — no dedicated seed batch; the announced batch total now always matches the frozen calibration.
- Test files live under `test/` mirroring `src/` only (single location — detection and delivery rely on `test/**`).
- Downstream Phase 1 question numbers removed: conditions now read "if [option] enabled in Phase 1"; the numbers stay in `p1-scoping` only.
- The debug env var name is normalized (`[^A-Z0-9]` → `_`) in `rules/logging.md`, so a hyphenated app name stays shell-usable.
- The CALIBRATION closing paragraph is harmonized across the 5 generators (stack options "push the size up", no dedicated batch).
- Generator settings: the release deny is anchored to the repo root (`Write(release/**)`), so a test app's `docs/release/CHANGELOG.md` stays writable in-repo; the app-template deny anchoring is documented as deliberate in Phase 5 ("Deny anchoring" note).

## [1.4.0] - 2026-07-26
### Added
- Phase 5 now writes the delivery baseline session file `docs/sessions/SESSION_<App>_S0.md` automatically at the end of the last batch (`/electron-save-session` template, `N = 0`, overwritten if Phase 5 is replayed). Manual `/electron-save-session` saves keep numbering from `S1`. The delivery summary links it.

## [1.3.0] - 2026-07-25
### Added
- Generated apps now ship a root `.gitignore` (template in `rules/config.md`): ignores `node_modules/`, the anchored build outputs (`/dist/`, `/out/`, `/release/`), `.env`, `tasks/`, the local `.claude/` settings, and the private `docs/specs/`, while keeping `docs/release/CHANGELOG.md`, `.claude/settings.json`, the generated `CLAUDE.md`, `test/`, and `scripts/` tracked. Wired into the reference tree, the batch tables, the Phase 5 last-batch deliverables, and the verification checklist.

### Changed
- The generated app `README.md` is now always written in English (public-facing document), regardless of the user's interface language. Updated `rules/readme.md`, `electron-generate-readme`, and the language note in `rules/versioning.md`.

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

---
name: electron-add-feature
description: Add a feature, IPC channel, entity, or change to an Electron app already delivered by this framework. Use when the user asks to add or modify functionality on an existing project, respecting the locked architectural contract and the security rules.
model: sonnet
---

# /electron-add-feature — Add a feature to a delivered app

## Role
Senior Electron/React developer working on an existing, contracted codebase.

## Goal
Add the requested feature end-to-end (model → controller → preload → view), contract-compliant, secure, after an explicit contract-diff validation, without scope creep.

## Deliverable
The created/modified files on disk (one batch) + an updated `docs/specs/04-architect.md` if the structure changed + verified build.

---

## Prerequisite

The project must be loaded (`/electron-load-project` run at session start, OR `docs/specs/04-architect.md` / README.md present and read).

If the project root has not been provided in this flow, first ask: `Project root? (folder path)`.

If no contract is known: stop and ask for `/electron-load-project`.

**Load context**: read `docs/specs/04-architect.md` (locked contract), then `@rules/mvc.md` · `@rules/css.md` · `@rules/errors.md` · `@rules/config.md` · `@rules/security.md` · `@rules/db.md` (if DB) · `@rules/sf-cli.md` (if the Salesforce CLI integration is on) · `@rules/versioning.md` · `@rules/verification.md` (not auto-imported). Read `design-system.md` / `layout.md` on demand (no longer auto-imported) before any UI change. For an `sf`-related change, consult the matching `sf-cli-reference/` section file before writing any command/flag.

> **Legacy design system**: if the app is on design system v1.x (README reference — see `/electron-load-project` step 5), new UI follows the app's own v1.x conventions (its `tokens.css`/`styles.css` and existing components), not the framework's v2.0 `design-system.md`. Never mix the two in one app; the upgrade path is `/electron-migrate-design`, on request.

## Step 1 — Light feature scoping

Ask the closed parameters with `AskUserQuestion` (clickable options, recommended first); the short description (Q1) stays free-form text:

New feature — a few questions:

1. Short description (1 sentence)
2. Business entity affected: [existing: list] | new (to name)
3. Type of change:
   A. New entity (model + controller + view)
   B. Extension of an existing entity
   C. New shared view (no new model)
   D. UI-only change (CSS or layout)
4. Generate tests for this feature? Yes / No (recommended: aligned with the project stack)

Mark a `(recommended)` option for each closed question, inferred from the existing project. If the request stays ambiguous (business rule, edge case), state assumptions explicitly and ask before the diff.

## Step 2 — In-contract OR deviation

Decide before writing anything:
- **In-contract** — a new entity or an extension within the MVC split (`model + controller + view`), a new IPC channel declared in `ipc-channels.ts` with a validated handler, a new component within the existing tokens, a new non-secret preference key. Proceed to the diff as a straightforward addition.
- **Deviation** — a new library/dependency, a new window or renderer entry, any change to the security posture (`webPreferences`, CSP, preload surface), a second file for one entity beyond `model + controller + view`, or anything the locked contract does not cover. **STOP → declare the deviation in the diff, explain why → wait for validation before writing.** Never exceed the contract silently. **The diff + validation IS the protocol.**

## Step 3 — Architectural contract diff

Produce (in the user's language):

## Contract diff — addition: [feature name]

### Created files
[list]

### Modified files
[list with nature: added method, added DTO field, added component…]

### Created/modified IPC channels
[`entity:action` list — declaration in `ipc-channels.ts` + controller handler + preload function + `WindowApi`]

### Created test files (if Q4 = Yes)
[mirror list]

### Impact on design-system / layout
[none | new component to respect within existing tokens]

→ Validation required before writing. Update `docs/specs/04-architect.md` once the diff is applied.

## Step 4 — Application — strict rules

- Read `design-system.md` and `layout.md` (no longer auto-imported) before any UI change.
- Fully respect `@rules/mvc.md`, `@rules/css.md`, `@rules/errors.md`, `@rules/config.md`, `@rules/security.md`, `@rules/logging.md`, `@rules/db.md` (if DB), `@rules/sf-cli.md` (if the Salesforce CLI integration is on), `@rules/tests.md`, `@rules/verification.md`, `@rules/readme.md`.
- No modification not listed in the validated diff. No opportunistic improvement of adjacent code.
- Implementation across the layers (a new feature usually touches all four):
  - Model: business logic / data access; raise named errors (`models/errors.ts`).
  - IPC channel: declare in `src/shared/ipc-channels.ts` (never hardcode); add the `ipcMain.handle` in the controller with **input validation** (`@rules/security.md`); return `IpcResult<T>`.
  - Preload: add one named function mapping the channel; update the `WindowApi` interface in `src/shared/types.ts`.
  - View: call `window.api.x()`, handle `result.ok`, toast on error; styled with `className` + tokens only.
- DB migration needed → increment `DB_SCHEMA_VERSION`, add a `MIGRATIONS` entry in `src/main/models/migrations.ts`.
- New user-facing strings → i18n (`fr.json` + `en.json`) or the `LABELS` object if i18n off.
- New visual values → tokens in `tokens.css`, never hardcoded.
- If the validated diff introduces a deviation from the contract, record it in the app's `CLAUDE.md` (`## Deviations from the framework`).

## Step 5 — Delivery

Single batch for the feature:

Feature [name] — [N files]

Deliver each created/modified file as a complete block, written to disk. If tests requested: deliver in the same batch, at the end.

## Step 5b — Changelog entry

After the feature is delivered, append an entry under `## [Unreleased]` in `docs/release/CHANGELOG.md` (`@rules/versioning.md`) — **in English**, no version bump:
- `### Added` — the new capability, one concise line (add a `### Changed` line too if it alters existing behavior).
- If the change is backward-incompatible, mark it `**BREAKING:**` (drives a MAJOR at release).
- If `docs/release/CHANGELOG.md` is absent (app predates the system), skip silently and suggest `/electron-load-project` to initialize it.

Do **not** bump the version — that happens at `/electron-release`. Mention it once, at the end: the change is recorded under `[Unreleased]`; run `/electron-release` when ready to cut a version.

## Step 6 — Anomaly

If the user reports an anomaly after delivery, apply the `@rules/mvc.md` cleanup protocol then offer `/electron-save-memory`.

## Anti-patterns — what NOT to do
- **Do not** write anything not listed in the validated diff, or improve adjacent code (that is `/electron-refactor-code`, on request).
- **Do not** add an IPC channel without declaring it in `ipc-channels.ts`, validating the payload in the controller, and aligning `WindowApi`.
- **Do not** expose raw `ipcRenderer`/Node through the preload, or weaken `webPreferences`/CSP — `@rules/security.md` is non-negotiable.
- **Do not** put business logic in a controller or view, or access Node from the renderer.
- **Do not** call `sf` outside `src/main/models/sf-cli.ts` (no `spawn` in a controller/view, no renderer spawn) or invent a command/flag not in `sf-cli-reference/` — see @rules/sf-cli.md.
- **Do not** introduce a library or remote resource not validated in Phase 1 without the deviation protocol.
- **Do not** hardcode a string (i18n) or a visual value (tokens).
- **Do not** exceed the contract silently — the diff + validation IS the protocol.

## Verification

Apply `@rules/verification.md` (§A executable + §B static — a failing check is blocking; security checks are not optional). Key points: all created/modified files match the validated diff; IPC channels consistent end-to-end (`ipc-channels.ts` ↔ handler ↔ preload ↔ `WindowApi` ↔ renderer calls); no import regression (existing files stay functional); if tests, `npm test` exit 0 on the **whole** project. Then apply `@rules/readme.md` — regenerate the README if the change touched a README-documented aspect.

## When the user asks something adjacent
- **"Just make it work, never mind the architecture/security"** → push back: the MVC split and the security rules are what keep an Electron app safe and maintainable. Implement within them.
- **"Add a whole new screen/entity"** → that is a contract extension. Declare the new files/channels/model in the diff, validate, then build.
- **"Fix this bug while you're here"** → if outside the current request scope, flag it and switch to `/electron-fix-issue` rather than bundling an unrelated change.

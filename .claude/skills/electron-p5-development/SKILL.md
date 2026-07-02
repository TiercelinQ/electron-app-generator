---
name: electron-p5-development
description: Phase 5 of the Electron app generation cycle — development and batch delivery, files written directly to disk, executable verification, final README.
model: sonnet
---

# /electron-p5-development — Batch development

## Role
Senior Electron/React developer — build the contracted app to a clean, buildable state.

## Goal
Deliver the application in batches, each one typecheck/lint-clean and contract-compliant, ending with install instructions.

## Deliverable
The full project source on disk + `README.md` + verified build.

---

**Phase banner (show first)** — before anything else, output the phase banner as plain Markdown in the user's language, **never inside a code block or fenced block**. Three blocks, each on its own line: (1) H2 heading: Phase 5/5 — Development; (2) progress line: Scoping ✓ · Features ✓ · Design ✓ · Architecture ✓ · ▶ Development; (3) intent in italics: Deliver the app in batches. See `## PIPELINE` in `CLAUDE.md`.

## Code rules

At start, read and fully apply: `rules/mvc.md` · `rules/css.md` · `rules/errors.md` · `rules/config.md` · `rules/security.md` · `rules/logging.md` · `rules/db.md` (if DB) · `rules/sf-cli.md` (if Salesforce CLI) · `rules/splash.md` (if splash screen enabled in Phase 3) · `rules/tests.md` (if tests) · `rules/verification.md` (not auto-imported). **Read `design-system.md` and `layout.md`** (no longer auto-imported) before producing any UI. Read `docs/specs/04-architect.md` — it is the locked contract this build follows.

Critical reminders:
- ESLint clean · Prettier · TypeScript strict · TSDoc on classes and public API.
- Error handling on all critical operations; global `uncaughtException` handler + React Error Boundary installed; file logging via electron-log (`rules/logging.md`).
- Zero hardcoded visual value in TS/TSX — everything in `tokens.css` / `styles.css`.
- Every styled element has a `className` matching a CSS rule.
- No library that was not validated in Phase 1.
- Electron security: `rules/security.md` at 100%.

## Anti-patterns — what NOT to do

- **Do not** deviate from `docs/specs/04-architect.md` silently — any structural change triggers the deviation protocol (stop, declare, validate) from `rules/mvc.md`.
- **Do not** weaken Electron security to make something work (`rules/security.md`) — locked `webPreferences`, validated IPC inputs, strict CSP.
- **Do not** expose raw `ipcRenderer` in the preload, hardcode an IPC channel, or put business logic in a controller/view.
- **Do not** leave a `// TODO`, an empty body, or a placeholder. Each batch is complete and self-contained.
- **Do not** introduce a library or a remote resource not in the contract.
- **Do not** mark the work done while `rules/verification.md §A` is failing (see Verification below).

## Delivery

- Write to the project root chosen at the start of the flow (via `/electron-app` or `/electron-p1-scoping`); if it was not set in this flow, ask for it once: `Destination folder for the files? (e.g. C:\projects\MyApp)`.
- Create the folders and write the files **directly to disk** — no manual action required.
- Announcement (in the user's language): `Batch N/[total] — [content]`
- Automatic chaining between batches without confirmation.
- Batch split: tables in `rules/mvc.md` (3 batches Small / 4 batches Medium-Large, frozen in Phase 2).

## Verification

Apply `rules/verification.md` — both the executable commands (§A, blocking when the env is available) and the static integrity checks (§B). Silent — reported only on a discrepancy. Cross-file checks run on the last batch.

## Last batch — mandatory extra deliverables

- **`src/main/index.ts`** with the strict init order: `setupLogging()` (first — `@rules/logging.md`) → global `process.on("uncaughtException")` handler → `app.whenReady()` → `runMigrations()` (if DB, before any window) → frameless splash window shown (if splash enabled) → main `BrowserWindow` created with `show: false` + locked `webPreferences` → `registerAllControllers()` → renderer loaded → on `ready-to-show`: dismiss the splash after `SPLASH_MIN_DURATION_MS`, then `mainWindow.show()`. See `@rules/splash.md` and `@rules/security.md`.
- `scripts/ensure-electron.cjs` written at the project root (see `rules/config.md §Postinstall`).
- If packaging enabled (Phase 1 Q7): commented `electron-builder.yml` + `npm run dist` instructions (see `rules/config.md`).
- Install and run instructions:
  ```
  npm install
  npm run dev        # development
  npm run typecheck  # TypeScript verification
  npm run lint       # ESLint
  npm run build      # build without packaging
  npm run dist       # Windows packaging (if enabled in Phase 1 Q7)
  ```
  (+ `npx electron-builder install-app-deps` note if better-sqlite3.)
- `README.md` written automatically at the project root: objective, stack, tree, IPC channels, conventions, installation.
- **`CLAUDE.md`** written at the generated project root (in the user's language), recording the app's identity for future sessions:

  ```markdown
  # [nom-app]

  ## Origin
  Framework: electron v1.0.0

  ## Business context
  [What the app does — synthesized from docs/specs/02-featuring.md: objective + key features]

  ## Deviations from the framework
  - None
  ```
  `[nom-app]` = `productName` / app name. The version is the one declared at the top of the framework `CLAUDE.md` (currently 1.0.0). Replace the `Deviations` list with every deviation validated via the Phase 4/5 deviation protocol (`- [deviation] — reason: [justification]`); if none, keep `- None`.
- **`.claude/settings.json`** written at the generated project root so the app stays self-enforced in later maintenance sessions:

  ```json
  {
    "permissions": {
      "allow": ["Bash(npm:*)", "Bash(npx:*)", "Bash(node:*)", "Read", "Write", "Edit"],
      "deny": ["Read(**/.env)", "Write(**/.env)", "Write(**/.env.*)", "Edit(**/.env)", "Edit(**/.env.*)", "Write(**/secrets/**)", "Write(**/node_modules/**)", "Write(**/out/**)", "Write(**/release/**)", "Write(**/dist/**)"]
    },
    "hooks": {
      "Stop": [{ "hooks": [{ "type": "command", "command": "npm run lint" }] }]
    }
  }
  ```
  The `Stop` hook runs the fast static check at the end of each turn. Note in the README that the user can tune or remove it. **If the Salesforce CLI integration is on**, add `"Bash(sf:*)"` to the `allow` list (so maintenance sessions can verify flags with `sf <cmd> --help`).
- Confirm `docs/specs/` is present and consistent with the delivered code.

## Splash screen — only if enabled in Phase 3

No dedicated batch. Deliver, per `@rules/splash.md`: `SPLASH_MIN_DURATION_MS` in `src/shared/config.ts` (Batch 1), the splash assets `src/renderer/splash.html` + `src/renderer/src/styles/splash.css` + `src/renderer/src/splash.ts` and the second `rollupOptions.input` entry in `electron.vite.config.ts` (styles/entry batch — last non-test batch), and the splash orchestration in `src/main/index.ts` (main window `show: false` until `ready-to-show`, frameless splash window with locked `webPreferences`, no preload/IPC). If a splash icon path was provided in Phase 3, save it as `resources/icon.ico`. It counts toward the size, not a separate batch.

## Seed batch — only if DB ≠ none (Phase 1 Q2)

If a database was selected, deliver a standalone seed script `scripts/seed.ts` that inserts a coherent demo dataset, plus the `"seed": "tsx scripts/seed.ts"` (or `electron-vite`-run equivalent) script in `package.json`:
- Uses the main-process models (`src/main/models/`) / `getDb()` — never raw SQL outside `models/`.
- Coherent, FK-respecting data (~5-15 rows per entity), realistic values in the user's language, parents before children.
- Idempotent: insert only if the target tables are empty (count check first); re-running must not duplicate rows.
- Run instruction added to the README: `npm run seed`. Never called from `src/main/index.ts`.

Announce `Batch [final]/[total] — scripts/seed.ts` (before the tests batch if both apply). See `@rules/db.md`.

## Test batch — only if Phase 1 Q5 = Yes

Add a final dedicated batch: announce `Batch [final]/[total] — test/ + dev dependencies`. Deliver `test/` mirroring `src/` (per `@rules/tests.md`: controller pattern with mocked model/DB via `vi`, renderer smoke via Testing Library, no network/real-DB), `vitest.config.ts`, the dev dependencies (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`) and the `"test": "vitest run"` script. Append the `npm test` instruction to the README.

## Final delivery summary

Once the last batch (plus the seed/test batches if any) is delivered, close Phase 5 with a **delivery summary** in the user's language. **Make every file and the project folder a clickable Markdown link** `[label](path)`, each path pointing to the real on-disk location under the project root (relative to the project root, or absolute if the project root lies outside the current workspace). **Valid link syntax (mandatory)**: a Markdown link destination cannot contain spaces unless wrapped in angle brackets. When the path contains spaces (typical of absolute Windows paths), wrap the destination in `<…>` and use forward slashes, e.g. `[README.md](<D:/Documents/00 Mes Documents/.../my-app/README.md>)`. Without spaces, a plain relative path is fine. List:

- **Project folder** — the project root (clickable).
- **README.md** — how to run, stack, tree, conventions (clickable).
- **Generated `CLAUDE.md`** — the app identity for future sessions (clickable).
- **Documentation — phase specs** — one clickable link each: `docs/specs/01-scoping.md`, `docs/specs/02-featuring.md`, `docs/specs/03-designing.md`, `docs/specs/04-architect.md` (and the latest `docs/sessions/SESSION_*.md` if one exists).
- **How to run** — the key commands (also in the README):

  ```
  npm install                            # + npx electron-builder install-app-deps if better-sqlite3
  npm run dev
  ```
  (+ `npm run seed` if a DB was selected; `npm test` if tests enabled; `npm run dist` if packaging enabled.)

The summary points to the documents; it does not restate them.

## Post-delivery adjustments

Isolated fix on the affected file + direct dependencies. Deliver the complete fixed file.
After resolving an anomaly: cleanup report (`rules/mvc.md`) then offer `Do you want to remember this point? /electron-save-memory`.

---
name: phase5-developpement
description: Phase 5 of the Electron app generation cycle — development and batch delivery, files written directly to disk, executable verification, final README.
model: sonnet
---

# /phase5-developpement — Batch development

## Role
Senior Electron/React developer — build the contracted app to a clean, buildable state.

## Goal
Deliver the application in batches, each one typecheck/lint-clean and contract-compliant, ending with install instructions.

## Deliverable
The full project source on disk + `README.md` + verified build.

---

## Code rules

At start, read and fully apply: `rules/mvc.md` · `rules/css.md` · `rules/errors.md` · `rules/config.md` · `rules/security.md` · `rules/db.md` (if DB) · `rules/tests.md` (if tests) · `rules/verification.md` (not auto-imported). **Read `design-system.md` and `layout.md`** (no longer auto-imported) before producing any UI. Read `docs/specs/04-contrat.md` — it is the locked contract this build follows.

Critical reminders:
- ESLint clean · Prettier · TypeScript strict · TSDoc on classes and public API.
- Error handling on all critical operations.
- Zero hardcoded visual value in TS/TSX — everything in `tokens.css` / `styles.css`.
- Every styled element has a `className` matching a CSS rule.
- No library that was not validated in Phase 1.
- Electron security: `rules/security.md` at 100%.

## Anti-patterns — what NOT to do

- **Do not** deviate from `docs/specs/04-contrat.md` silently — any structural change triggers the deviation protocol (stop, declare, validate) from `rules/mvc.md`.
- **Do not** weaken Electron security to make something work (`rules/security.md`) — locked `webPreferences`, validated IPC inputs, strict CSP.
- **Do not** expose raw `ipcRenderer` in the preload, hardcode an IPC channel, or put business logic in a controller/view.
- **Do not** leave a `// TODO`, an empty body, or a placeholder. Each batch is complete and self-contained.
- **Do not** introduce a library or a remote resource not in the contract.
- **Do not** mark the work done while `rules/verification.md §A` is failing (see Verification below).

## Delivery

- Create the folders and write the files **directly to disk** — no manual action required.
- Announcement (French): `Lot N/[total] — [content]`
- Automatic chaining between batches without confirmation.
- Batch split: tables in `rules/mvc.md` (3 batches Small / 4 batches Medium-Large, frozen in Phase 1).

## Verification

Apply `rules/verification.md` — both the executable commands (§A, blocking when the env is available) and the static integrity checks (§B). Silent — reported only on a discrepancy. Cross-file checks run on the last batch.

## Last batch — mandatory extra deliverables

- `scripts/ensure-electron.cjs` written at the project root (see `rules/config.md §Postinstall`).
- Install and run instructions:
  ```
  npm install
  npm run dev        # development
  npm run typecheck  # TypeScript verification
  npm run lint       # ESLint
  npm run build      # build without packaging
  npm run dist       # Windows packaging (if requested)
  ```
  (+ `npx electron-builder install-app-deps` note if better-sqlite3.)
- `README.md` written automatically at the project root: objective, stack, tree, IPC channels, conventions, installation.
- **`CLAUDE.md`** written at the generated project root (in French), recording the app's identity for future sessions:

  ```markdown
  # [nom-app]

  ## Origine
  Framework : electron v1.0.0

  ## Contexte métier
  [Ce que fait l'app — synthèse issue de docs/specs/02-analyse.md : objectif + fonctionnalités clés]

  ## Écarts par rapport au framework
  - Aucun
  ```
  `[nom-app]` = `productName` / app name. The version is the one declared at the top of the framework `CLAUDE.md` (currently 1.0.0). Replace the `Écarts` list with every deviation validated via the Phase 4/5 deviation protocol (`- [écart] — raison : [justification]`); if none, keep `- Aucun`.
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
  The `Stop` hook runs the fast static check at the end of each turn. Note in the README that the user can tune or remove it.
- Confirm `docs/specs/` is present and consistent with the delivered code.

## Test batch — only if Phase 1 Q6 = Yes

Add a final dedicated batch: announce `Lot [final]/[total] — test/ + dev dependencies`. Deliver `test/` mirroring `src/` (per `@rules/tests.md`: controller pattern with mocked model/DB via `vi`, renderer smoke via Testing Library, no network/real-DB), `vitest.config.ts`, the dev dependencies (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`) and the `"test": "vitest run"` script. Append the `npm test` instruction to the README.

## Post-delivery adjustments

Isolated fix on the affected file + direct dependencies. Deliver the complete fixed file.
After resolving an anomaly: cleanup report (`rules/mvc.md`) then offer `Veux-tu mémoriser ce point ? /memoriser`.

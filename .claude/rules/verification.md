# Verification rules — single source of truth

> Centralized, reusable verification for the whole framework. Referenced by `/electron-p5-development`, `/electron-add-feature`, `/electron-fix-issue`, and `/electron-run-tests` — never duplicated in those skills.
> Two parts: **executable verification** (run real commands) and **static integrity** (read the code). Run silently; report only on a discrepancy.

---

## A. Executable verification (run the commands)

When the environment allows it (Node + npm available), these commands are **mandatory** and a failure is **blocking** — do not mark work as done while any of them fails. Run them in order:

```
npm install                  # dependencies resolve; postinstall (ensure-electron.cjs) runs
npm run typecheck            # tsc --noEmit on tsconfig.node.json AND tsconfig.web.json — MUST be clean
npm run lint                 # eslint — clean
npm run build                # electron-vite build — succeeds (main + preload + renderer bundles)
npm run dist                 # electron-builder — last batch / packaging only, on request
```

Rules:
- A non-zero exit or any reported error is a failure → fix the root cause, do not silence the rule. Re-run until clean.
- **better-sqlite3** (native module): after `npm install`, run `npx electron-builder install-app-deps` so the native binding is recompiled for Electron. Without it, `npm run dev`/`build` fails at runtime on the SQLite require.
- **`ensure-electron.cjs`**: if `npm run dev`/`build` reports `Error: Electron uninstall`, the binary extraction failed silently — run `npm run postinstall` (the script restores it from cache). See `rules/config.md`.
- If Node/npm is **not** available in the environment, say so explicitly, fall back to the static checks below (read-through), and tell the user which commands they must run themselves before considering the work verified. Never claim a clean typecheck you could not run.
- Quote the relevant command output as proof when reporting completion.
- **`npm test`** (vitest): run only if tests were enabled in Phase 1 (Q6) / `test/` exists — exit code 0. Otherwise skip — **do not scaffold a suite**.
- The generated app ships a `.claude/settings.json` (deny guards on secrets/artifacts + a `Stop` hook running `npm run lint`). These enforce the rules automatically in later maintenance sessions but **do not replace** this checklist.

---

## B. Static integrity (read the code)

### Every batch / every change
1. TypeScript compiles (`tsc --noEmit` mentally, then confirmed by §A when the env is available).
2. Imports: all used, none missing, unidirectional direction respected (`renderer → preload → controllers → models`; `shared` importable by all).
3. MVC responsibilities respected (zero business logic in view/controller, zero UI in model). See `rules/mvc.md` anti-patterns.
4. Zero `// TODO`, zero unjustified empty implementation, zero unjustified `any`.
4b. React Error Boundary present in `App.tsx`; `process.on("uncaughtException")` handler present in `src/main/index.ts` (see `rules/errors.md`).
5. Node 22+ · Electron stable (≥ 42) · zero deprecated API (`remote`).
6. `design-system.md` and `layout.md` compliance — zero hardcoded visual value in TS/TSX, zero inline `style={}`. See `rules/css.md` anti-patterns.
7. `rules/security.md` respected (locked `webPreferences`, minimal preload, validated IPC inputs, strict CSP, no remote resource; any external CLI spawned via `cross-spawn` args array from the main process only).
8. Errors: business errors raised in the model, caught in the controller, returned as `IpcResult<T>`, surfaced as toasts; no `alert()`/`confirm()`/`dialog.showMessageBox`. See `rules/errors.md`.

### Last batch only — cross-file
9. All inter-layer imports resolved; IPC channels consistent end-to-end (`ipc-channels.ts` declaration ↔ handlers ↔ preload ↔ renderer calls).
10. `WindowApi` interface aligned with the preload and the renderer usages.
11. Architectural contract (`docs/specs/04-architect.md`) respected — every file, IPC channel, and library matches the locked contract, or a declared+validated deviation exists.
12. Zero hardcoded visual value in TS/TSX, zero inline `style={}`.
13. i18n keys: all used, none missing (if enabled).
14. `docs/specs/` present and consistent with the delivered code.

### Per-domain (conditional — see the matching rule for detail)
- **DB** (`rules/db.md`): `db.ts` single access point; `migrations.ts` called in `src/main/index.ts` before the window; `config.DB_SCHEMA_VERSION` == `max(MIGRATIONS)`; no DB access outside `models/`; SQL parameterized.
- **sf-cli** (`rules/sf-cli.md`): if enabled, all `sf` calls via `src/main/models/sf-cli.ts` using `cross-spawn` with an args array (no `node:child_process` direct, no shell, no renderer/preload spawn); `sf` resolved from PATH or the `sfPath` preference; `ENOENT` → clear error toast; no token stored/logged; `sf:org:*` channels consistent end-to-end (`ipc-channels.ts` ↔ handlers ↔ preload ↔ `WindowApi` ↔ `OrgView`); Org Manager actions validate input and refresh the list; `cross-spawn` in `dependencies` (bundled by electron-vite).
- **splash** (`rules/splash.md`): if enabled, `splash.html` + `styles/splash.css` + `splash.ts` present; `splash.html` registered as a second `rollupOptions.input` in `electron.vite.config.ts`; `SPLASH_MIN_DURATION_MS` in `config.ts`; splash created and dismissed in `src/main/index.ts` (main window `show: false` until `ready-to-show`); splash window `webPreferences` locked, no preload/IPC; `splash.css` consumes only tokens (no literal, save the commented `backgroundColor` in the main); splash CSP present; icon resolved to `resources/icon.ico` or text-only fallback.
- **tests** (`rules/tests.md`): if enabled, each source module has a matching test (Phase 4 mapping); `npm test` exit 0; dev dependencies present.

---

## C. Reporting

- All clean → one short confirmation line in the user's language (no full recap of the checklist).
- Any discrepancy → name the file, the failing check (§A command output or §B item number), and the fix applied or proposed.
- Verification that could not be run (no Node/npm) → state it plainly and list the commands the user must run.

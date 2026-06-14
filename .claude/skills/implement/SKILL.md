---
name: implement
description: Add a feature, IPC channel, entity, or change to an Electron app already delivered by this framework. Use when the user asks to add or modify functionality on an existing project, respecting the locked architectural contract and the security rules.
model: sonnet
---

# /implement — Add a feature to a delivered app

## Role
Senior Electron/React developer working on an existing, contracted codebase.

## Goal
Implement the requested change end-to-end (model → controller → preload → view), contract-compliant, secure, typecheck-clean, without scope creep.

## Deliverable
The modified/added files on disk + an updated `docs/specs/04-contrat.md` if the structure changed + verified build.

---

## Steps

1. **Load context**: read `docs/specs/04-contrat.md` (locked contract), then `rules/mvc.md` · `rules/css.md` · `rules/errors.md` · `rules/config.md` · `rules/security.md` · `rules/db.md` (if DB) · `rules/verification.md` (not auto-imported). Read `design-system.md` / `layout.md` on demand (no longer auto-imported) before any UI change.

2. **State assumptions** before coding. If the request is ambiguous (which entity, which view, business rule), ask — grouped questions, in French.

3. **Decide: within contract OR deviation.**
   - **Within contract** — the change fits the existing tree (new method on a model, new field on a DTO, new control in an existing view): implement directly.
   - **Deviation** — the change needs a new file, IPC channel, entity, or library: **stop, declare the deviation + justification, wait for validation** (the Phase 4 protocol). Only then implement and update `docs/specs/04-contrat.md`.

4. **Implement across the layers** (a new feature usually touches all four):
   - Model: business logic / data access; raise named errors (`models/errors.ts`).
   - IPC channel: declare in `src/shared/ipc-channels.ts` (never hardcode); add the `ipcMain.handle` in the controller with **input validation** (`rules/security.md`); return `IpcResult<T>`.
   - Preload: add one named function mapping the channel; update the `WindowApi` interface in `src/shared/types.ts`.
   - View: call `window.api.x()`, handle `result.ok`, toast on error; styled with `className` + tokens only.
   - New user-facing strings → i18n (`fr.json` + `en.json`) or the `LABELS` object if i18n off.
   - New visual values → tokens in `tokens.css`, never hardcoded.

5. **Verify**: apply `rules/verification.md` (§A executable + §B static). A failing check is blocking. Security checks are not optional.

6. **Update the contract spec** if structure changed; if a deviation was validated, record it in the app's `CLAUDE.md` (`## Écarts par rapport au framework`); offer `/generate-readme` only if the README is now stale on a user-visible aspect.

## Anti-patterns — what NOT to do
- **Do not** touch code outside the request. Minimum change; no opportunistic refactor (that is `/refactor`, on request).
- **Do not** add an IPC channel without declaring it in `ipc-channels.ts`, validating the payload in the controller, and aligning `WindowApi`.
- **Do not** expose raw `ipcRenderer`/Node through the preload, or weaken `webPreferences`/CSP — `rules/security.md` is non-negotiable.
- **Do not** put business logic in a controller or view, or access Node from the renderer.
- **Do not** introduce a library or remote resource not validated in Phase 1 without the deviation protocol.
- **Do not** hardcode a string (i18n) or a visual value (tokens).
- **Do not** silently exceed the contract — declare and validate first.

## When the user asks something adjacent
- **"Just make it work, never mind the architecture/security"** → push back: the MVC split and the security rules are what keep an Electron app safe and maintainable. Implement within them.
- **"Add a whole new screen/entity"** → that is a contract extension. Declare the new files/channels/model, validate, then build.
- **"Fix this bug while you're here"** → if outside the current request scope, flag it and switch to `/fix` rather than bundling an unrelated change.

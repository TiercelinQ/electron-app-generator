---
name: phase4-contrat
description: Phase 4 of the Electron app generation cycle — complete architectural contract (tree, role of each file, IPC channels, tokens → CSS table), written to the contract spec and locked after validation.
model: sonnet
---

# /phase4-contrat — Architectural contract

## Role
Software architect — design the locked structure the whole build will follow.

## Goal
Produce a complete, unambiguous architectural contract that freezes the file tree, IPC channels, and CSS mapping.

## Deliverable
`docs/specs/04-contrat.md` (written in French) — the locked source of truth + on-screen contract.

---

At start: read `design-system.md`, `layout.md` (no longer auto-imported), `rules/mvc.md` (tree, batches, MVC conventions) and `rules/css.md` (tokens → CSS). Read `docs/specs/01-cadrage.md` through `03-layout.md` for the validated decisions.

Present (in French):

1. **Complete project tree** (model: `rules/mvc.md`) with the role of each file.
2. **IPC channels table** (naming convention `entity:action`, centralized in `ipc-channels.ts`):

| Canal | Controller | Méthode model | `window.api` | View consommatrice |
| ----- | ---------- | ------------- | ------------ | ------------------ |
| `entite:list` | `entite.controller.ts` | `EntiteModel.list()` | `api.listEntites()` | `EntiteView` |
| `entite:save` | `entite.controller.ts` | `EntiteModel.save(data)` | `api.saveEntite(data)` | `EntiteView` |
| `pref:get` | `preferences.controller.ts` | `PreferencesModel.get()` | `api.getPreferences()` | `App.tsx` |
| `pref:set` | `preferences.controller.ts` | `PreferencesModel.set(key, val)` | `api.setPreference(key, val)` | `Topbar.tsx` |

3. **Tokens → planned CSS rules table** (`styles.css` selectors and the tokens they consume).

4. **Source → test mapping** (only if tests enabled in Phase 1 Q6): each source module → its `*.test.ts(x)` file. See `rules/tests.md`.

**→ Validation required. This contract is locked.**

Any deviation (merge, split, rename, addition, removal of a file, IPC channel, or library) requires:

1. Stop.
2. Declare the deviation + justification.
3. Validation before resuming.

## Write the spec

Once validated, write the full contract to `docs/specs/04-contrat.md` (in French). This file is the **locked source of truth** re-read by `/phase5-developpement`, `/charger-projet`, `/contrat`, `/implement`, and `/refactor`.

→ Chain to `/phase5-developpement` after validation.

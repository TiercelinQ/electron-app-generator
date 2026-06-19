---
name: electron-load-project
description: Load an existing Electron project (Phase 5 complete) from its specs and README — bring the generator rules to bear on already-delivered code. Invoke from the target project root.
model: sonnet
---

# /electron-load-project — Load an existing project

## Role
Onboarding analyst — take charge of a delivered codebase under the generator rules.

## Goal
Understand the project's structure and confirm the rules apply to any later change.

## Deliverable
A one-block confirmation (French) of the loaded project.

---

Prerequisite: invoked from the target project root, `.claude/` present.

> If the project root has not been provided in this flow, first ask: `Racine du projet à charger ? (chemin du dossier)`. Read everything below relative to that root.

1. **Read the source of truth in priority order:**
   - `docs/specs/04-architect.md` (locked contract — most reliable). If present, it is authoritative for the structure and the IPC channels.
   - Other `docs/specs/*` for the scoping/analysis/layout decisions.
   - `README.md` at the root. If both specs and README are absent: offer `/electron-generate-readme` and stop.
2. Read `package.json` + walk `src/` to confirm the structure (shared / main / preload / renderer).
3. Confirm take-over (in French):

Projet chargé : [APP_NAME] v[VERSION]
Stack : Electron [v] · React [v] · TypeScript
Entités détectées : [list]
Canaux IPC : [count]
Specs : [docs/specs présent : oui/non]
Règles du générateur appliquées.

4. Read and apply all rules (`CLAUDE.md`, `rules/mvc.md` · `rules/css.md` · `rules/errors.md` · `rules/config.md` · `rules/security.md` · `rules/verification.md`, `design-system.md`, `layout.md`) to any later change. The `rules/*` are not auto-imported: read them before any code change.
5. Any structural or security deviation detected between the code and the rules (or vs `docs/specs/04-architect.md`): report it, do not fix without a request (hand off to `/electron-fix-issue` or `/electron-refactor-code`).

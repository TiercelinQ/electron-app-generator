---
name: electron-app
description: Start menu of the Electron app generator — new app, resume an existing session, load a delivered project, or maintain one. Invoke at the beginning of a conversation or at any time via /electron-app.
model: haiku
---

# /electron-app — Start / resume / maintenance menu

## Role
Entry-point dispatcher for the Electron app generator.

## Goal
Route the user to the right flow without re-asking resolved questions.

## Deliverable
The menu, then a handoff to the selected skill.

---

Show this menu (in French):

```
Que faire ?

1. Nouvelle application
2. Reprendre une application existante (fichier SESSION)
3. Charger un projet déjà livré (Phase 5 terminée)
4. Maintenir un projet livré (corriger / ajouter / analyser)

→ Réponds 1, 2, 3 ou 4, ou fournis directement ton fichier SESSION.
```

**1 — New application**: ask for the destination folder, then start `/p1-scoping`:
```
Où créer l'application ? (chemin du dossier de destination, ex: C:\projets\MonApp)
```
Store this path as the project root — all generated files and specs (`docs/specs/`) are written there.

**2 — Resume**: ask for the SESSION file path (`docs/sessions/SESSION_AppName_SN.md`), read it fully. The project root is the folder containing `docs/` (two levels up from the SESSION file); confirm it. Then apply the resume protocol:

1. Read the SESSION block fully.
2. Reply: `Reprise [APP_NAME] — [next phase] | Lot [X/total] | Points ouverts : [list or "aucun"]`
3. Chain immediately without re-asking resolved questions.

If a SESSION block is pasted directly into the message: apply the resume protocol without showing the menu.

**3 — Load a delivered project**: ask for the project root to load, then chain to `/load-project` (`.claude/` present at that root):
```
Racine du projet à charger ? (chemin du dossier, ex: C:\projets\MonApp)
```

**4 — Maintain a delivered project**: ask for the project root, first ensure the project is loaded (`/load-project` if not already), then route to the right maintenance skill based on the user's intent:
```
Racine du projet à maintenir ? (chemin du dossier, ex: C:\projets\MonApp)
```
- understand / trace how something works → `/analyze`
- add a feature → `/feature-add`
- fix a bug → `/fix`
- restructure existing code → `/refactor`
- verify the build / run checks → `/test`

If `/electron-app` is typed mid-project: show the menu only, without resetting the current state.

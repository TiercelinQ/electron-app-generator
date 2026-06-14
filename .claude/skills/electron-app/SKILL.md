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

**1 — New application**: start `/phase1-cadrage` immediately.

**2 — Resume**: ask for the SESSION file path (`claude-sessions/SESSION_AppName_SN.md`), read it fully, then apply the resume protocol:

1. Read the SESSION block fully.
2. Reply: `Reprise [APP_NAME] — [next phase] | Lot [X/total] | Points ouverts : [list or "aucun"]`
3. Chain immediately without re-asking resolved questions.

If a SESSION block is pasted directly into the message: apply the resume protocol without showing the menu.

**3 — Load a delivered project**: chain to `/charger-projet` (invoke from the target project root, `.claude/` present).

**4 — Maintain a delivered project**: first ensure the project is loaded (`/charger-projet` if not already), then route to the right maintenance skill based on the user's intent:
- understand / trace how something works → `/analyze`
- add a feature → `/implement`
- fix a bug → `/fix`
- restructure existing code → `/refactor`
- verify the build / run checks → `/test`

If `/electron-app` is typed mid-project: show the menu only, without resetting the current state.

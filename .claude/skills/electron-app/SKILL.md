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

Present the start menu with the `AskUserQuestion` tool (single question, 4 clickable options — do not make the user type a number):
- New application
- Resume an existing application (SESSION file)
- Load an already-delivered project (Phase 5 complete)
- Maintain a delivered project (fix / add / analyze)

Map the chosen option to the routing below; a pasted SESSION block still triggers the resume protocol directly. The folder/SESSION-path prompts stay free-form text.

**1 — New application**: ask for the destination folder, then start `/electron-p1-scoping`:
Where to create the application? (destination folder path, e.g. C:\projects\MyApp)
Store this path as the project root — all generated files and specs (`docs/specs/`) are written there.

**2 — Resume**: ask for the SESSION file path (`docs/sessions/SESSION_AppName_SN.md`), read it fully. The project root is the folder containing `docs/` (two levels up from the SESSION file); confirm it. Then apply the resume protocol:

1. Read the SESSION block fully.
2. Reply: `Resuming [APP_NAME] — [next phase] | Batch [X/total] | Open points: [list or "none"]`
3. Chain immediately without re-asking resolved questions.

If a SESSION block is pasted directly into the message: apply the resume protocol without showing the menu.

**3 — Load a delivered project**: ask for the project root to load, then chain to `/electron-load-project` (`.claude/` present at that root):
Project root to load? (folder path, e.g. C:\projects\MyApp)

**4 — Maintain a delivered project**: ask for the project root, first ensure the project is loaded (`/electron-load-project` if not already), then route to the right maintenance skill based on the user's intent:
Project root to maintain? (folder path, e.g. C:\projects\MyApp)
- understand / trace how something works → `/electron-trace-feature`
- add a feature → `/electron-add-feature`
- fix a bug → `/electron-fix-issue`
- restructure existing code → `/electron-refactor-code`
- verify the build / run checks → `/electron-run-tests`

If `/electron-app` is typed mid-project: show the menu only, without resetting the current state.

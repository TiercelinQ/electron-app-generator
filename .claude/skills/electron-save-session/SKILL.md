---
name: electron-save-session
description: Save the full state of the generation session into docs/sessions/SESSION_AppName_SN.md — phase, batches, locked decisions, open points, referencing the specs. Invoke at the end of a session.
model: haiku
---

# /electron-save-session — Session save

## Role

Session archivist.

## Goal

Persist enough state to resume the project exactly where it stopped.

## Deliverable

`docs/sessions/SESSION_[app_name]_S[N].md` (in the user's language).

---

Use the native Claude Code tools (Windows-compatible):

1. **Create** the `docs/sessions/` folder at the project root if it does not exist.
2. Determine `[N]`: list `docs/sessions/SESSION_*_S*.md` via `Glob`, extract the integers (`S(\d+)\.md$`), `[N] = max + 1` (or `1` if none). `[app_name]` = exact `APP_NAME` from `src/shared/config.ts` (no spaces).
3. **Write** `docs/sessions/SESSION_[app_name]_S[N].md` via `Write`:

# SESSION_S[N] — [APP_NAME] · [completed phase]

## Status

Completed phase: [N — name]
Next phase: [N+1 — name]
Next batch: [X+1/total] (if Phase 5)

## Locked decisions

- OS: Windows · Stack: Electron + React + TypeScript (electron-vite)
- DB: [value]
- Persistent preferences: [Yes/No] · i18n: [Yes/No] · Tests: [Yes/No]
- Icon: [provided/default] · Packaging: [Yes/No] · Salesforce CLI: [Yes/No]
- Palette: [name or custom; 5 light roles + derived]
- Calibration: [Small 3 batches / Medium-Large 4 batches] (+1 test batch if tests enabled)
- Selected features: [list]
- Out of scope: [list]
- Chosen layout: [description · toast position · splash screen Yes/No + icon source]
- Validated libraries: [list]

## Specs

Reference: docs/specs/01-scoping.md · 02-featuring.md · 03-surfaces.md · 04-architect.md
(the locked contract in 04-architect.md is authoritative — do not duplicate it here)

## Delivered batches

- [x] Batch 1/[total] — [content]
- [ ] Batch 2/[total] — [content]
- ...

## Open points

[list or "none"]

> If `docs/specs/04-architect.md` exists, reference it instead of duplicating the full tree + IPC channels. Only summarize the locked decisions here.

4. Confirm: `Session saved: docs/sessions/SESSION_[app_name]_S[N].md`
5. Do not append the `/electron-save-session` · `/electron-show-state` · `/electron-show-contract` reminder after this reply.

> Resuming from a SESSION file is handled by `/electron-app` (option 2 or a pasted SESSION block) — not by this skill.

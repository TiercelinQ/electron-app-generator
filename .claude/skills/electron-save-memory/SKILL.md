---
name: electron-save-memory
description: Memorize an error not to repeat, a structural decision, or a generation preference — persisted into Claude Code native memory (project memory folder + MEMORY.md index), available in later sessions.
model: haiku
---

# /electron-save-memory — Memorization

## Role
Memory keeper.

## Goal
Persist a durable lesson, decision, or preference into native memory.

## Deliverable
A native memory file + a one-line pointer in `MEMORY.md`.

---

## Step 1 — Categorize

Ask what to retain (in French):

```
Que veux-tu retenir ?

A. Une erreur à ne plus reproduire — décrire l'erreur et la solution retenue
B. Une décision structurante — décrire le choix et la raison
C. Une préférence de génération — décrire le comportement souhaité
D. Autre — décrire librement
```

## Step 2 — Persist via Claude Code native memory

Category → native memory type:

| Choice | Memory type  | Expected content                                              |
| ------ | ------------ | ------------------------------------------------------------- |
| A      | `feedback`   | The note + **Why:** (why it was an error) and **How to apply:** (corrective rule) lines |
| B      | `project`    | The decision + context (convert any relative date to absolute) |
| C      | `feedback`   | The preference + **Why:** and **How to apply:**               |
| D      | `reference`  | Pointer / free note                                           |

Procedure:
- Write a `<kebab-slug>.md` file in the project memory folder (managed by Claude Code), with the native frontmatter:
  ```markdown
  ---
  name: <kebab-slug>
  description: <one-line summary>
  metadata:
    type: feedback | project | reference
  ---

  <dense note; for feedback, follow with **Why:** and **How to apply:**>
  ```
- Add a one-line pointer in `MEMORY.md`: `- [Title](file.md) — hook`.
- Before writing: check that no existing entry already covers the point → update it rather than duplicate.

## Step 3 — Confirmation

If auto-memory is not enabled: say so (`/config → Memory`), still formulate the entry. Confirm in one line (French).

Do not append the `/electron-save-session · /electron-show-state · /electron-show-contract` reminder after this reply.

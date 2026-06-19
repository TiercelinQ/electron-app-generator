---
name: electron-generate-readme
description: Analyze the specs and source of an existing Electron project and generate its README.md (objective, stack, tree, IPC channels, conventions, installation). Invoke from the target project root.
model: sonnet
---

# /electron-generate-readme — Generate the README.md

## Role
Technical writer — produce an accurate project README from specs + code.

## Goal
Write a README that reflects what was actually built.

## Deliverable
`README.md` at the project root.

---

Prerequisite: invoked from the target project root.

1. **Sources, in priority**: `docs/specs/*` (especially `04-architect.md`) for the intended structure, then the real code — `package.json`, `src/shared/` (config, ipc-channels, types), `src/main/models/`, `src/main/controllers/`, `src/preload/`, `src/renderer/src/views/`, `src/renderer/src/styles/`. When specs and code disagree, the code is what shipped — describe the code and note the divergence.
2. Generate `README.md` at the root:

```markdown
# [APP_NAME]

[Objective inferred from specs/code — 2 sentences max]

## Stack
[table: Electron, React, TypeScript, DB, i18n, packaging]

## Tree
[real tree with the role of each file]

## IPC channels
[table channel → controller → model → renderer usage]

## Conventions
[MVC, CSS tokens, toasts, security — pointer to the rules]

## Installation
npm install
npm run dev          # development
npm run typecheck    # TypeScript verification
npm run build        # build without packaging
npm run dist         # Windows packaging (if requested)
```
<!-- If better-sqlite3: run `npx electron-builder install-app-deps` after `npm install` -->

3. Write the file to disk, confirm in one line (in the user's language).
4. If anything is undeterminable from specs + code: ask the closed questions with `AskUserQuestion` (clickable options) before writing.

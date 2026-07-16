---
name: electron-generate-readme
description: Analyze the specs and source of an existing Electron project and generate its README.md (objective, features, stack, tree, IPC channels, conventions, installation). Invoke from the target project root.
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

Use the native Claude Code tools (no shell — Windows-compatible):

1. **Sources, in priority**: `docs/specs/*` (especially `04-architect.md`) for the intended structure, then the real code:
   - List source files via `Glob` `src/**/*` (exclude `node_modules/`, `out/`, `dist/`).
   - Read `package.json`, `src/shared/` (config, ipc-channels, types), `src/main/models/`, `src/main/controllers/`, `src/preload/`, `src/renderer/src/views/`, `src/renderer/src/styles/`.
   - Detect `test/` via `Glob` `test/**/*.test.*`.
   - When specs and code disagree, the code is what shipped — describe the code and note the divergence.
2. Generate `README.md` at the root via `Write`:

```markdown
# [APP_NAME] — v[VERSION]

## Objective
[Inferred from docs/specs, config.ts and the structure — 2 sentences max]

## Features
- [Inferred from the present views/ and controllers/]

## Technical stack
- OS: Windows · Runtime: Node.js 24 LTS+ · Electron ≥ 42 · React 19 · TypeScript strict · Icons: Lucide (`lucide-react`)
- DB: [inferred from package.json and models/]
- i18n: [Yes/No — inferred from src/renderer/src/i18n/]
- Salesforce CLI: [Yes/No — inferred from src/main/models/sf-cli.ts + the `sfPath` preference]
- Tests: [Yes (Vitest + Testing Library) | No — inferred from the presence of test/]

## Architecture
[Actual file tree with the role of each file]

## IPC channels
[table channel → controller → model → renderer usage]

## Conventions
[MVC, CSS tokens, toasts, security — pointer to the rules]

## Prerequisites
<!-- Only if the Salesforce CLI integration is on: the `sf` v2 CLI must be installed and on the PATH (or set the `sfPath` preference). The official standalone installer ships its own Node and avoids the npm `.cmd` shim. The Salesforce DX tooling is an optional recommendation, not required. -->

## Installation
npm install
npm run dev          # development
npm run typecheck    # TypeScript verification
npm run build        # build without packaging
npm run dist         # Windows packaging (if enabled)

## Tests
[Section included only if test/ detected]
npm test

## Palette
[Name or custom accent (+ any explicit overrides) inferred from tokens.css — neutrals and semantics derived from the accent (design-system v2.0); otherwise default "Steel Blue" palette]
```
<!-- If better-sqlite3: run `npx electron-builder install-app-deps` after `npm install` -->

3. Write the file via `Write` (never `cat`/heredoc — Windows-incompatible).
4. If anything is undeterminable from specs + code: ask the closed questions with `AskUserQuestion` (clickable options) before writing.

Confirm with: `README.md generated at the project root.`

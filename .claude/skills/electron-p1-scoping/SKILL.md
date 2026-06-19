---
name: electron-p1-scoping
description: Phase 1 of the Electron app generation cycle — scoping in 6 grouped questions, full color palette choice, calibration announcement (number of batches), and writing of the scoping spec.
model: sonnet
---

# /electron-p1-scoping — Scoping

## Role
Project scoper — turn a vague idea into a bounded, validated scope.

## Goal
Lock the project parameters (DB, preferences, i18n, icon, calibration, palette) before any analysis.

## Deliverable
`docs/specs/01-scoping.md` (written in the user's language) + on-screen summary.

---

## 1. Questions

> If invoked directly (not routed from `/electron-app`) without a destination folder set for this flow, first ask: `Where to create the application? (destination folder path)`.

Ask Q1 (objective) as free-form text, then the closed parameters with the `AskUserQuestion` tool (clickable options, the recommended one first). Cap = **4 questions per call** → **two calls**.

1. **Objective** — free-form text: "Application objective? (free description)".
2. **`AskUserQuestion` — call 1** (4 questions, each with a recommended option):
   - **Database**: `SQLite` (recommended, better-sqlite3) · `JSON` · `CSV` · `none`.
   - **Persistent preferences** (theme, window…): `Yes` (recommended) · `No`.
   - **FR/EN i18n** (FR by default): `No` (recommended, unless a real EN need) · `Yes`.
   - **Automated tests** (Vitest + Testing Library): `Yes` (recommended, pro use) · `No`.
3. **`AskUserQuestion` — call 2** (1 question):
   - **Application icon**: `No` (recommended — Electron default, can be added later) · `Yes`. If `Yes`, ask the `.ico` path as free-form text.

## 2. Color palette

After the answers, propose the **palette** with `AskUserQuestion` (single question; clickable options from the catalog, recommended default first; the **Other** option covers a remaining named palette and the custom palette). A palette = 5 **light** roles (main background, secondary background, accent, text, details); the dark theme and all supporting tokens are derived (`design-system.md §2`).

- **Palette — `AskUserQuestion`**, options (≤ 4): `Steel` (default, recommended) · `Forest` · `Slate` · `Amber`. The **Other** option covers `Ruby` and a **custom palette**. If the user picks a custom palette, ask the 5 light hex values as free-form text (main background, secondary background, accent, text, details). Catalog + hex values: `design-system.md §2`.
- Steel is the recommended default; the named-palette values are canonical — do not improvise them. If no answer: default palette.
- From the 5 light roles, Claude **derives** and announces: supporting light tokens (`--bg-muted`, `--bg-elevated`, `--text-subtle`, `--text-muted`, `--border-subtle`, `--border-strong`), the 5 accent stops (`--primary-50/400/700/800/900`), `--text-on-primary`, and the **whole dark theme** (`[data-theme="dark"]`, lightness targets in `design-system.md §2`). Written to `tokens.css`. Semantic and icon tokens stay fixed.
- **Contrast check (WCAG AA, non-blocking)**: compute text/bg, text-subtle/bg, accent/bg, text-on-primary/accent; if a ratio fails AA, report it (`color — ratio — target`) and ask the user to confirm or adjust before continuing.
- The global `design-system.md` stays unchanged.

## 3. Calibration — announced at the end of Phase 1

Apply the CALIBRATION table in `CLAUDE.md` (canonical source): Small (< 10 files and ≤ 5 features) → 3 batches; Medium/Large (≥ 10 or > 5) → 4 batches; divergent criteria → the highest wins. **+1 batch if tests are enabled (Q6)** — Small 4 / Medium-Large 5.

The number of batches is frozen after validation. No further modification possible.

## 4. Libraries

Any library outside the stack (charts, zod, electron-log…) is proposed and validated here — none can be added later without a declaration protocol.

## 5. Write the spec

Write `docs/specs/01-scoping.md` (in the user's language) capturing: objective, DB choice, persistent preferences, i18n, icon, tests (Q6), the **palette** (name or custom; the 5 light roles + the derived dark theme + accent stops + text-on-primary; semantic kept fixed) and the contrast-check result, validated libraries, and the frozen calibration (size + number of batches). If `docs/specs/` does not exist yet, create it (it will live in the generated project root).

→ Chain to `/electron-p2-featuring` after validation.

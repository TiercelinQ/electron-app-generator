---
name: electron-p1-scoping
description: Phase 1 of the Electron app generation cycle — scoping in 8 questions (incl. application icon, packaging, Salesforce CLI opt-in), full color palette choice, calibration announcement (number of batches), and writing of the scoping spec.
model: sonnet
---

# /electron-p1-scoping — Scoping

## Role
Project scoper — turn a vague idea into a bounded, validated scope.

## Goal
Lock the project parameters (DB, preferences, i18n, tests, icon, packaging, palette) before any analysis.

## Deliverable
`docs/specs/01-scoping.md` (written in the user's language) + on-screen summary.

---

## 1. Questions

**Phase banner (show first)** — on a new app, first list the 5 phases once (overview in `## PIPELINE` of `CLAUDE.md`). Then output the phase banner as plain Markdown in the user's language, **never inside a code block or fenced block**. Three blocks, each on its own line: (1) H2 heading: Phase 1/5 — Scoping; (2) progress line: ▶ Scoping · Features · Surfaces · Architecture · Development; (3) intent in italics: Destination folder, project parameters, palette.

Start with the objective, then establish the project root (folder name → location → creation), then ask the closed parameters with the `AskUserQuestion` tool (clickable options, the recommended one first). Cap = **4 questions per call** → **two calls**.

1. **Objective** — plain text, **not** `AskUserQuestion` (free-form, non-enumerable): "Application objective? (free description)".

### Project root (folder name → location → creation)

> Skip this block if a project root is already established for this flow.

- **Folder name** — propose 2-4 candidate names derived from the objective, **in kebab-case** (e.g. `expense-tracker`), the recommended one first, with `AskUserQuestion` (the **Other** option carries a custom name as free-form text). The user selects a candidate or types their own. This is the **project directory name**, distinct from the application name chosen in Phase 2.
- **Location** — free-form text: `Parent folder where to create the project? (path, e.g. C:\projects)`.
- **Create the folder** — project root = `[parent]\[folder-name]`. Create it, then confirm: `Project root: [path]`. If it already exists and is not empty, warn and ask the user to confirm reuse or pick another name. Store this path as the project root — all generated files and specs (`docs/specs/`) are written there.

### Closed parameters

> **Salesforce detection (before call 1)** — scan the objective text for the Salesforce cluster: `Salesforce`, `sf`/`sf CLI`, `org`, `scratch org`, `sandbox`, `Apex`, `SOQL`/`SOSL`, `sObject`, `metadata`/`deploy`/`retrieve`, `package`/`2GP`, `permission set`, `Dev Hub`, `Agentforce`. If any term is present, the **Salesforce CLI integration** question below switches its recommended default to `Yes` with a one-line rationale ("the objective mentions Salesforce"). The user still confirms — they may keep `No`. The single resolved Yes/No governs both @rules/sf-cli.md and the `sf-cli-reference/` catalog.

2. **`AskUserQuestion` — call 1** (4 questions, each with a recommended option):
   - **Database**: `SQLite` (recommended for structured data — better-sqlite3) · `JSON` · `CSV` · `none`.
   - **Persistent preferences** (theme, window…): `Yes` (recommended) · `No`.
   - **FR/EN i18n** (FR by default): `No` (recommended, unless a real EN need) · `Yes`.
   - **Automated tests** (Vitest + Testing Library): `Yes` (recommended, pro use) · `No`.
3. **`AskUserQuestion` — call 2** (3 questions):
   - **Application icon**: `No` (recommended — Electron default, can be added later) · `Yes`. If `Yes`, ask the `.ico` path as free-form text (saved as `resources/icon.ico` — window/taskbar, packaging, and splash all reuse it).
   - **Windows packaging** (electron-builder — NSIS + portable): `No` (recommended, unless distributing) · `Yes`.
   - **Salesforce CLI integration** (`sf` v2): default `No` (general-purpose app) — but **flip the recommended option to `Yes` when the Salesforce detection above matched** (state the rationale). If `Yes`, @rules/sf-cli.md applies (it routes to the `sf-cli-reference/` command catalog) and the default scaffold adds the `sf` runner + typed helpers + a starter Org Manager (orgs list view). `sf` becomes a runtime prerequisite (detected); the official Salesforce tooling stays an optional recommendation, not a hard dependency.

## 2. Color palette

After the answers, propose the **palette** with `AskUserQuestion` (single question; clickable options from the catalog, recommended default first; the **Other** option covers a remaining named palette and the custom palette). A palette = **1 mandatory accent** + up to 4 **optional overrides** (main background, secondary background, text, details); every neutral token, the accent stops, and the semantic colors derive from the accent (`design-system.md §2`).

- **Palette — `AskUserQuestion`**, options (≤ 4): `Steel Blue` (default, recommended) · `Teal` · `Forest` · `Slate`. The **Other** option covers `Amber`, `Ruby` and a **custom palette**. If the user picks a custom palette, ask the accent hex as free-form text, then offer the 4 optional overrides (free-form, skippable — most projects need the accent only). Catalog + accents: `design-system.md §2`.
- Steel Blue is the recommended default; the named-palette values are canonical — do not improvise them. If no answer: default palette.
- From the accent (+ any overrides), Claude **derives** and announces: the 5 accent stops (`--primary-50/400/700/800/900`), `--text-on-primary`, the **accent-tinted neutrals** for both themes (`:root` + `[data-theme="dark"]`, HSL targets in `design-system.md §2`), and the **per-project semantic colors** (hue anchors harmonized ±6° toward the accent; info = accent; `--*-50` surface mixes; danger 700/800 stops). Explicit overrides win over the tinted targets; their supporting tokens derive from them. Written as literal hex to `tokens.css`. The `--icon-*` tokens consume the derived tokens via `var()` — nothing to derive for them.
- **Contrast check (WCAG AA, non-blocking)**: compute text/bg, text-subtle/bg, accent/bg, text-on-primary/accent, and each derived semantic pair (`--*-600` vs `--bg` and vs its `--*-50`); if a ratio fails AA, report it (`color — ratio — target`) and ask the user to confirm or adjust before continuing.
- The global `design-system.md` stays unchanged.

## 3. Provisional calibration — announced at the end of Phase 1

Apply the CALIBRATION table in `CLAUDE.md` (canonical source) — it holds the size thresholds, the batch counts, and the +1 batch when tests are enabled (Q5); do not restate them here. The Salesforce CLI integration adds files (runner + Org Manager controller/view/channels) and pushes the size up (no dedicated batch — the runner ships in Batch 1).

Announce it as **provisional** (template, rendered in the user's language):

Provisional calibration: [Small | Medium/Large] — [N] batches (incl. 1 test batch if enabled)
(Confirmed at the end of Phase 2, after counting the real features.)

The real feature count is not known yet (features are elicited in Phase 2). The calibration is **confirmed and locked at the end of Phase 2**, on the v1.0 feature count.

## 4. Libraries

Any library outside the stack (charts, zod…) is proposed and validated here — none can be added later without a declaration protocol.

## 5. Write the spec

Write `docs/specs/01-scoping.md` (in the user's language) capturing: objective, DB choice, persistent preferences, i18n, tests (Q5), icon, packaging, Salesforce CLI integration (Yes/No), the **palette** (preset name or custom accent; any explicit overrides; the derived accent stops, tinted neutrals for both themes, text-on-primary, and per-project semantic colors) and the contrast-check result, validated libraries, and the provisional calibration (size + number of batches — confirmed in Phase 2). If `docs/specs/` does not exist yet, create it (it will live in the generated project root).

→ Chain to `/electron-p2-featuring` after validation.

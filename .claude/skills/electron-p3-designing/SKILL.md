---
name: electron-p3-designing
description: Phase 3 of the Electron app generation cycle — layout proposal based on layout.md, grouped customization questions, validated synthesis written to the layout spec before Phase 4.
model: sonnet
---

# /electron-p3-designing — Layout proposal

## Role
UI designer — map the validated features onto the binding layout system.

## Goal
Define the concrete layout (tabs, optional drawer, recurring components) within `layout.md` constraints.

## Deliverable
`docs/specs/03-designing.md` (written in the user's language) + on-screen synthesis.

---

## 1. Proposal

**Phase banner (show first)** — before anything else, output the phase banner as plain Markdown in the user's language, **never inside a code block or fenced block**. Three blocks, each on its own line: (1) H2 heading: Phase 3/5 — Design; (2) progress line: Scoping ✓ · Features ✓ · ▶ Design · Architecture · Development; (3) intent in italics: Map the validated features onto the layout. See `## PIPELINE` in `CLAUDE.md`.

**Read `design-system.md` and `layout.md` first** (no longer auto-imported).

Based on the project description (`docs/specs/02-featuring.md`), propose a layout among the structures defined in `layout.md`:

1. Describe the chosen structure (tabs, optional drawer, recurring components).
2. Justify the choice against the features.
3. List the navigation tabs and their content.

> If the Salesforce CLI integration is on (Phase 1), present the **Org Manager** surface as a baseline: a view listing the orgs (connected/disconnected state, default org marked) with add / remove / reconnect / set-default / refresh actions, typically its own tab. Confirm its placement in the layout. See @rules/sf-cli.md.

## 2. Customization — questions via `AskUserQuestion`

For each question offering a choice, mark the option you recommend with `(recommended)`, chosen from the validated feature context.

Ask in the user's language:

Layout customization:

1. Tab position: left after logo / centered?
2. Secondary panel: Drawer / Modal / None?
3. [If Drawer] Width: fixed 320px / fixed custom / dynamic?
   [If Modal] Size: fixed / dynamic?
4. [If Modal] Internal layout:
   - Header + content + footer
   - Header + 2 columns + footer
   - Header + content (no footer)
   - Other
5. Toasts are positioned top-right — the only position specified by `layout.md §5`.

If "Autre" in 4: ask 3 questions to help choose, then propose 2 layouts with a recommendation.

## 3. Synthesis

Produce a complete synthesis of the validated layout (structure, tabs, panel, toasts, any deviations vs the `layout.md` default).

**→ Explicit validation required before Phase 4.**

## 4. Write the spec

Once validated, write the synthesis to `docs/specs/03-designing.md` (in the user's language).

→ Chain to `/electron-p4-architect` after validation.

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

**Read `design-system.md` and `layout.md` first** (no longer auto-imported).

Based on the project description (`docs/specs/02-featuring.md`), propose a layout among the structures defined in `layout.md`:

1. Describe the chosen structure (tabs, optional drawer, recurring components).
2. Justify the choice against the features.
3. List the navigation tabs and their content.

## 2. Customization — questions grouped in a single block

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

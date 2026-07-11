---
name: electron-p3-surfaces
description: Phase 3 of the Electron app generation cycle — layout proposal based on layout.md, grouped customization questions, validated synthesis written to the layout spec before Phase 4.
model: sonnet
---

# /electron-p3-surfaces — Layout proposal

## Role
UI designer — map the validated features onto the binding layout system.

## Goal
Define the concrete layout (tabs, drawer/modal, toast position, recurring components) within `layout.md` constraints.

## Deliverable
`docs/specs/03-surfaces.md` (written in the user's language) + on-screen synthesis.

---

## 1. Proposal

**Phase banner (show first)** — before anything else, output the phase banner as plain Markdown in the user's language, **never inside a code block or fenced block**. Three blocks, each on its own line: (1) H2 heading: Phase 3/5 — Surfaces; (2) progress line: Scoping ✓ · Features ✓ · ▶ Surfaces · Architecture · Development; (3) intent in italics: Map the validated features onto the layout. See `## PIPELINE` in `CLAUDE.md`.

**Read `design-system.md` and `layout.md` first** (no longer auto-imported).

Based on the features validated in Phase 2 (`docs/specs/02-featuring.md`), propose a layout among the structures defined in `layout.md`, justified against the features. Produce (in the user's language):

## Proposed layout — [APP_NAME]

**Structure**
[Description: topbar, tabs, main content, statusbar]

**Tabs**
| Tab | Content |
| --- | ------- |
| …   | …       |

**Recurring components**
- [Table / Form / Tree / Charts — depending on the features]

> If the Salesforce CLI integration is on (Phase 1), present the **Org Manager** surface as a baseline: a view listing the orgs (connected/disconnected state, default org marked) with add / remove / reconnect / set-default / refresh actions, typically its own tab. Confirm its placement in the layout. See @rules/sf-cli.md.

## 2. Customization — questions via `AskUserQuestion`

For each question, mark the option you recommend with `(recommended)`, chosen from the validated feature context. Ask with `AskUserQuestion` (clickable options, ≤ 4 options each, **Other** for the rest; split into ≤ 4-question calls). Ask in the user's language:

A few choices to confirm:

1. Tab position in the topbar:
   A. After the logo and name (left-aligned)
   B. Centered

2. Secondary panel: drawer or modal?
   A. Drawer (persistent side panel)
   B. Modal (overlay window)
   C. None

[If A — Drawer:]
3. Drawer width:
   A. Fixed 320px (design-system.md default)
   B. Fixed custom — specify the value
   C. Dynamic (adapts to content)

[If B — Modal:]
3. Modal size:
   A. Fixed — specify width × height
   B. Dynamic (adapts to content)

4. Modal internal layout:
   A. Header + main content + footer
   B. Header + 2 columns (main content) + footer
   C. Header + main content (no footer)
   D. Other — I'm not sure, help me choose

5. Toast position (`layout.md §5`):
   A. Top-right (default)
   B. Top-left
   C. Top-center
   D. Bottom-right
   E. Bottom-left
   F. Bottom-center

Show only the relevant questions for the feature context. If the project clearly needs no drawer or modal, skip questions 3/4 and note the absence of a secondary panel. Question 5 (toasts) is always asked; the choice sets `TOAST_POSITION` (`src/shared/config.ts`) and the persisted `toast position` preference.

If the user picks D on question 4: ask 3 questions with `AskUserQuestion` to help define the layout:

To help you choose the layout:

a. What is the main purpose of this modal?
b. Are there actions to perform from this modal? Yes / No
c. Is the content homogeneous (single block) or heterogeneous (several sections)?

Based on the answers, propose 2 suited layouts with a justified recommendation, then confirm before the synthesis.

6. **Splash screen** (`AskUserQuestion`): `Yes` (recommended) · `No`. A frameless splash window shown at launch until the main window is ready, following the design system (flat, palette, dark mode). See @rules/splash.md.
   - **If `Yes` and no application icon was defined in Phase 1** (Q6 = No): ask, as free-form text, for an **optional** icon path (`.ico`/`.png`) to show on the splash — "Icon to display on the splash? (path, or leave empty for text-only)". A provided image is saved as `resources/icon.ico` and becomes the app icon everywhere; empty → text-only splash (app name). If the Phase 1 icon is already set, the splash reuses it (no extra question).

## 3. Synthesis

Produce the complete synthesis of the validated layout (in the user's language): structure, tabs, secondary panel, recurring components, toast position, splash screen on/off + icon source, any deviations vs the `layout.md` default.

**→ Explicit validation required before Phase 4.**

## 4. Write the spec

Once validated, write the synthesis to `docs/specs/03-surfaces.md` (in the user's language).

→ Chain to `/electron-p4-architect` after validation.

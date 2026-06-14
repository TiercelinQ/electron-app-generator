---
name: phase3-layout
description: Phase 3 of the Electron app generation cycle — layout proposal based on layout.md, grouped customization questions, validated synthesis written to the layout spec before Phase 4.
model: sonnet
---

# /phase3-layout — Layout proposal

## Role
UI designer — map the validated features onto the binding layout system.

## Goal
Define the concrete layout (tabs, optional drawer, recurring components) within `layout.md` constraints.

## Deliverable
`docs/specs/03-layout.md` (written in French) + on-screen synthesis.

---

## 1. Proposal

**Read `design-system.md` and `layout.md` first** (no longer auto-imported).

Based on the project description (`docs/specs/02-analyse.md`), propose a layout among the structures defined in `layout.md`:

1. Describe the chosen structure (tabs, optional drawer, recurring components).
2. Justify the choice against the features.
3. List the navigation tabs and their content.

## 2. Customization — questions grouped in a single block

Ask in French:

```
Personnalisation du layout :

1. Position des onglets : gauche après logo / centrés ?
2. Panneau secondaire : Drawer / Modale / Aucun ?
3. [Si Drawer] Largeur : fixe 320px / fixe personnalisée / dynamique ?
   [Si Modale] Taille : fixe / dynamique ?
4. [Si Modale] Disposition interne :
   - Header + contenu + footer
   - Header + 2 colonnes + footer
   - Header + contenu (sans footer)
   - Autre
5. Les toasts sont positionnés en haut-droit — seule position spécifiée par `layout.md §5`.
```

If "Autre" in 4: ask 3 questions to help choose, then propose 2 layouts with a recommendation.

## 3. Synthesis

Produce a complete synthesis of the validated layout (structure, tabs, panel, toasts, any deviations vs the `layout.md` default).

**→ Explicit validation required before Phase 4.**

## 4. Write the spec

Once validated, write the synthesis to `docs/specs/03-layout.md` (in French).

→ Chain to `/phase4-contrat` after validation.

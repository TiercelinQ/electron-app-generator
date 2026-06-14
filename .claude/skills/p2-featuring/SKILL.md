---
name: p2-featuring
description: Phase 2 of the Electron app generation cycle — structured requirements sheet, blocking validation before Phase 3, written to the analysis spec.
model: sonnet
---

# /p2-featuring — Requirements analysis

## Role
Requirements analyst — turn the scope into an unambiguous feature list.

## Goal
Produce a structured requirements sheet and get explicit sign-off before any layout work.

## Deliverable
`docs/specs/02-featuring.md` (written in French) + on-screen sheet.

---

Produce a structured sheet (in French):

- **Objectif de l'application**
- **Fonctionnalités retenues** (list)
- **Hors périmètre**
- **Contraintes techniques** (DB, preferences, i18n, libraries validated in Phase 1)

Base it on `docs/specs/01-scoping.md`.

**→ Explicit validation required before Phase 3.**

If partial validation: list the open points, block until full resolution. Do not start Phase 3 while any point remains open.

## Write the spec

Once validated, write the sheet to `docs/specs/02-featuring.md` (in French).

→ Chain to `/p3-designing` after validation.

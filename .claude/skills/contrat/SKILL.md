---
name: contrat
description: Show the complete validated architectural contract (Phase 4) — tree with the role of each file and the IPC channels. Reads docs/specs/04-contrat.md.
model: haiku
---

# /contrat — Validated architectural contract

## Role
Contract reporter.

## Goal
Display the locked contract from the source of truth.

## Deliverable
The contract on screen (French).

---

Read `docs/specs/04-contrat.md` (the locked source of truth) and display the complete validated tree with the role of each file, followed by the IPC channels table.

If `docs/specs/04-contrat.md` does not exist and no contract has been validated in session yet: `Aucun contrat validé — Phase 4 non atteinte.`

Do not append the `/session · /statut · /contrat` reminder after this reply.

---
name: show-contract
description: Show the complete validated architectural contract (Phase 4) — tree with the role of each file and the IPC channels. Reads docs/specs/04-architect.md.
model: haiku
---

# /show-contract — Validated architectural contract

## Role
Contract reporter.

## Goal
Display the locked contract from the source of truth.

## Deliverable
The contract on screen (French).

---

Read `docs/specs/04-architect.md` (the locked source of truth) and display the complete validated tree with the role of each file, followed by the IPC channels table.

If `docs/specs/04-architect.md` does not exist and no contract has been validated in session yet: `Aucun contrat validé — Phase 4 non atteinte.`

Do not append the `/session · /show-state · /show-contract` reminder after this reply.

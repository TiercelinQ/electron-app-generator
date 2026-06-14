---
name: phase1-cadrage
description: Phase 1 of the Electron app generation cycle — scoping in 5 grouped questions, primary color choice, calibration announcement (number of batches), and writing of the scoping spec.
model: sonnet
---

# /phase1-cadrage — Scoping

## Role
Project scoper — turn a vague idea into a bounded, validated scope.

## Goal
Lock the project parameters (DB, preferences, i18n, icon, calibration, primary color) before any analysis.

## Deliverable
`docs/specs/01-cadrage.md` (written in French) + on-screen summary.

---

## 1. Questions — single block

Ask in French:

```
Cadrage du projet :

1. Objectif de l'application — description libre.
2. Base de données : SQLite (better-sqlite3) / JSON / CSV / aucune ?
3. Préférences persistantes entre sessions (thème, fenêtre…) ? Oui / Non
4. Internationalisation FR/EN activée pour ce projet ? Oui / Non (FR par défaut si Non)
5. Icône applicative : fichier .ico fourni ? Oui (chemin) / Non (défaut Electron, ajout possible plus tard)
6. Tests automatisés (Vitest + Testing Library) ? Oui / Non — recommandé Oui pour usage pro
```

## 2. Primary color

After receiving the answers, propose (in French):

```
Couleur primaire pour ce projet :

A. [Color 1] — [light hex] / [dark hex] — [character in 3 words]
B. [Color 2] — [light hex] / [dark hex] — [character in 3 words]
C. [Color 3] — [light hex] / [dark hex] — [character in 3 words]
D. Slate Blue  — #4F46E5 / #818CF8          — professionnel, tech, sobre (défaut)
```

- Propose 3 professional colors suited to the described application context.
- If A, B or C: the `--primary-50`, `--primary-400`, `--primary-600`, `--primary-900` values are set for this project in `tokens.css`. The global `design-system.md` stays unchanged.
- If D or no answer: Slate Blue by default.

## 3. Calibration — announced at the end of Phase 1

Apply the CALIBRATION table in `CLAUDE.md` (canonical source): Small (< 10 files and ≤ 5 features) → 3 batches; Medium/Large (≥ 10 or > 5) → 4 batches; divergent criteria → the highest wins. **+1 batch if tests are enabled (Q6)** — Small 4 / Medium-Large 5.

The number of batches is frozen after validation. No further modification possible.

## 4. Libraries

Any library outside the stack (charts, zod, electron-log…) is proposed and validated here — none can be added later without a declaration protocol.

## 5. Write the spec

Write `docs/specs/01-cadrage.md` (in French) capturing: objective, DB choice, persistent preferences, i18n, icon, tests (Q6), primary color (with hex values), validated libraries, and the frozen calibration (size + number of batches). If `docs/specs/` does not exist yet, create it (it will live in the generated project root).

→ Chain to `/phase2-analyse` after validation.

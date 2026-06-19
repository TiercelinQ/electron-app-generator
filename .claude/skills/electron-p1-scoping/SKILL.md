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
`docs/specs/01-scoping.md` (written in French) + on-screen summary.

---

## 1. Questions — single block

> If invoked directly (not routed from `/electron-app`) without a destination folder set for this flow, first ask: `Où créer l'application ? (chemin du dossier de destination)`.

Ask in French. Each closed question carries a `(recommandé)` answer:

Cadrage du projet :

1. Objectif de l'application — description libre.
2. Base de données : SQLite (better-sqlite3) / JSON / CSV / aucune ? (recommandé : SQLite si données structurées, sinon aucune)
3. Préférences persistantes entre sessions (thème, fenêtre…) ? Oui / Non (recommandé : Oui)
4. Internationalisation FR/EN activée pour ce projet ? Oui / Non — FR par défaut (recommandé : Non sauf besoin EN avéré)
5. Icône applicative : fichier .ico fourni ? Oui (chemin) / Non (recommandé : Non, défaut Electron, ajout possible plus tard)
6. Tests automatisés (Vitest + Testing Library) ? Oui / Non (recommandé : Oui pour usage pro)

## 2. Color palette

After receiving the answers, propose the **palette** (in French). A palette = 5 **light** roles (fond principal, fond secondaire, accent, texte, détails); the dark theme and all supporting tokens are derived (`design-system.md §2`).

Palette de couleurs pour ce projet (5 rôles, thème clair — le sombre est dérivé) :

A. Acier (par défaut) — fond #FFFFFF · 2nd #F9FAFB · accent #4682B4 · texte #111827 · détails #E5E7EB — professionnel, tech, sobre (recommandé)
B. Forêt — fond #FFFFFF · 2nd #F6F8F6 · accent #059669 · texte #14201A · détails #DCE5DF — naturel, calme, frais
C. Ardoise — fond #FFFFFF · 2nd #F8FAFC · accent #4F46E5 · texte #1E293B · détails #E2E8F0 — moderne, net, indigo
D. Ambre — fond #FFFDFB · 2nd #FBF6EF · accent #B45309 · texte #1C1917 · détails #ECE3D8 — chaleureux, artisanal
E. Rubis — fond #FFFFFF · 2nd #FAF7F7 · accent #BE123C · texte #1A1212 · détails #EAE0E1 — affirmé, élégant

F. Palette personnalisée — fournis 5 hex clairs : fond principal, fond secondaire, accent, texte, détails.

- Acier (default) is option A and the recommended default; B-E are the named palettes (canonical values — do not improvise them); F is the custom palette.
- From the 5 light roles, Claude **derives** and announces: supporting light tokens (`--bg-muted`, `--bg-elevated`, `--text-subtle`, `--text-muted`, `--border-subtle`, `--border-strong`), the 5 accent stops (`--primary-50/400/700/800/900`), `--text-on-primary`, and the **whole dark theme** (`[data-theme="dark"]`, lightness targets in `design-system.md §2`). Written to `tokens.css`. Semantic and icon tokens stay fixed.
- **Contrast check (WCAG AA, non-blocking)**: compute text/bg, text-subtle/bg, accent/bg, text-on-primary/accent; if a ratio fails AA, report it (`couleur — ratio — cible`) and ask the user to confirm or adjust before continuing.
- The global `design-system.md` stays unchanged. If A or no answer: default palette.

## 3. Calibration — announced at the end of Phase 1

Apply the CALIBRATION table in `CLAUDE.md` (canonical source): Small (< 10 files and ≤ 5 features) → 3 batches; Medium/Large (≥ 10 or > 5) → 4 batches; divergent criteria → the highest wins. **+1 batch if tests are enabled (Q6)** — Small 4 / Medium-Large 5.

The number of batches is frozen after validation. No further modification possible.

## 4. Libraries

Any library outside the stack (charts, zod, electron-log…) is proposed and validated here — none can be added later without a declaration protocol.

## 5. Write the spec

Write `docs/specs/01-scoping.md` (in French) capturing: objective, DB choice, persistent preferences, i18n, icon, tests (Q6), the **palette** (name or custom; the 5 light roles + the derived dark theme + accent stops + text-on-primary; semantic kept fixed) and the contrast-check result, validated libraries, and the frozen calibration (size + number of batches). If `docs/specs/` does not exist yet, create it (it will live in the generated project root).

→ Chain to `/electron-p2-featuring` after validation.

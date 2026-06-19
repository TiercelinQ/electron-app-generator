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
`docs/specs/01-scoping.md` (written in the user's language) + on-screen summary.

---

## 1. Questions — single block

> If invoked directly (not routed from `/electron-app`) without a destination folder set for this flow, first ask: `Where to create the application? (destination folder path)`.

Ask in the user's language. Each closed question carries a `(recommended)` answer:

Project scoping:

1. Application objective — free description.
2. Database: SQLite (better-sqlite3) / JSON / CSV / none? (recommended: SQLite if structured data, otherwise none)
3. Persistent preferences between sessions (theme, window…)? Yes / No (recommended: Yes)
4. FR/EN internationalization for this project? Yes / No — FR by default (recommended: No unless a real EN need)
5. Application icon: .ico file provided? Yes (path) / No (recommended: No, Electron default, can be added later)
6. Automated tests (Vitest + Testing Library)? Yes / No (recommended: Yes for professional use)

## 2. Color palette

After receiving the answers, propose the **palette** (in the user's language). A palette = 5 **light** roles (main background, secondary background, accent, text, details); the dark theme and all supporting tokens are derived (`design-system.md §2`).

Color palette for this project (5 roles, light theme — dark is derived):

A. Steel (default) — bg #FFFFFF · 2nd #F9FAFB · accent #4682B4 · text #111827 · details #E5E7EB — professional, tech, understated (recommended)
B. Forest — bg #FFFFFF · 2nd #F6F8F6 · accent #059669 · text #14201A · details #DCE5DF — natural, calm, fresh
C. Slate — bg #FFFFFF · 2nd #F8FAFC · accent #4F46E5 · text #1E293B · details #E2E8F0 — modern, crisp, indigo
D. Amber — bg #FFFDFB · 2nd #FBF6EF · accent #B45309 · text #1C1917 · details #ECE3D8 — warm, artisanal
E. Ruby — bg #FFFFFF · 2nd #FAF7F7 · accent #BE123C · text #1A1212 · details #EAE0E1 — bold, elegant

F. Custom palette — provide 5 light hex values: main background, secondary background, accent, text, details.

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

Write `docs/specs/01-scoping.md` (in the user's language) capturing: objective, DB choice, persistent preferences, i18n, icon, tests (Q6), the **palette** (name or custom; the 5 light roles + the derived dark theme + accent stops + text-on-primary; semantic kept fixed) and the contrast-check result, validated libraries, and the frozen calibration (size + number of batches). If `docs/specs/` does not exist yet, create it (it will live in the generated project root).

→ Chain to `/electron-p2-featuring` after validation.

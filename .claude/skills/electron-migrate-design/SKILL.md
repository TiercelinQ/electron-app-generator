---
name: electron-migrate-design
description: Convert an Electron app generated with design system v1.x to v2.0 — tokens (accent-tinted neutrals, derived semantics), icons (Font Awesome → Lucide), hover model, radius, signature underline — without changing any behavior. Proposed by /electron-load-project when a legacy app is detected; runs only on explicit validation.
model: sonnet
---

# /electron-migrate-design — Convert a v1.x app to design system v2.0

## Role
Migration engineer — re-skin a delivered app to the v2.0 design system with zero behavior change.

## Goal
The app renders under the full v2.0 visual language (tokens, icons, states, motion) while every feature, IPC channel, and business rule behaves exactly as before.

## Deliverable
The converted files on disk (tokens/styles, icon usages, dependency swap) + refreshed app `README.md` / `CLAUDE.md` / `docs/specs/04-architect.md` token table + passing verification + a conversion summary.

---

## Prerequisite

The project is loaded (`/electron-load-project`) and detected on design system **v1.x** (README reference; markers: `@fortawesome/fontawesome-free` in `package.json`, `--radius: 0px` in `tokens.css`). If the app is already on v2.0, say so and stop.

**Load context**: `design-system.md` (v2.0) + `layout.md` (v4.1) + `@rules/css.md` + `@rules/config.md` + `@rules/mvc.md` (cleanup protocol) + `@rules/splash.md` (if the app has a splash) + `@rules/verification.md`, and the app's `docs/specs/01-scoping.md` (original palette choice) + `docs/specs/04-architect.md` (locked contract).

## Step 1 — Inventory (read-only)

- `tokens.css`: current palette values, identify the accent (`--primary-600`).
- `docs/specs/01-scoping.md`: was the palette a **named preset** (Steel Blue, Teal…) or **custom** (5 explicit roles)?
- `styles.css`: hover rules, transitions, radius usages, tab styling, toast/drawer/modal rules.
- `package.json`: `@fortawesome/fontawesome-free` presence.
- Views (`Grep` for `fa-`): every Font Awesome icon usage, per file.
- Splash presence (`splash.html` / `splash.css` / `splash.ts` + the main-process `backgroundColor` literals in `src/main/index.ts`).
- The retained composition (`docs/specs/03-surfaces.md`): does it have tabs / horizontal navigation?

## Step 2 — Palette conversion decision

- **Preset palette** → re-derive **everything** from the accent per `design-system.md §2`: accent stops, accent-tinted neutrals (both themes), per-project semantic colors (info = accent). Full v2.0 atmosphere.
- **Custom palette** → the roles the user explicitly chose in Phase 1 (recorded in `01-scoping.md`) become **v2.0 overrides** (they win over the tinted targets); everything else derives from the accent.
- Announce the derived token set and run the **AA contrast check** (same pairs as `/electron-p1-scoping` §2), reporting failures without blocking.

## Step 3 — Conversion plan (validation gate)

Present the plan (in the user's language): files touched, the icon mapping table (below) instantiated with the icons actually found, the palette decision, and the note that **no behavior changes** (no IPC, model, controller, or i18n edit). **→ Validation required before writing.**

## Step 4 — Conversion (single batch, complete files)

1. **`tokens.css`** — full v2.0 token set written as literal hex: tinted neutrals (`:root` + `[data-theme="dark"]`), derived semantics (+ danger 700/800), `--radius: 5px`, `--ease-out` + retimed `--transition-default` (160ms) / `--transition-slow` (240ms), `--icon-*` switched to `var()` consumption, `--icon-stroke`, unchanged structural tokens carried over.
2. **`styles.css`** — v2.0 state model: neutral hover = border strengthening (transparent 1px borders added where needed so layout never shifts); `:active` = `--bg-muted`; tabs container gains the signature underline `::after`; toast enter/exit animations removed (motion policy); drawer/modal/menu-panel borders promoted to `--border-strong`; `border-radius` routed through `var(--radius)` (nested `calc(var(--radius) - 2px)`); scrollbar thumb rounded; comments updated to v2.0 token names.
3. **Icons** — `package.json`: remove `@fortawesome/fontawesome-free`, add `lucide-react` (pin per `@rules/config.md`); remove the `all.min.css` import from `main.tsx`; replace every `<i className="fa-...">` with the Lucide component (`size` from `--icon-*` classes kept, `strokeWidth={1.75}`, `aria-hidden="true"`).
4. **Underline** — only if the retained composition has tabs / horizontal navigation (the underline exists nowhere else, `design-system.md §8`): add the `placeUnderline` helper (reference implementation in §8) wired to the tab component on selection change and mount/resize. This is the only JS-positioned visual.
5. **Splash** (if the app has one) — `splash.css` follows automatically (it consumes `tokens.css`); update the main-process `backgroundColor` literals in `src/main/index.ts` to the new `--bg` values (light/dark), keeping the sourced-from-`--bg` comment (`@rules/splash.md`).
6. **Docs** — app `README.md`: design system reference → `v2.0` (+ layout `v4.1`), stack line Icons → Lucide; app `CLAUDE.md`: dated migration note under `## Deviations from the framework` (or a `## Design system migration` block); `docs/specs/04-architect.md`: refresh the tokens → CSS table values, append a dated migration note (this validated run is the contract amendment).
7. **Changelog** — append a `### Changed` entry under `## [Unreleased]` in `docs/release/CHANGELOG.md` (`@rules/versioning.md`): `- Migrated UI to design system v2.0.` (English, no version bump; migrate-design infers MINOR at `/electron-release`). If the file is absent (legacy app never initialized), skip silently and suggest `/electron-load-project`.

### Icon mapping — Font Awesome 6 → Lucide (`lucide-react`)

| FA 6 class | Lucide component | FA 6 class | Lucide component |
| ---------- | ---------------- | ---------- | ---------------- |
| `fa-house` | `House` | `fa-magnifying-glass` | `Search` |
| `fa-gear` | `Settings` | `fa-plus` | `Plus` |
| `fa-circle-check` | `CircleCheck` | `fa-trash` / `fa-trash-can` | `Trash2` |
| `fa-triangle-exclamation` | `TriangleAlert` | `fa-pen` / `fa-pencil` | `Pencil` |
| `fa-circle-exclamation` | `CircleAlert` (toasts: `CircleX`, `layout.md §5`) | `fa-floppy-disk` | `Save` |
| `fa-circle-xmark` | `CircleX` | `fa-xmark` | `X` |
| `fa-circle-info` | `Info` | `fa-bars` | `Menu` |
| `fa-sun` / `fa-moon` | `Sun` / `Moon` | `fa-user` | `User` |
| `fa-chevron-right` / `fa-chevron-down` | `ChevronRight` / `ChevronDown` | `fa-download` / `fa-upload` | `Download` / `Upload` |
| `fa-arrows-rotate` / `fa-rotate` | `RefreshCw` | `fa-spinner` | `LoaderCircle` |
| `fa-check` | `Check` | `fa-arrow-right-from-bracket` | `LogOut` |

Any icon not in this table: pick the closest Lucide equivalent, verify the import exists against the pinned `lucide-react` (typecheck is the guard), and list the chosen mapping in the conversion summary. Never invent a component name.

## Step 5 — Verification and summary

- Run `@rules/verification.md §A` in full (`npm install` → `typecheck` → `lint` → `build`; `npm test` if the project has tests) — a failure is blocking.
- Residual grep: `fa-`, `fortawesome`, `--radius: 0`, `150ms`, `250ms` must return nothing in `src/`; the old v1.x hex must be gone from `tokens.css`, `styles.css`, and `src/main/index.ts` (neutrals `#1C1C1C`, `#F9FAFB`, `#F3F4F6`, `#9CA3AF`, `#E5E7EB`, `#D1D5DB`, `#6B7280` and semantics `#16A34A`, `#D97706`, `#DC2626`, `#2563EB` — `#FFFFFF` legitimately survives as `--text-on-primary`/`--text-on-danger`).
- Manual visual pass by the user: state that colors, radius, hover, and the tab underline are the only intended visible changes — every feature must behave identically. Report the conversion summary (files, icon mappings, AA results).
- After an anomaly: cleanup protocol (`@rules/mvc.md`), then offer `/electron-save-memory`.

## Anti-patterns — what NOT to do

- **Do not** run without the Step 3 validation, and do not convert partially — the app is either fully v1.x or fully v2.0 (never a mix).
- **Do not** touch models, controllers, preload, IPC channels, i18n keys, or any business logic — this is a re-skin.
- **Do not** redesign the layout/composition — the retained Phase 3 composition stays; only its skin changes.
- **Do not** improvise a Lucide name — map it, verify it compiles, report it.
- **Do not** leave dead Font Awesome residue (dependency, CSS import, `fa-` classes, unused `--icon-*` hex).
- **Do not** convert the palette of a custom-palette app without preserving its explicitly chosen roles as overrides (Step 2).

## Integrity verification

Detailed in `@rules/verification.md`. Key points: §A executable suite green after conversion; zero `fa-`/`fortawesome` residue in `src/` and `package.json`; `tokens.css`/`styles.css` fully v2.0 (tinted neutrals, derived semantics, radius token, border-strengthening hover, underline); app README/CLAUDE.md/04-architect.md updated with the v2.0 reference and the dated migration note.

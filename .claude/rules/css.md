# CSS rules — tokens, themes, flat design

## Files

| File                                    | Role                                                            |
| --------------------------------------- | --------------------------------------------------------------- |
| `src/renderer/src/styles/tokens.css`    | All tokens — `:root` (light) + `[data-theme="dark"]`            |
| `src/renderer/src/styles/styles.css`    | All component rules — consumes only `var(--token)`              |

Imported once in `main.tsx`, in this order: `tokens.css` then `styles.css` then Font Awesome.

## Absolute rules

1. **Zero hardcoded visual value in TS/TSX** — zero inline `style={}`, zero literal color/size/duration in code. Only tolerated exception: values computed at runtime that cannot be CSS (e.g. position of an element following the mouse) — to be justified with a comment.
2. **`styles.css` contains no literal value** — only `var(--token)`. Any new value goes through a token in `tokens.css` first.
3. **Every rule carries a comment** indicating the source design-system token(s).
4. **Dark mode**: a single `[data-theme="dark"]` block in `tokens.css` redefining all themed tokens. `styles.css` contains **no** `[data-theme]` selector, no `@media (prefers-color-scheme)`.
5. **Strict flat design**: `border-radius: 0` everywhere, `box-shadow` forbidden, gradients forbidden, row alternation forbidden.
6. **Naming conventions**: kebab-case classes (`.btn-primary`, `.data-table`), states prefixed `is-`/`has-` (`.is-active`, `.has-error`). `id` reserved for the unique shell anchors (`#topbar`, `#main-content`, `#statusbar`, `#toast-container`, `#drawer`, `#app-shell`).
7. Zero CSS framework (Tailwind, Bootstrap…), zero CSS-in-JS, zero CSS Modules — centralized flat CSS only.
8. **`color-scheme` declared per theme** in `tokens.css` (`:root` light, `[data-theme="dark"]` dark) so native controls (scrollbars, `<select>`, `<progress>`, checkbox/radio, pickers) follow the theme. Custom flat styling on top for scrollbars and `<progress>` (see `styles.css` organization).
9. **No hardcoded `z-index`** — use the `--z-*` layering tokens (`design-system.md §13`). Overlays (`#toast-container`, drawer/modal overlays) read them.
10. **`@media (prefers-reduced-motion: reduce)`** present in `styles.css` to neutralize transitions/animations. This is the only allowed `@media` there — `prefers-color-scheme` stays forbidden (theming is `data-theme`).

## Theme toggle

```ts
// hooks/useTheme.ts — principle
document.documentElement.dataset.theme = theme; // "light" → absent attribute or "light", "dark"
await window.api.savePreference("theme", theme);
```

- Initial theme: persisted preference, otherwise OS theme (sent by the main via IPC at init).
- Font Awesome icons follow automatically (colors via tokens) — no action.

## Internal organization of `tokens.css`

```css
/* ============================================================
   tokens.css — [APP_NAME] v[VERSION]
   Reference: design-system.md v1.6 (Electron) — project palette
   ============================================================ */

:root {
  color-scheme: light;             /* native controls follow the theme */
  /* --- TYPOGRAPHY (+ line-height) --- */
  /* --- COLORS — light mode --- */
  /* --- PRIMARY (project: [color chosen in Phase 1]) — 50/400/600/700/800/900 + usage tokens --- */
  /* --- SEMANTIC (incl. danger-700/800) --- */
  /* --- ICONS --- */
  /* --- SPACING --- */
  /* --- FIXED SIZES --- */
  /* --- SHAPE / BORDER-WIDTH / OPACITY --- */
  /* --- TRANSITIONS --- */
  /* --- Z-INDEX (layering scale) --- */
  /* --- SELECTION / TEXT-ON-PRIMARY / TEXT-ON-DANGER --- */
}

[data-theme="dark"] {
  color-scheme: dark;
  /* --- COLORS — dark mode (full redefinition of themed tokens,
         including semantic *-50 surfaces and --primary / --primary-bg) --- */
}
```

## Internal organization of `styles.css`

```css
/* ============================================================
   styles.css — [APP_NAME] v[VERSION]
   Reference: design-system.md v1.6 (Electron) · layout.md v2.1
   ============================================================ */

/* --- BASE ----------------------------------------------- */
/* token: bg / text / font-family */
body { ... }

/* --- SHELL ----------------------------------------------- */
#app-shell { ... }

/* --- TOPBAR ----------------------------------------------- */
/* token: bg / border / topbar-height */
#topbar { ... }

/* --- TABS ----------------------------------------------- */
.tab { ... }
.tab:hover { ... }
.tab.is-active { ... }

/* --- MAIN CONTENT -------------------------------------- */
#main-content { ... }

/* --- TOAST --------------------------------------------------- */
.toast { ... }
.toast-success { ... }
.toast-danger { ... }

/* --- DRAWER -------------------------------------------------- */
/* --- MODAL -------------------------------------------------- */

/* --- COMPONENTS ----------------------------------------------- */
/* Buttons */
.btn { ... }
.btn-primary { ... }
.btn-secondary { ... }
.btn-danger { ... }
.btn-ghost { ... }

/* Input fields */
.field input, .field select { ... }

/* Tables */
.data-table { ... }
.data-table thead th { ... }

/* Pagination */

/* --- STATUSBAR ------------------------------------------------ */
#statusbar { ... }

/* --- FOCUS ------------------------------------------------------ */
/* token: focus-ring / primary */
:focus-visible { outline: var(--border-width-emphasis) solid var(--primary); outline-offset: 2px; }

/* --- SELECTION ------------------------------------------------- */
/* token: selection-bg / selection-text */
::selection { background: var(--selection-bg); color: var(--selection-text); }

/* --- SCROLLBARS (flat, Chromium) ------------------------------- */
/* token: bg-muted / border-strong */
::-webkit-scrollbar { width: 12px; height: 12px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--bg-muted); border: none; }      /* radius 0 */
::-webkit-scrollbar-thumb:hover { background: var(--border-strong); }
/* color-scheme (tokens.css) already themes native scrollbars as a fallback */

/* --- NATIVE PROGRESS ------------------------------------------- */
/* token: bg-muted / primary — statusbar <progress> (8px) */
progress { appearance: none; height: 8px; border: none; background: var(--bg-muted); }
progress::-webkit-progress-bar { background: var(--bg-muted); }
progress::-webkit-progress-value { background: var(--primary); }

/* --- TOOLTIP --------------------------------------------------- */
/* token: text (inverted bg) / bg / border / spacing-2 / font-xs
   Replaces the native title tooltip where flat styling matters. */
.tooltip { background: var(--text); color: var(--bg); border: var(--border-width) solid var(--border);
           padding: var(--spacing-1) var(--spacing-2); font-size: var(--font-xs); }

/* --- REDUCED MOTION -------------------------------------------- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}
```

## Per-project palette

In Phase 1 the project picks a **palette** (named or custom) = 5 light roles: fond principal → `--bg`, fond secondaire → `--bg-subtle`, accent → `--primary-600`, texte → `--text`, détails → `--border`. Claude derives the supporting neutrals, the accent stops, `--text-on-primary`, and the **whole dark theme** (`design-system.md §2`), then writes the resolved hex into `tokens.css`: the neutrals in `:root` and the full `[data-theme="dark"]` block, the accent in the 6 `--primary-*` stops (the usage tokens `--primary`, `--primary-bg`, `--primary-hover`, `--primary-pressed` reference them and stay unchanged). The default palette is what the global `design-system.md` documents — a custom palette replaces these values in `tokens.css` only; `design-system.md` stays unchanged. Semantic and icon tokens stay fixed across palettes.

## Anti-patterns — what NOT to do

- **Do not** write an inline `style={{ ... }}` in TSX. Every styled element gets a `className` and a named rule.
- **Do not** write a literal color/size/duration in `styles.css` — only `var(--token)`. New value → token first.
- **Do not** add a `[data-theme]` selector or a `@media (prefers-color-scheme)` in `styles.css` — dark mode lives in the single `[data-theme="dark"]` block of `tokens.css`.
- **Do not** add `border-radius > 0`, `box-shadow`, a gradient, or row alternation — flat design is global.
- **Do not** introduce a CSS framework, CSS-in-JS, or CSS Modules.
- **Do not** use an `id` for styling beyond the shell anchors — use a `className`.
- **Do not** duplicate a token value as a magic number in TS — read the CSS variable / token.
- **Do not** ship dark mode without `color-scheme` — native controls (scrollbars, `<select>`, `<progress>`) would stay light.
- **Do not** hardcode a `z-index` — use the `--z-*` tokens.
- **Do not** rely on the native `title` tooltip where flat styling is required — use the `.tooltip` rule.

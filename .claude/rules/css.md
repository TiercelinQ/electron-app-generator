# CSS rules — tokens, themes, depth by stroke

## Files

| File                                    | Role                                                            |
| --------------------------------------- | --------------------------------------------------------------- |
| `src/renderer/src/styles/tokens.css`    | All tokens — `:root` (light) + `[data-theme="dark"]`            |
| `src/renderer/src/styles/styles.css`    | All component rules — consumes only `var(--token)`              |
| `src/renderer/src/styles/splash.css`    | Splash rules (if splash enabled) — consumes only `var(--token)`, linked by `splash.html` — @rules/splash.md |

Imported once in `main.tsx`, in this order: `tokens.css` then `styles.css`. Icons are **`lucide-react` component imports** in the views (tree-shaken, no global stylesheet — `design-system.md §10`). `splash.html` links `tokens.css` then `splash.css` (its own entry, not imported by `main.tsx`).

## Absolute rules

1. **Zero hardcoded visual value in TS/TSX** — zero inline `style={}`, zero literal color/size/duration in code. Two tolerated exceptions: values computed at runtime that cannot be CSS (e.g. position of an element following the mouse), justified with a comment; and the **signature underline** (`design-system.md §8`) — JS writes the two CSS variables `--underline-x` / `--underline-w` on the tabs container, nothing else.
2. **`styles.css` contains no literal value** — only `var(--token)`. Any new value goes through a token in `tokens.css` first.
3. **Every rule carries a comment** indicating the source design-system token(s).
4. **Dark mode**: a single `[data-theme="dark"]` block in `tokens.css` redefining all themed tokens. `styles.css` contains **no** `[data-theme]` selector, no `@media (prefers-color-scheme)`.
5. **Depth by stroke**: `border-radius` only via `var(--radius)` (5px) or the nested `calc(var(--radius) - 2px)` — never a literal; `box-shadow` forbidden, gradients forbidden, row alternation forbidden. Floating layers detach with `--border-strong`, never a shadow (`design-system.md §5`).
6. **Naming conventions**: kebab-case classes (`.btn-primary`, `.data-table`), states prefixed `is-`/`has-` (`.is-active`, `.has-error`). `id` reserved for the unique shell anchors of the **retained composition** (default pattern: `#topbar`, `#main-content`, `#statusbar`, `#toast-container`, `#drawer`, `#app-shell`; alternative patterns add theirs — `layout.md` §12).
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
- Lucide icons follow automatically (`stroke: currentColor` + `--icon-*` tokens) — no action.

## Internal organization of `tokens.css`

```css
/* ============================================================
   tokens.css — [APP_NAME] v[VERSION]
   Reference: design-system.md v2.0 (Electron) — project palette
   ============================================================ */

:root {
  color-scheme: light;             /* native controls follow the theme */
  /* --- TYPOGRAPHY (+ line-height) --- */
  /* --- COLORS — light mode (accent-tinted neutrals, design-system.md §2) --- */
  /* --- PRIMARY (project accent chosen in Phase 1) — 50/400/600/700/800/900 + usage tokens --- */
  /* --- SEMANTIC (derived per project, incl. danger-700/800) --- */
  /* --- ICONS (consume semantic/primary tokens via var()) --- */
  /* --- SPACING --- */
  /* --- FIXED SIZES --- */
  /* --- SHAPE / BORDER-WIDTH / OPACITY --- */
  /* --- TRANSITIONS (--ease-out + durations) --- */
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
   Reference: design-system.md v2.0 (Electron) · layout.md v4.1
   ============================================================ */

/* --- BASE ----------------------------------------------- */
/* token: bg / text / font-family */
body { ... }

/* --- SHELL ----------------------------------------------- */
#app-shell { ... }

/* --- TOPBAR ----------------------------------------------- */
/* sections mirror the retained composition (layout.md §12) */
/* token: bg / border / topbar-height */
#topbar { ... }

/* --- TABS ----------------------------------------------- */
/* container carries the signature underline ::after — design-system.md §8
   (JS writes --underline-x / --underline-w, the only JS-positioned visual) */
.tabs { ... }
.tabs::after { ... }
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
.data-table thead th.is-sortable { ... }   /* clickable sort header: cursor pointer + ChevronUp/ChevronDown indicator on the active column (layout.md §8) */

/* Pagination */

/* --- STATUSBAR ------------------------------------------------ */
#statusbar { ... }

/* --- FOCUS ------------------------------------------------------ */
/* token: focus-ring / primary */
:focus-visible { outline: var(--border-width-emphasis) solid var(--primary); outline-offset: 2px; }

/* --- SELECTION ------------------------------------------------- */
/* token: selection-bg / selection-text */
::selection { background: var(--selection-bg); color: var(--selection-text); }

/* --- SCROLLBARS (Chromium) ------------------------------------- */
/* token: bg-muted / border-strong / radius */
::-webkit-scrollbar { width: 12px; height: 12px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--bg-muted); border: none; border-radius: var(--radius); }
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
/* covers ::after too — the signature underline snaps (design-system.md §8/§12) */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}
```

## Per-project palette

In Phase 1 the project picks a **palette** (named or custom): the accent is mandatory (→ `--primary-600`), the four other roles are optional overrides (fond principal → `--bg`, fond secondaire → `--bg-subtle`, texte → `--text`, détails → `--border`). Claude derives everything else (`design-system.md §2`): the accent stops, `--text-on-primary`, the **accent-tinted neutrals** for both themes, and the **per-project semantic colors** (hue anchors harmonized ±6° toward the accent; info = accent), then writes the resolved hex into `tokens.css`: the neutrals in `:root` and the full `[data-theme="dark"]` block, the accent in the 6 `--primary-*` stops (the usage tokens `--primary`, `--primary-bg`, `--primary-hover`, `--primary-pressed` reference them and stay unchanged), the semantics in the `--*-50/600` (+ danger 700/800) tokens. An explicit override wins over the tinted target for its token; its supporting tokens derive from it. The default palette is what the global `design-system.md` documents — a custom palette replaces these values in `tokens.css` only; `design-system.md` stays unchanged. The `--icon-*` tokens consume the derived tokens via `var()` and never need per-palette values.

## Anti-patterns — what NOT to do

- **Do not** write an inline `style={{ ... }}` in TSX. Every styled element gets a `className` and a named rule.
- **Do not** write a literal color/size/duration in `styles.css` — only `var(--token)`. New value → token first.
- **Do not** add a `[data-theme]` selector or a `@media (prefers-color-scheme)` in `styles.css` — dark mode lives in the single `[data-theme="dark"]` block of `tokens.css`.
- **Do not** write a literal `border-radius` — always `var(--radius)` (or the nested `calc(var(--radius) - 2px)`). `box-shadow`, gradients, and row alternation stay forbidden — depth is stroke-based (`design-system.md §5`).
- **Do not** introduce a CSS framework, CSS-in-JS, or CSS Modules.
- **Do not** use an `id` for styling beyond the shell anchors — use a `className`.
- **Do not** duplicate a token value as a magic number in TS — read the CSS variable / token.
- **Do not** ship dark mode without `color-scheme` — native controls (scrollbars, `<select>`, `<progress>`) would stay light.
- **Do not** hardcode a `z-index` — use the `--z-*` tokens.
- **Do not** rely on the native `title` tooltip where flat styling is required — use the `.tooltip` rule.

## Integrity verification

Detailed in `@rules/verification.md`. Key points: zero hardcoded visual value in TS/TSX and zero inline `style={}` (the only JS-written visuals are `--underline-x`/`--underline-w` on the tabs container); `styles.css` consumes only `var(--token)` (no literal value, no `[data-theme]` selector, no `prefers-color-scheme`); dark mode confined to the single `[data-theme="dark"]` block of `tokens.css`, with `color-scheme` declared per theme; stroke-based depth held (radius only via `var(--radius)`, no `box-shadow`, no gradient); no CSS framework / CSS-in-JS / CSS Modules; `z-index` read from the `--z-*` tokens.

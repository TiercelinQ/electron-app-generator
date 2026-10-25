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
10. **`@media (prefers-reduced-motion: reduce)`** present in `styles.css`, in its single universal form (`design-system.md §11`, rule 6): `*, *::before, *::after { transition: none !important; animation: none !important; scroll-behavior: auto !important; }`, no per-class list. **`@media (forced-colors: active)`** is the only other allowed `@media` there: system colors only (`Highlight`, `HighlightText`, `GrayText`, `forced-color-adjust: none` on the selected states listed in `design-system.md §12`); these system-color keywords are not literal values. `prefers-color-scheme` stays forbidden (theming is `data-theme`).
11. **Focus floor**: `:where(:focus-visible)` in `styles.css` draws the `--focus-ring` on any focusable element (zero specificity, component rules win); `outline: none` is forbidden without a replacement; components touching a clipping container draw the ring inset (`design-system.md §7`).
12. **No state by color alone**: a selected item carries the 2px `--primary` bar (bottom edge for pagination, the signature underline for tabs); a status color is paired with a word or an icon (`design-system.md §8`, §12).

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
   Reference: design-system.md v2.1 (Electron) — project palette
   ============================================================ */

:root {
  color-scheme: light;             /* native controls follow the theme */
  /* --- TYPOGRAPHY (+ line-height; font sizes in rem) --- */
  /* --- COLORS — light mode (accent-tinted neutrals and surface ladder N0-N3: bg, bg-subtle, bg-muted, bg-elevated, bg-panel — design-system.md §2) --- */
  /* --- PRIMARY (project accent chosen in Phase 1) — 50/400/600/700/800/900 + usage tokens; 600 is the AA-darkened accent --- */
  /* --- SEMANTIC (derived per project, incl. danger-fill and danger-700/800) --- */
  /* --- ICONS (consume semantic/primary tokens via var()) --- */
  /* --- SPACING --- */
  /* --- FIXED SIZES (incl. toast-width, modal-min-width, sidebar-width, master-width, menubar-height, menu-min-width) --- */
  /* --- SHELL OFFSETS (--shell-menubar / --shell-topbar / --shell-statusbar start at 0px, --shell-offset-top) --- */
  /* --- SHAPE / BORDER-WIDTH / OPACITY --- */
  /* --- TRANSITIONS (--ease-out + --duration-* + --transition-* shorthands) --- */
  /* --- FOCUS (--focus-ring, --focus-space) --- */
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
   Reference: design-system.md v2.1 (Electron) · layout.md v4.2
   ============================================================ */

/* --- BASE ----------------------------------------------- */
/* token: bg / text / font-family */
body { ... }

/* --- SHELL ----------------------------------------------- */
#app-shell { ... }
/* token: menubar-height / topbar-height / statusbar-height - design-system.md §4 (fixed layers stay between the mounted bars) */
:root:has(.menubar)   { --shell-menubar: var(--menubar-height); }
:root:has(.topbar)    { --shell-topbar: var(--topbar-height); }
:root:has(.statusbar) { --shell-statusbar: var(--statusbar-height); }

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
/* token: border-width-emphasis / primary - floor for any focusable element, zero specificity so component rules win (design-system.md §7) */
:where(:focus-visible) { outline: var(--border-width-emphasis) solid var(--primary); outline-offset: var(--border-width-emphasis); }
/* components touching a clipping container (tabs, vertical nav items, tree rows) draw the ring inset:
   outline-offset: calc(var(--border-width-emphasis) * -1) */

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
/* covers ::after too — the signature underline snaps (design-system.md §8/§11/§12) */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; animation: none !important; scroll-behavior: auto !important; }
}

/* --- FORCED COLORS --------------------------------------------- */
/* system colors only (design-system.md §12): selected states (tab underline, .nav-item.is-active, .page-btn.is-active,
   .tree-item.is-selected, .master-item.is-selected, selected table row) -> Highlight / HighlightText with
   forced-color-adjust: none; disabled menu items -> GrayText */
@media (forced-colors: active) { ... }
```

## Per-project palette

In Phase 1 the project picks a **palette** (named or custom): the accent is mandatory (→ `--primary-600`), the four other roles are optional overrides (fond principal → `--bg`, fond secondaire → `--bg-subtle`, texte → `--text`, détails → `--border`). Claude derives everything else (`design-system.md §2`): the accent stops (with `--primary-600` darkened until white text, text on `--bg` and text on `--primary-50` reach 4.5:1; `-700`/`-800` are `--primary-600` minus 3 and 6 points of lightness), `--text-on-primary`, the **accent-tinted neutrals** for both themes (surface ladder, including `--bg-panel`), and the **per-project semantic colors** (hue anchors harmonized ±6° toward the accent; info = accent; `--danger-fill` = light `--danger-600`), then writes the resolved hex into `tokens.css`: the neutrals in `:root` and the full `[data-theme="dark"]` block, the accent in the 6 `--primary-*` stops (the usage tokens `--primary`, `--primary-bg`, `--primary-hover`, `--primary-pressed` reference them and stay unchanged), the semantics in the `--*-50/600` (+ `--danger-fill`, danger 700/800) tokens. An explicit override wins over the tinted target for its token; its supporting tokens derive from it. The default palette is what the global `design-system.md` documents — a custom palette replaces these values in `tokens.css` only; `design-system.md` stays unchanged. The `--icon-*` tokens consume the derived tokens via `var()` and never need per-palette values.

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
- **Do not** write `outline: none` without a replacement, and do not signal a selected or status state by color alone (2px `--primary` bar, word or icon).
- **Do not** put a topbar, menu bar or footer on `--bg`: chrome sits on `--bg-subtle`, a floating layer on `--bg-elevated` (surface ladder, `design-system.md §2`).
- **Do not** rely on the native `title` tooltip where flat styling is required — use the `.tooltip` rule.

## Integrity verification

Detailed in `@rules/verification.md`. Key points: zero hardcoded visual value in TS/TSX and zero inline `style={}` (the only JS-written visuals are `--underline-x`/`--underline-w` on the tabs container); `styles.css` consumes only `var(--token)` (no literal value, no `[data-theme]` selector, no `prefers-color-scheme`); dark mode confined to the single `[data-theme="dark"]` block of `tokens.css`, with `color-scheme` declared per theme; stroke-based depth held (radius only via `var(--radius)`, no `box-shadow`, no gradient); no CSS framework / CSS-in-JS / CSS Modules; `z-index` read from the `--z-*` tokens; focus floor `:where(:focus-visible)` present and no bare `outline: none`; the two allowed `@media` blocks present (universal `prefers-reduced-motion`, `forced-colors`); surface ladder respected (chrome on `--bg-subtle`, floating layers on `--bg-elevated`); no selected or status state carried by color alone.

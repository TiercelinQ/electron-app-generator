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
   Reference: design-system.md v1.0 (Electron)
   ============================================================ */

:root {
  /* --- TYPOGRAPHY --- */
  /* --- COLORS — light mode --- */
  /* --- PRIMARY (project: [color chosen in Phase 1]) --- */
  /* --- SEMANTIC --- */
  /* --- ICONS --- */
  /* --- SPACING --- */
  /* --- FIXED SIZES --- */
  /* --- TRANSITIONS --- */
}

[data-theme="dark"] {
  /* --- COLORS — dark mode (full redefinition of themed tokens) --- */
}
```

## Internal organization of `styles.css`

```css
/* ============================================================
   styles.css — [APP_NAME] v[VERSION]
   Reference: design-system.md v1.0 (Electron) · layout.md v2.0
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
:focus-visible { ... }
```

## Per-project primary color

If a color was chosen in Phase 1 (≠ Slate Blue): only the 4 `--primary-50/400/600/900` values change in the project's `tokens.css`. The global `design-system.md` stays unchanged.

## Anti-patterns — what NOT to do

- **Do not** write an inline `style={{ ... }}` in TSX. Every styled element gets a `className` and a named rule.
- **Do not** write a literal color/size/duration in `styles.css` — only `var(--token)`. New value → token first.
- **Do not** add a `[data-theme]` selector or a `@media (prefers-color-scheme)` in `styles.css` — dark mode lives in the single `[data-theme="dark"]` block of `tokens.css`.
- **Do not** add `border-radius > 0`, `box-shadow`, a gradient, or row alternation — flat design is global.
- **Do not** introduce a CSS framework, CSS-in-JS, or CSS Modules.
- **Do not** use an `id` for styling beyond the shell anchors — use a `className`.
- **Do not** duplicate a token value as a magic number in TS — read the CSS variable / token.

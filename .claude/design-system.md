# Design System — v1.1 (Electron)

> Binding reference for all Node.js/Electron/React applications.
> Use: Windows desktop applications, personal and professional use.
> Inseparable from `layout.md`.
> All tokens are **CSS custom properties** declared in `src/renderer/src/styles/tokens.css`.

## Changelog

| Version | Date       | Main change                                                                                       |
| ------- | ---------- | ------------------------------------------------------------------------------------------------- |
| v1.1    | 2026-06-14 | line-height · dark semantic backgrounds · primary/danger hover-pressed stops · `color-scheme` · WCAG AA target · layering scale · dark surface ramp fix · icon warning/info · selection/opacity/border-width tokens |
| v1.0    | initial    | CSS custom properties port: typography, colors, spacing, components, states                        |

> Aligns with the Python generator `design-system.md v1.2` (shared palette). Per-file versions: CSS rules in `rules/css.md`, layout in `layout.md`.

Every generated application references the active version in its `README.md`.

---

## 1. TYPOGRAPHY

| Token              | Value    | Usage                         |
| ------------------ | -------- | ----------------------------- |
| `--font-family`    | Segoe UI | All applications              |
| `--font-xs`        | 12px     | Statusbar, secondary labels   |
| `--font-sm`        | 14px     | Labels, subtitles, body       |
| `--font-base`      | 16px     | Primary text, navigation      |
| `--font-lg`        | 18px     | Secondary section titles      |
| `--font-xl`        | 20px     | Intermediate titles           |
| `--font-2xl`       | 24px     | Primary section titles        |
| `--weight-normal`  | 400      | Body, descriptions            |
| `--weight-medium`  | 500      | Labels, navigation items      |
| `--weight-semibold`| 600      | Titles, headers               |
| `--weight-bold`    | 700      | Primary titles                |

```css
/* tokens.css */
:root {
  --font-family: "Segoe UI", system-ui, sans-serif;
}
```

### Line-height

| Token              | Value | Usage                             |
| ------------------ | ----- | --------------------------------- |
| `--leading-tight`  | 1.25  | Titles (`--font-lg`, `--font-2xl`) |
| `--leading-normal` | 1.5   | Body, labels                      |

---

## 2. COLORS

### Light mode (`:root`)

| Token             | Value   | Usage                          |
| ----------------- | ------- | ------------------------------ |
| `--bg`            | #FFFFFF | Main background, topbar        |
| `--bg-subtle`     | #F9FAFB | Topbar background, secondary areas |
| `--bg-muted`      | #F3F4F6 | Statusbar, hover, alternation  |
| `--bg-elevated`   | #FFFFFF | Drawer, modals                 |
| `--text`          | #111827 | Primary text                   |
| `--text-subtle`   | #6B7280 | Secondary text, subtitles      |
| `--text-muted`    | #9CA3AF | Disabled text, statusbar       |
| `--border`        | #E5E7EB | Standard borders               |
| `--border-subtle` | #F3F4F6 | Discreet separators            |
| `--border-strong` | #D1D5DB | Table headers                  |

### Dark mode (`[data-theme="dark"]`)

| Token             | Value   | Usage                  |
| ----------------- | ------- | ---------------------- |
| `--bg`            | #111827 | Main background, topbar |
| `--bg-subtle`     | #1F2937 | Secondary areas        |
| `--bg-elevated`   | #1F2937 | Drawer, modals         |
| `--bg-muted`      | #374151 | Statusbar, hover       |
| `--text`          | #F9FAFB | Primary text           |
| `--text-subtle`   | #9CA3AF | Secondary text         |
| `--text-muted`    | #6B7280 | Disabled text          |
| `--border`        | #374151 | Standard borders       |
| `--border-subtle` | #1F2937 | Discreet separators    |
| `--border-strong` | #4B5563 | Table headers          |

> Dark surface ramp: `--bg` #111827 < {`--bg-subtle`, `--bg-elevated`} #1F2937 < `--bg-muted` #374151. `--bg-muted` is the lightest so that hover stays visible on every surface, including inside drawers and modals.

### Native color scheme

Declare `color-scheme` per theme so native controls (scrollbars, `<select>`, `<progress>`, checkbox/radio, native focus rings, date pickers) follow the theme. Without it, dark mode breaks on native widgets.

```css
:root                { color-scheme: light; }
[data-theme="dark"]  { color-scheme: dark; }
```

### Primary color — Slate Blue

| Token           | Light   | Dark    | Usage                               |
| --------------- | ------- | ------- | ----------------------------------- |
| `--primary-50`  | #EEF2FF | —       | Selection / active bg (light)       |
| `--primary-400` | —       | #818CF8 | Active text/border (dark)           |
| `--primary-600` | #4F46E5 | —       | Active text/border, primary btn (light) |
| `--primary-700` | #4338CA | #4338CA | Primary button hover (both modes)   |
| `--primary-800` | #3730A3 | #3730A3 | Primary button pressed (both modes) |
| `--primary-900` | —       | #312E81 | Selection / active bg (dark)        |

> Modification: replacing `--primary-50/400/600/700/800/900` in `tokens.css` is enough to change the primary color across the whole application. The 6 stops derive from `--primary-600` by the same HSL rule used by the Python generator (same H/S, lightness varies: 95/70/—/50/42/25%). `--primary-700`/`--primary-800` are mode-agnostic (one value each).

Implementation: derived usage tokens, redefined per theme (or fixed) — these are the ones `styles.css` consumes.

```css
:root                { --primary: var(--primary-600); --primary-bg: var(--primary-50);
                       --primary-hover: var(--primary-700); --primary-pressed: var(--primary-800); }
[data-theme="dark"]  { --primary: var(--primary-400); --primary-bg: var(--primary-900); }
```

### Semantic colors

| Token             | Light   | Dark    | Usage                  |
| ----------------- | ------- | ------- | ---------------------- |
| `--success-50`    | #F0FDF4 | #14532D | Success toast bg       |
| `--success-600`   | #16A34A | #4ADE80 | Success border, icon   |
| `--warning-50`    | #FFFBEB | #78350F | Warning toast bg       |
| `--warning-600`   | #D97706 | #FCD34D | Warning border, icon   |
| `--danger-50`     | #FFF1F2 | #7F1D1D | Danger toast bg        |
| `--danger-600`    | #DC2626 | #F87171 | Danger border, icon    |
| `--danger-700`    | #B91C1C | #B91C1C | Danger button hover    |
| `--danger-800`    | #991B1B | #991B1B | Danger button pressed  |
| `--info-50`       | #EFF6FF | #1E3A8A | Info toast bg          |
| `--info-600`      | #2563EB | #60A5FA | Info border, icon      |

> Naming note: `--*-50` is a **role** ("semantic surface / toast background"), not a fixed luminance level. Light = pale tint, Dark = deep tint of the same hue, redefined in the `[data-theme="dark"]` block. Without the dark redefinition the `var()` keeps the light value and the toast breaks in dark mode. Toast message text uses `--text`; border/icon use `--*-600`.

### Charts / visualization palette

| Token             | Value                    |
| ----------------- | ------------------------ |
| `--chart-primary` | `var(--primary)`         |
| `--chart-success` | `var(--success-600)`     |
| `--chart-warning` | `var(--warning-600)`     |
| `--chart-danger`  | `var(--danger-600)`      |
| `--chart-info`    | `var(--info-600)`        |

> The `--chart-*` tokens consume the semantic colors via `var()` — they automatically follow dark mode with no redefinition. Since `--*-600` already carry dark values, charts stay legible in both themes.

### Text selection & on-primary

| Token                | Light                | Dark                  | Usage                          |
| -------------------- | -------------------- | --------------------- | ------------------------------ |
| `--selection-bg`     | `var(--primary-bg)`  | `var(--primary-bg)`   | Selected text background       |
| `--selection-text`   | `var(--text)`        | `var(--text)`         | Selected text color            |
| `--text-on-primary`  | #FFFFFF              | #FFFFFF               | Text on Primary / Danger buttons |

```css
::selection { background: var(--selection-bg); color: var(--selection-text); }
```

> `--text-on-primary` replaces the literal `#FFFFFF` in button rules, keeping `styles.css` free of literal values (`rules/css.md` rule 2).

---

## 3. SPACING

| Token         | Value | Usage                          |
| ------------- | ----- | ------------------------------ |
| `--spacing-1` | 4px   | Micro-spacing                  |
| `--spacing-2` | 8px   | Compact inner padding          |
| `--spacing-3` | 12px  | Standard padding               |
| `--spacing-4` | 16px  | Inter-element spacing          |
| `--spacing-5` | 20px  | Intermediate spacing           |
| `--spacing-6` | 24px  | Main content padding           |
| `--spacing-7` | 28px  | Wide intermediate spacing      |
| `--spacing-8` | 32px  | Major separation               |

---

## 4. COMPONENT SIZES

### Fixed sizes (global visual anchors)

| Token                 | Value  | Usage                      |
| --------------------- | ------ | -------------------------- |
| `--topbar-height`     | 48px   | Topbar height              |
| `--statusbar-height`  | 28px   | Statusbar height           |
| `--drawer-width`      | 320px  | Right drawer width         |
| `--content-xl`        | 1024px | Max centered content width |
| `--icon-sm`           | 16px   | Small icon                 |
| `--icon-md`           | 20px   | Standard icon              |
| `--icon-lg`           | 24px   | Navigation / topbar icon   |

### Dynamic sizes — general principle

**Rule**: no component has a fixed height or width except the documented exceptions above. Dimensions result from content + padding. Zero hardcoded `width`/`height` in CSS outside the fixed tokens.

| Component         | Width                                    | Height                     | Exception                                     |
| ----------------- | ---------------------------------------- | -------------------------- | --------------------------------------------- |
| Button            | content + horizontal padding             | content + vertical padding | aligned group: unified on the widest          |
| Input field       | stretches in its container (`width: 100%`)| content + vertical padding | —                                             |
| Table column      | content (`table-layout: auto`)           | —                          | actions column: fixed                         |
| Topbar tab        | label + horizontal padding               | `--topbar-height`          | —                                             |
| Label             | content, wrap if constrained             | content                    | —                                             |
| Dropdown menu     | longest item                             | content                    | —                                             |
| Dialog / modal    | content                                  | content                    | `min-width` 480px (see `layout.md` §8)        |
| Tree item         | content + indentation                    | vertical padding           | —                                             |
| Toast             | —                                        | multi-line content         | fixed width 320px                             |

---

## 5. SHAPE, SHADOWS, BORDERS, OPACITY

| Token      | Value                     |
| ---------- | ------------------------- |
| `--radius` | 0px, strict flat design   |
| shadows    | none, strict flat design  |

`box-shadow` forbidden. `border-radius: 0` everywhere.

### Border widths

| Token                     | Value | Usage                                        |
| ------------------------- | ----- | -------------------------------------------- |
| `--border-width`          | 1px   | Standard borders, separators                 |
| `--border-width-emphasis` | 2px   | Focus, active tab underline, field-in-error  |
| `--border-width-accent`   | 4px   | Toast left accent                            |

### Opacity

| Token                | Value | Usage                                  |
| -------------------- | ----- | -------------------------------------- |
| `--opacity-disabled` | 0.4   | Disabled interactive elements          |
| `--opacity-overlay`  | 0.4   | Modal / drawer overlay (`--text` color) |

---

## 6. TRANSITIONS

| Token                  | Value      | Usage                   |
| ---------------------- | ---------- | ----------------------- |
| `--transition-default` | 150ms ease | hover, focus states     |
| `--transition-slow`    | 250ms ease | Panels, drawer, tabs     |

---

## 7. FOCUS

| Token          | Value                                      |
| -------------- | ------------------------------------------- |
| `--focus-ring` | 2px solid `var(--primary)`, offset 2px      |

```css
:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
```

---

## 8. INTERACTIVE COMPONENT STATES

Applies to **transparent-background interactive elements**: tabs, list/table/tree items, pagination buttons, `.btn-secondary`, `.btn-ghost`. Colored-background buttons (`.btn-primary`, `.btn-danger`) follow their own hover/pressed rules in §9, because turning their background gray on hover would drop the semantic color.

| State              | Rule                                                                            |
| ------------------ | ------------------------------------------------------------------------------- |
| `default`          | Base style defined by the component                                             |
| `:hover`           | `--bg-muted` background, `--transition-default` transition                      |
| `:active`          | `--bg-muted` background (same as hover for neutral elements)                    |
| `.is-active` (selected) | `--primary-bg` background, `--primary` text                                |
| `:disabled` / `.is-disabled` | `var(--opacity-disabled)` (0.4), `pointer-events: none`             |
| `:focus-visible`   | `--focus-ring` visible                                                          |

> `.is-active` (persistent selected state: active tab, selected row) is distinct from `:active` (transient mouse-down). Do not conflate them.

---

## 9. BUTTONS

| Variant    | Class            | Background     | Text                  | Border              |
| ---------- | ---------------- | -------------- | --------------------- | ------------------- |
| Primary    | `.btn-primary`   | `--primary`    | `--text-on-primary`   | none                |
| Secondary  | `.btn-secondary` | transparent    | `--text`              | 1px `--border`      |
| Danger     | `.btn-danger`    | `--danger-600` | `--text-on-primary`   | none                |
| Ghost      | `.btn-ghost`     | transparent    | `--text-subtle`       | none                |

**States per variant** (transition `--transition-default`):

| Variant   | `:hover`            | `:active` (pressed)  | `:disabled`              |
| --------- | ------------------- | -------------------- | ------------------------ |
| Primary   | `--primary-hover`   | `--primary-pressed`  | `var(--opacity-disabled)` |
| Danger    | `--danger-700`      | `--danger-800`       | `var(--opacity-disabled)` |
| Secondary | `--bg-muted` bg     | `--bg-muted` bg      | `var(--opacity-disabled)` |
| Ghost     | `--bg-muted` bg     | `--bg-muted` bg      | `var(--opacity-disabled)` |

> Colored buttons darken on hover/pressed via their own stops, never the neutral `--bg-muted` rule of §8. `:focus-visible` shows the `--focus-ring` on every variant.

**Dynamic sizing** — the size results from content + padding:

| Size                    | Vertical padding     | Horizontal padding   | Font                            |
| ----------------------- | -------------------- | -------------------- | ------------------------------- |
| `.btn-sm`               | `--spacing-1` (4px)  | `--spacing-3` (12px) | `--weight-medium` `--font-xs`   |
| `.btn-md` (default)     | `--spacing-2` (8px)  | `--spacing-4` (16px) | `--weight-medium` `--font-sm`   |
| `.btn-lg`               | `--spacing-3` (12px) | `--spacing-6` (24px) | `--weight-medium` `--font-base` |

**Aligned button group**: `.btn-group` container — width unified on the widest button (common `min-width` or `auto-fit` grid with equal columns).

---

## 10. ICONS — Font Awesome Free

Library: `@fortawesome/fontawesome-free` (npm, embedded locally — **zero CDN**, CSP requires it).
Single import in the renderer: `import "@fortawesome/fontawesome-free/css/all.min.css"`.

**Difference vs qtawesome**: icons are `<i>` elements styled by CSS — their colors go through tokens, **not** through a config constant. The Python generator's `config.py` exception does not exist here.

| Token            | Light (`:root`)        | Dark (`[data-theme="dark"]`) |
| ---------------- | ---------------------- | ------------------------------ |
| `--icon-default` | #6B7280 (text-subtle)  | #9CA3AF                        |
| `--icon-active`  | #4F46E5 (primary-600)  | #818CF8                        |
| `--icon-success` | #16A34A (success-600)  | #4ADE80                        |
| `--icon-warning` | #D97706 (warning-600)  | #FCD34D                        |
| `--icon-danger`  | #DC2626 (danger-600)   | #F87171                        |
| `--icon-info`    | #2563EB (info-600)     | #60A5FA                        |
| `--icon-muted`   | #9CA3AF (text-muted)   | #6B7280                        |

**Sizes**: `font-size` via tokens `--icon-sm` (16px), `--icon-md` (20px), `--icon-lg` (24px).

```tsx
// Usage in a view (React)
<i className="fa-solid fa-house icon icon-md icon-default" aria-hidden="true" />
```

```css
/* styles.css — token: icon-* */
.icon-default { color: var(--icon-default); }
.icon-md      { font-size: var(--icon-md); }
```

**Theme change**: no action — CSS variables switch with `data-theme`, icons follow instantly.

---

## 11. CSS APPLICATION RULES

1. **Zero hardcoded visual value in TS/TSX.** Every color, size, font is in `tokens.css` / `styles.css`. Zero inline `style={}`.
2. **Every styled element has a `className`** matching a named CSS rule (`id` reserved for unique anchors: `#topbar`, `#statusbar`).
3. **Dark mode is handled by `data-theme="dark"` on `<html>`** — all tokens redefined in **a single** `[data-theme="dark"]` block of `tokens.css`. `styles.css` contains no theme selector.
4. **`styles.css` contains no literal value** of color, size, or duration — only `var(--token)`. Every rule carries a comment indicating the source token.

```css
/* styles.css — token: bg / text */
body {
  background-color: var(--bg);
  color: var(--text);
}
```

---

## 12. ACCESSIBILITY

Target: **WCAG 2.1 level AA**.

| Criterion           | Rule                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------- |
| Text contrast       | ≥ 4.5:1 normal text, ≥ 3:1 large text (≥ 18px bold or ≥ 24px) and UI components                |
| `--text-muted`      | Disabled / decorative only, exempt from AA. Never for primary content                          |
| Statusbar text      | `--text-subtle` (not `--text-muted`). ~4.4:1 on `--bg-muted`, marginal — essential/error status uses `--text` |
| Minimum target size | 24px. `.btn-sm` (~24px) is the floor; prefer `.btn-md` for touch contexts                      |
| Focus visibility    | `:focus-visible` ring always visible, never removed (`outline: none` forbidden without replacement) |
| Reduced motion      | `@media (prefers-reduced-motion: reduce)` disables transitions (see `rules/css.md`)            |

> Contrast figures are computed estimates, not tool-measured. Re-check with a contrast checker before shipping a new primary color.

---

## 13. LAYERING (z-index scale)

CSS overlays (`position: fixed`/`absolute`) require explicit `z-index`. Order from back to front. A persistent `danger` toast must never be hidden, so toasts sit above modals.

| Token               | Value | Element                          |
| ------------------- | ----- | -------------------------------- |
| `--z-content`       | 0     | Main content                     |
| `--z-drawer-overlay`| 100   | Drawer dimming overlay           |
| `--z-drawer`        | 110   | Right drawer (`#drawer`)         |
| `--z-modal-overlay` | 200   | Modal dimming overlay            |
| `--z-modal`         | 210   | Modal (`.modal`)                 |
| `--z-dropdown`      | 300   | Dropdown / context menu          |
| `--z-toast`         | 400   | Toasts (`#toast-container`)      |

> Declared in `tokens.css`, consumed by the shell overlays in `styles.css`. No hardcoded `z-index` outside these tokens.

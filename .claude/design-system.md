# Design System — v1.3 (Electron)

> Binding reference for all Node.js/Electron/React applications.
> Use: Windows desktop applications, personal and professional use.
> Inseparable from `layout.md`.
> All tokens are **CSS custom properties** declared in `src/renderer/src/styles/tokens.css`.

## Changelog

| Version | Date       | Main change                                                                                       |
| ------- | ---------- | ------------------------------------------------------------------------------------------------- |
| v1.3    | 2026-06-19 | full **palette** model (5 roles/theme: main background, secondary background, accent, text, details) replaces the primary-only choice · light theme chosen, dark + supporting tokens derived · named palette catalog + custom palette · semantic/icons/charts kept fixed · WCAG AA check (warn) |
| v1.2    | 2026-06-14 | dark theme re-skin (theme-dark.md palette): 4-step dark surface ramp · dark neutrals/borders/semantic/icons/selection · Steel Blue primary (both modes) |
| v1.1    | 2026-06-14 | line-height · dark semantic backgrounds · primary/danger hover-pressed stops · `color-scheme` · WCAG AA target · layering scale · dark surface ramp fix · icon warning/info · selection/opacity/border-width tokens |
| v1.0    | initial    | CSS custom properties port: typography, colors, spacing, components, states                        |

> Aligns with the Python generator `design-system.md v1.4` (shared palette model). Per-file versions: CSS rules in `rules/css.md`, layout in `layout.md`.

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

A project's colors come from a **palette**: 5 roles chosen per project, **light theme only** — the dark theme and every supporting token are **derived**. The default palette is the set of values in the tables below (neutrals + Steel Blue), so a project that keeps the default renders exactly as before.

### Palette roles → tokens

| Role (palette)   | Drives          | Also derives                                                                                  |
| ---------------- | --------------- | --------------------------------------------------------------------------------------------- |
| Main background   | `--bg`          | `--bg-elevated` (= `--bg` in light)                                                            |
| Secondary background  | `--bg-subtle`   | `--bg-muted` (`--bg-subtle` darkened ~3 % L)                                                   |
| Accent           | `--primary-600` | `--primary-50/400/700/800/900`, `--primary`, `--primary-bg`, `--selection-bg`, focus, `--text-on-primary` |
| Text            | `--text`        | `--text-subtle` (mix text→bg ~45 %), `--text-muted` (mix text→bg ~62 %)                        |
| Details          | `--border`      | `--border-subtle` (mix border→bg ~50 %), `--border-strong` (mix border→text ~12 %)            |

The **semantic colors** (success/warning/danger/info), the **icon tokens**, and the **chart palette** are **fixed** — independent of the palette, they carry meaning (see below).

### Derivation rules (computed by Claude in Phase 1, written as literal hex in `tokens.css`)

- **Supporting light tokens**: the sRGB mixes in the role table above.
- **Accent stops** (HSL rule from the accent, same H/S, lightness varies): `--primary-50` L≈95 %, `--primary-400` L≈70 %, `--primary-700` L≈50 %, `--primary-800` L≈42 %, `--primary-900` L≈25 %. Usage tokens: `--primary` = `--primary-600` (light) / `--primary-400` (dark); `--primary-bg` = `--primary-50` (light) / `--primary-900` (dark). Same `colorsys` method as the Python generator. `--text-on-primary` = `#FFFFFF` or near-black, whichever wins contrast on the accent.
- **Dark theme** (from the light palette, keeping each role's hue/saturation, re-targeting lightness):

| Token         | Dark L | Token             | Dark L          |
| ------------- | ------ | ----------------- | --------------- |
| `--bg`        | ≈10 %  | `--text`          | ≈83 %           |
| `--bg-subtle` | ≈14 %  | `--text-subtle`   | ≈66 %           |
| `--bg-elevated` | ≈18 % | `--text-muted`   | ≈40 %           |
| `--bg-muted`  | ≈22 % (lightest) | `--border` / `--border-subtle` / `--border-strong` | ≈26 % / ≈20 % / ≈33 % |
| accent        | `--primary-400` (L≈60-70 %) | semantic / icons / charts | fixed |

> Harmony: for named presets and custom palettes, dark surfaces carry a low saturation (≈8-12 %) of the accent hue for depth. The **default palette** ships an explicit **neutral grey** dark theme (achromatic surfaces and accent — the tables below), and its explicit values win over the rule. The dark surface ramp stays ascending in every case. Named presets and custom palettes derive the dark theme by the rule.

### Named palettes (Phase 1 catalog)

`/electron-p1-scoping` presents these; each lists its 5 **light** roles (dark derived). The user can also enter a **custom palette** (5 light hex). Phase 1 then checks WCAG AA (text/bg, text-subtle/bg, accent/bg, text-on-primary/accent) and reports failures without blocking (`§12`).

| Name             | Main background | Secondary background | Accent  | Text   | Details |
| ---------------- | -------------- | --------------- | ------- | ------- | ------- |
| Steel (default)  | #FFFFFF        | #F9FAFB         | #4682B4 | #111827 | #E5E7EB |
| Forest            | #FFFFFF        | #F6F8F6         | #059669 | #14201A | #DCE5DF |
| Slate          | #FFFFFF        | #F8FAFC         | #4F46E5 | #1E293B | #E2E8F0 |
| Amber            | #FFFDFB        | #FBF6EF         | #B45309 | #1C1917 | #ECE3D8 |
| Ruby            | #FFFFFF        | #FAF7F7         | #BE123C | #1A1212 | #EAE0E1 |

### Light mode — default palette (`:root`)

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

### Dark mode — default palette (`[data-theme="dark"]`, derived)

| Token             | Value   | Usage                  |
| ----------------- | ------- | ---------------------- |
| `--bg`            | #1C1C1C | Main background, topbar |
| `--bg-subtle`     | #2B2B2B | Secondary areas        |
| `--bg-elevated`   | #353535 | Drawer, modals         |
| `--bg-muted`      | #3F3F3F | Statusbar, hover       |
| `--text`          | #F5F5F5 | Primary text           |
| `--text-subtle`   | #939393 | Secondary text         |
| `--text-muted`    | #6E6E6E | Disabled text          |
| `--border`        | #525252 | Standard borders       |
| `--border-subtle` | #373737 | Discreet separators    |
| `--border-strong` | #666666 | Table headers          |

> Dark surface ramp: `--bg` #1C1C1C < `--bg-subtle` #2B2B2B < `--bg-elevated` #353535 < `--bg-muted` #3F3F3F. `--bg-muted` is the lightest so that hover stays visible on every surface, including inside drawers and modals.

### Native color scheme

Declare `color-scheme` per theme so native controls (scrollbars, `<select>`, `<progress>`, checkbox/radio, native focus rings, date pickers) follow the theme. Without it, dark mode breaks on native widgets.

```css
:root                { color-scheme: light; }
[data-theme="dark"]  { color-scheme: dark; }
```

### Accent — Steel Blue (default palette)

| Token           | Light   | Dark    | Usage                               |
| --------------- | ------- | ------- | ----------------------------------- |
| `--primary-50`  | #EDF3F8 | —       | Selection / active bg (light)       |
| `--primary-400` | —       | #B3B3B3 | Active text/border (dark)           |
| `--primary-600` | #4682B4 | #9E9E9E | Primary button fill; active text/border (light) |
| `--primary-700` | #396A93 | #808080 | Primary button hover                |
| `--primary-800` | #2F5879 | #6B6B6B | Primary button pressed              |
| `--primary-900` | —       | #404040 | Selection / active bg (dark)        |

> `--text-on-primary` (primary-button text): #FFFFFF in light (on Steel Blue), #1C1C1C in dark (white fails AA on the #9E9E9E grey accent, 2.7:1; near-black = 6.4:1).
>
> Modification: replacing `--primary-50/400/600/700/800/900` in `tokens.css` is enough to change the **accent** across the whole application. For a custom color the 6 stops derive from `--primary-600` by the same HSL rule used by the Python generator (same H/S, lightness 95/70/—/50/42/25%), one hue across both themes. Default-palette specifics: Steel Blue (light) is a preset whose explicit values win over the rule (its `--primary-600` sits near L 49%, so `--primary-700/800` are darkened past the generic stops); the dark accent is a **neutral grey** (achromatic `#9E9E9E`), so the dark stops are pure greys and `--primary-600/700/800` are redefined per theme rather than mode-agnostic.

Implementation: derived usage tokens, redefined per theme (or fixed) — these are the ones `styles.css` consumes. The default palette's dark theme also redefines the accent stops `--primary-600/700/800` to greys (not just the usage tokens) and `--text-on-primary` to near-black.

```css
:root                { --primary: var(--primary-600); --primary-bg: var(--primary-50);
                       --primary-hover: var(--primary-700); --primary-pressed: var(--primary-800); }
[data-theme="dark"]  { --primary: var(--primary-400); --primary-bg: var(--primary-900);
                       --primary-600: #9E9E9E; --primary-700: #808080; --primary-800: #6B6B6B;
                       --text-on-primary: #1C1C1C; }
```

### Semantic colors (fixed — outside the palette)

| Token             | Light   | Dark    | Usage                  |
| ----------------- | ------- | ------- | ---------------------- |
| `--success-50`    | #F0FDF4 | #1D3F2A | Success toast bg       |
| `--success-600`   | #16A34A | #4A9E6A | Success border, icon   |
| `--warning-50`    | #FFFBEB | #483B13 | Warning toast bg       |
| `--warning-600`   | #D97706 | #CCA840 | Warning border, icon   |
| `--danger-50`     | #FFF1F2 | #441818 | Danger toast bg        |
| `--danger-600`    | #DC2626 | #C04A4A | Danger border, icon    |
| `--danger-700`    | #B91C1C | #B91C1C | Danger button hover    |
| `--danger-800`    | #991B1B | #991B1B | Danger button pressed  |
| `--info-50`       | #EFF6FF | #1A3042 | Info toast bg          |
| `--info-600`      | #2563EB | #4682B4 | Info border, icon      |

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
| Primary    | `.btn-primary`   | `--primary-600`| `--text-on-primary`   | none                |
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

> Primary button fill uses `--primary-600`, **not** the `--primary` usage token. In light it is Steel Blue #4682B4 with white text (4.11:1, AA for UI / large text). In dark (default palette) it is the neutral grey #9E9E9E with **near-black** `--text-on-primary` #1C1C1C (6.4:1) — white would fail on this grey (2.7:1). The `--primary` usage token (`--primary-400` #B3B3B3 in dark) is reserved for foreground accents (active text/border, icons, focus) that must read on dark surfaces.

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
| `--icon-default` | #6B7280 (text-subtle)  | #939393                        |
| `--icon-active`  | #4682B4 (primary-600)  | #B3B3B3                        |
| `--icon-success` | #16A34A (success-600)  | #4A9E6A                        |
| `--icon-warning` | #D97706 (warning-600)  | #CCA840                        |
| `--icon-danger`  | #DC2626 (danger-600)   | #C04A4A                        |
| `--icon-info`    | #2563EB (info-600)     | #4682B4                        |
| `--icon-muted`   | #9CA3AF (text-muted)   | #6E6E6E                        |

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

> Contrast figures are computed estimates, not tool-measured. Re-check with a contrast checker before shipping a custom palette (Phase 1 runs the AA check).

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

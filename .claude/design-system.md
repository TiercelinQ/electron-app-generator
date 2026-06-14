# Design System — v1.0 (Electron)

> Binding reference for all Node.js/Electron/React applications.
> Use: Windows desktop applications, personal and professional use.
> Inseparable from `layout.md`.
> All tokens are **CSS custom properties** declared in `src/renderer/src/styles/tokens.css`.

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
| `--bg-muted`      | #1F2937 | Statusbar, hover       |
| `--bg-elevated`   | #374151 | Drawer, modals         |
| `--text`          | #F9FAFB | Primary text           |
| `--text-subtle`   | #9CA3AF | Secondary text         |
| `--text-muted`    | #6B7280 | Disabled text          |
| `--border`        | #374151 | Standard borders       |
| `--border-subtle` | #1F2937 | Discreet separators    |
| `--border-strong` | #4B5563 | Table headers          |

### Primary color — Slate Blue

| Token           | Light   | Dark    |
| --------------- | ------- | ------- |
| `--primary-50`  | #EEF2FF | —       |
| `--primary-400` | —       | #818CF8 |
| `--primary-600` | #4F46E5 | —       |
| `--primary-900` | —       | #312E81 |

> Modification: replacing these 4 values in `tokens.css` is enough to change the primary color across the whole application.

Implementation: two derived usage tokens, redefined per theme — these are the ones `styles.css` consumes.

```css
:root                { --primary: var(--primary-600); --primary-bg: var(--primary-50); }
[data-theme="dark"]  { --primary: var(--primary-400); --primary-bg: var(--primary-900); }
```

### Semantic colors

| Token             | Light   | Dark    | Usage                  |
| ----------------- | ------- | ------- | ---------------------- |
| `--success-50`    | #F0FDF4 | —       | Success toast bg       |
| `--success-600`   | #16A34A | #4ADE80 | Success border, icon   |
| `--warning-50`    | #FFFBEB | —       | Warning toast bg       |
| `--warning-600`   | #D97706 | #FCD34D | Warning border, icon   |
| `--danger-50`     | #FFF1F2 | —       | Danger toast bg        |
| `--danger-600`    | #DC2626 | #F87171 | Danger border, icon    |
| `--info-50`       | #EFF6FF | —       | Info toast bg          |
| `--info-600`      | #2563EB | #60A5FA | Info border, icon      |

### Charts / visualization palette

| Token             | Value                    |
| ----------------- | ------------------------ |
| `--chart-primary` | `var(--primary)`         |
| `--chart-success` | `var(--success-600)`     |
| `--chart-warning` | `var(--warning-600)`     |
| `--chart-danger`  | `var(--danger-600)`      |
| `--chart-info`    | `var(--info-600)`        |

> The `--chart-*` tokens consume the semantic colors via `var()` — they automatically follow dark mode with no redefinition.

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
| Dialog / modal    | content                                  | content                    | `min-width` advised per context               |
| Tree item         | content + indentation                    | vertical padding           | —                                             |
| Toast             | —                                        | multi-line content         | fixed width 320px                             |

---

## 5. SHAPE & SHADOWS

| Token      | Value                       |
| ---------- | --------------------------- |
| `--radius` | 0px — strict flat design    |
| shadows    | none — strict flat design   |

`box-shadow` forbidden. `border-radius: 0` everywhere.

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

Applies to all buttons, tabs, clickable items:

| State                  | Rule                                                                  |
| ---------------------- | --------------------------------------------------------------------- |
| `default`              | Base style defined by the component                                    |
| `:hover`               | `--bg-muted` background, `--transition-default` transition             |
| `active` / selected    | `--primary-bg` background, `--primary` text (`.is-active` class)       |
| `disabled`             | 40% opacity, `pointer-events: none` (`disabled` attribute or `.is-disabled`) |
| `:focus-visible`       | `--focus-ring` visible                                                 |

---

## 9. BUTTONS

| Variant    | Class            | Background     | Text            | Border              |
| ---------- | ---------------- | -------------- | --------------- | ------------------- |
| Primary    | `.btn-primary`   | `--primary`    | #FFFFFF         | none                |
| Secondary  | `.btn-secondary` | transparent    | `--text`        | 1px `--border`      |
| Danger     | `.btn-danger`    | `--danger-600` | #FFFFFF         | none                |
| Ghost      | `.btn-ghost`     | transparent    | `--text-subtle` | none                |

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
| `--icon-danger`  | #DC2626 (danger-600)   | #F87171                        |
| `--icon-success` | #16A34A (success-600)  | #4ADE80                        |
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

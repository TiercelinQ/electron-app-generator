# Design System — v2.0 (Electron)

> Binding reference for all Node.js/Electron/React applications.
> Use: Windows desktop applications, personal and professional use.
> Inseparable from `layout.md`.
> All tokens are **CSS custom properties** declared in `src/renderer/src/styles/tokens.css`.

**Visual language (v2.0)**: depth is expressed by the **stroke** (borders), never by shadows or elevation. Corners are softly rounded (5px). Neutrals carry a low tint of the project accent, so every generated application has its own atmosphere. Motion is discreet (asymmetric deceleration) with **one** signature gesture: the sliding underline on tabs and horizontal navigation.

## Changelog

| Version | Date       | Main change                                                                                       |
| ------- | ---------- | -------------------------------------------------------------------------------------------------- |
| v2.0    | 2026-07-16 | modernization: `--radius` 0 → **5px** · typography → **system-ui** stack · **accent-tinted neutrals** (all neutral roles derived from the accent hue; explicit palette roles still win) · **semantic colors derived per project** (fixed hue anchors, harmonized ±6° toward the accent; info = accent) · hover on neutral elements = **border strengthening** (replaces `--bg-muted` fill) · new easing `--ease-out` (decelerate) 160/240ms · **signature gesture**: sliding underline (tabs / horizontal nav) · icons Font Awesome → **Lucide** (stroke 1.75px); `--icon-*` now consume semantic/primary tokens · floating layers marked by `--border-strong` (shadows still forbidden) |
| v1.6    | 2026-06-27 | default accent → **Steel Blue** `#4682B4` (chromatic in both themes, derived like the named palettes) · dark **surfaces** stay neutral grey · `--text-on-primary` stays a single white value (white on `#4682B4` 4.1:1) · Teal kept as a named palette |
| v1.5    | 2026-06-20 | default accent → **Teal** `#0D9488` · dark surfaces stay neutral grey · grey-accent dark special-case removed |
| v1.4    | 2026-06-20 | decouple Danger button text from the accent: new fixed `--text-on-danger` |
| v1.3    | 2026-06-19 | full **palette** model (5 roles/theme) · named palette catalog + custom palette · WCAG AA check (warn) |
| v1.2    | 2026-06-14 | dark theme re-skin: 4-step dark surface ramp · Steel Blue primary (both modes) |
| v1.1    | 2026-06-14 | line-height · dark semantic backgrounds · `color-scheme` · WCAG AA target · layering scale |
| v1.0    | initial    | CSS custom properties port: typography, colors, spacing, components, states |

> Aligns with the Python generator `design-system.md v2.0` and Flutter `v2.0` (shared palette + derivation model). Per-file versions: CSS rules in `rules/css.md`, layout in `layout.md`.

Every generated application references the active version in its `README.md`.

---

## 1. TYPOGRAPHY

| Token              | Value      | Usage                         |
| ------------------ | ---------- | ----------------------------- |
| `--font-family`    | system-ui  | All applications              |
| `--font-xs`        | 12px       | Statusbar, secondary labels   |
| `--font-sm`        | 14px       | Labels, subtitles, body       |
| `--font-base`      | 16px       | Primary text, navigation      |
| `--font-lg`        | 18px       | Secondary section titles      |
| `--font-xl`        | 20px       | Intermediate titles           |
| `--font-2xl`       | 24px       | Primary section titles        |
| `--weight-normal`  | 400        | Body, descriptions            |
| `--weight-medium`  | 500        | Labels, navigation items      |
| `--weight-semibold`| 600        | Titles, headers               |
| `--weight-bold`    | 700        | Primary titles                |

```css
/* tokens.css */
:root {
  --font-family: system-ui, "Segoe UI", "Helvetica Neue", sans-serif;
}
```

> `system-ui` resolves to the native UI face of the host OS (Segoe UI Variable on Windows 11, Segoe UI on Windows 10). Zero embedded font, zero dependency; the application always looks native to its OS. Do not pin "Segoe UI" first anymore — that pins the Windows 10 face even on Windows 11.

### Line-height

| Token              | Value | Usage                             |
| ------------------ | ----- | --------------------------------- |
| `--leading-tight`  | 1.25  | Titles (`--font-lg`, `--font-2xl`) |
| `--leading-normal` | 1.5   | Body, labels                      |

### Numerals

Tables, statusbar counters, and any column of figures set `font-variant-numeric: tabular-nums` so digits align vertically.

---

## 2. COLORS

A project's colors come from a **palette**. In v2.0 only the **accent is mandatory**: every neutral role, the accent stops, and the semantic colors **derive** from it. The four other roles (main background, secondary background, text, details) remain available as **explicit overrides** — when provided, their values win over the derivation (same precedence rule as v1.6 presets).

### Palette roles → tokens

| Role (palette)      | Mandatory | Drives          | Also derives                                                                                  |
| ------------------- | --------- | --------------- | ---------------------------------------------------------------------------------------------- |
| Accent              | yes       | `--primary-600` | `--primary-50/400/700/800/900`, `--primary`, `--primary-bg`, `--selection-bg`, focus, `--text-on-primary`, **all neutral tokens** (tinting rule below), **all semantic tokens** (harmonization rule below) |
| Main background     | optional  | `--bg`          | `--bg-elevated` (= `--bg` in light)                                                            |
| Secondary background| optional  | `--bg-subtle`   | `--bg-muted` (`--bg-subtle` darkened ~3 % L)                                                   |
| Text                | optional  | `--text`        | `--text-subtle` (mix text→bg ~45 %), `--text-muted` (mix text→bg ~62 %)                        |
| Details             | optional  | `--border`      | `--border-subtle` (mix border→bg ~50 %), `--border-strong` (mix border→text ~12 %)             |

### Derivation rules (computed by Claude in Phase 1, written as literal hex in `tokens.css`)

**Accent stops** (unchanged from v1.6 — same H/S as the accent, lightness varies): `--primary-50` L≈95 %, `--primary-400` L≈70 %, `--primary-700` L≈50 %, `--primary-800` L≈42 %, `--primary-900` L≈25 %. Usage tokens: `--primary` = `--primary-600` (light) / `--primary-400` (dark); `--primary-bg` = `--primary-50` (light) / `--primary-900` (dark). `--text-on-primary` = `#FFFFFF` or near-black, whichever wins contrast on the accent.

**Tinted neutrals** (new in v2.0). Let **H** be the accent hue. Every neutral token is `hsl(H, S, L)` with the fixed S/L targets below. The tint is atmospheric, never saturated: S stays ≤ 33 % in light, ≤ 24 % in dark. When an optional palette role is provided, its explicit value replaces the tinted target for that token, and its supporting tokens derive from it by the mix rules of the role table above.

| Token             | Light `hsl(H, S%, L%)` | Dark `hsl(H, S%, L%)` |
| ----------------- | ---------------------- | ---------------------- |
| `--bg`            | 30, 99.4               | 14, 11                 |
| `--bg-subtle`     | 25, 97                 | 16, 15                 |
| `--bg-elevated`   | = `--bg`               | 15, 17                 |
| `--bg-muted`      | 22, 94.5               | 16, 19                 |
| `--text`          | 33, 9                  | 24, 96                 |
| `--text-subtle`   | 10, 44                 | 13, 63                 |
| `--text-muted`    | 12, 64                 | 11, 42                 |
| `--border`        | 18, 90                 | 14, 23                 |
| `--border-subtle` | 20, 94                 | 15, 18                 |
| `--border-strong` | 14, 64                 | 15, 38                 |

> Dark surface ramp stays ascending: `--bg` < `--bg-subtle` < `--bg-elevated` < `--bg-muted`, so hover stays visible on every surface, including inside drawers and modals. Same rationale as v1.6.

### Default palette — Steel Blue accent `#4682B4` (H = 207), computed hex

Light (`:root`):

| Token             | Value   | Token             | Value   |
| ----------------- | ------- | ----------------- | ------- |
| `--bg`            | #FDFEFF | `--text`          | #0F181E |
| `--bg-subtle`     | #F5F8FA | `--text-subtle`   | #65717B |
| `--bg-muted`      | #EEF1F4 | `--text-muted`    | #98A4AE |
| `--bg-elevated`   | #FDFEFF | `--border`        | #E1E6EA |
| —                 | —       | `--border-subtle` | #ECF0F3 |
| —                 | —       | `--border-strong` | #96A4B0 |

Dark (`[data-theme="dark"]`, derived):

| Token             | Value   | Token             | Value   |
| ----------------- | ------- | ----------------- | ------- |
| `--bg`            | #181C20 | `--text`          | #F2F5F7 |
| `--bg-subtle`     | #20272C | `--text-subtle`   | #94A2AD |
| `--bg-elevated`   | #252C32 | `--text-muted`    | #5F6C77 |
| `--bg-muted`      | #293138 | `--border`        | #323B43 |
| —                 | —       | `--border-subtle` | #272F35 |
| —                 | —       | `--border-strong` | #52626F |

> Hex values are computed from the HSL targets; re-check with a contrast tool before shipping (Phase 1 runs the AA check, §12).

### Named palettes (Phase 1 catalog)

`/electron-p1-scoping` presents these. In v2.0 a preset is defined by its **accent alone**; the four optional roles may still be listed to override the tint (e.g. Amber warms its backgrounds beyond the rule). Custom palettes: 1 mandatory hex (accent) + up to 4 optional overrides.

| Name                 | Accent  | Optional overrides                     |
| -------------------- | ------- | -------------------------------------- |
| Steel Blue (default) | #4682B4 | —                                      |
| Teal                 | #0D9488 | —                                      |
| Forest               | #059669 | —                                      |
| Slate                | #4F46E5 | —                                      |
| Amber                | #B45309 | Main bg #FFFDFB, Secondary bg #FBF6EF  |
| Ruby                 | #BE123C | —                                      |

### Native color scheme

Unchanged from v1.6 — declare `color-scheme` per theme so native controls (scrollbars, `<select>`, `<progress>`, checkbox/radio, native focus rings, date pickers) follow the theme. Without it, dark mode breaks on native widgets.

```css
:root                { color-scheme: light; }
[data-theme="dark"]  { color-scheme: dark; }
```

### Accent — usage tokens

Unchanged mechanics from v1.6: the stops are mode-agnostic (written once to `:root`); only the usage tokens flip per theme — these are the ones `styles.css` consumes. Replacing the 6 `--primary-*` stops in `tokens.css` is enough to change the accent across the whole application (the neutrals and semantics then re-derive from the new hue).

```css
:root                { --primary: var(--primary-600); --primary-bg: var(--primary-50);
                       --primary-hover: var(--primary-700); --primary-pressed: var(--primary-800); }
[data-theme="dark"]  { --primary: var(--primary-400); --primary-bg: var(--primary-900); }
```

### Semantic colors (derived — harmonized with the project atmosphere)

New in v2.0. Semantic colors keep **fixed hue anchors** so the meaning never drifts, but their exact hue/saturation/lightness are **derived per project** so they share the tinted atmosphere of the neutrals. **Info is the accent itself.**

**Derivation rule.** Let **Ha** be the accent hue and **Hs** the anchor hue of a semantic color. The harmonized hue is:

```
Hs' = Hs + clamp(shortest_angle(Ha − Hs), −10°, +10°) × 0.6      → shift capped at ±6°
```

| Semantic | Anchor Hs | Light `--*-600` `hsl(Hs', S%, L%)` | Dark `--*-600` `hsl(Hs', S%, L%)` |
| -------- | --------- | ----------------------------------- | ---------------------------------- |
| success  | 152       | S 48, L 38                          | S 42, L 60                         |
| warning  | 38        | S 62, L 40                          | S 56, L 60                         |
| danger   | 355       | S 52, L 48                          | S 46, L 62                         |
| info     | = accent  | `--info-600` = `var(--primary-600)` | `--info-600` = `var(--primary-400)` |

**Surface tokens** (`--*-50`, toast backgrounds):
- Light: `--*-50` = sRGB mix of `--bg` 92 % + `--*-600` 8 %.
- Dark: `--*-50` = sRGB mix of `--bg` 82 % + dark `--*-600` 18 %.
- Info: `--info-50` = `var(--primary-bg)`.

> Naming note (kept from v1.6): `--*-50` is a **role** ("semantic surface / toast background"), not a fixed luminance level. Light = pale tint, Dark = deep tint of the same hue, redefined in the `[data-theme="dark"]` block. Without the dark redefinition the `var()` keeps the light value and the toast breaks in dark mode.

**Danger button stops** (fill logic unchanged from v1.4/v1.6: red fill + white text in both themes):
- `--danger-700` = light `--danger-600` at L −7 %; `--danger-800` at L −13 %.

Default palette (accent H 207) computed hex:

| Token             | Light   | Dark    | Usage                  |
| ----------------- | ------- | ------- | ---------------------- |
| `--success-50`    | #EFF6F3 | #26372F | Success toast bg       |
| `--success-600`   | #328F6D | #6EC4A4 | Success border, icon   |
| `--warning-50`    | #F8F5EC | #392F1B | Warning toast bg       |
| `--warning-600`   | #A58327 | #D2B460 | Warning border, icon   |
| `--danger-50`     | #F8EFF1 | #38222B | Danger toast bg        |
| `--danger-600`    | #BA3B52 | #CB7282 | Danger border, icon    |
| `--danger-700`    | #A23448 | #A23448 | Danger button hover    |
| `--danger-800`    | #8A2C3D | #8A2C3D | Danger button pressed  |
| `--info-50`       | `var(--primary-bg)` | `var(--primary-bg)` | Info toast bg |
| `--info-600`      | `var(--primary)` | `var(--primary)` | Info border, icon |

> The ±6° cap keeps every semantic color instantly recognizable across projects (a danger is always red-family, a success always green-family). Toast message text uses `--text`; border/icon use `--*-600`. Every `--*-600`/`--*-50` pair must pass the §12 checks — Phase 1 verifies and reports.

### Charts / visualization palette

Unchanged mechanics — `--chart-*` consume the semantic colors via `var()` and follow both themes automatically with no redefinition.

| Token             | Value                    |
| ----------------- | ------------------------ |
| `--chart-primary` | `var(--primary)`         |
| `--chart-success` | `var(--success-600)`     |
| `--chart-warning` | `var(--warning-600)`     |
| `--chart-danger`  | `var(--danger-600)`      |
| `--chart-info`    | `var(--info-600)`        |

### Text selection & on-primary

Unchanged from v1.6.

| Token                | Light                | Dark                  | Usage                          |
| -------------------- | -------------------- | --------------------- | ------------------------------ |
| `--selection-bg`     | `var(--primary-bg)`  | `var(--primary-bg)`   | Selected text background       |
| `--selection-text`   | `var(--text)`        | `var(--text)`         | Selected text color            |
| `--text-on-primary`  | #FFFFFF              | #FFFFFF               | Text on Primary button         |
| `--text-on-danger`   | #FFFFFF              | #FFFFFF               | Text on Danger button (fixed)  |

```css
::selection { background: var(--selection-bg); color: var(--selection-text); }
```

> `--text-on-primary` (Primary button) and `--text-on-danger` (Danger button) replace the literal `#FFFFFF` in button rules, keeping `styles.css` free of literal values (`rules/css.md`). They stay separate tokens so a custom accent dark enough to need a near-black `--text-on-primary` does not drag the Danger button along (the danger fill keeps white text in both themes).

---

## 3. SPACING

Unchanged from v1.6.

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

Unchanged from v1.6 (fixed anchors + dynamic sizing principle).

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

**The stroke is the language of depth.** An element detaches from the background by its border, never by a shadow. Hierarchy = border strength: `--border-subtle` < `--border` < `--border-strong`. Floating layers (dropdown, modal, drawer) use `--border-strong` — that is their elevation; the toast's stroke marker is its 4px semantic left accent (`layout.md §5`).

| Token      | Value                     |
| ---------- | ------------------------- |
| `--radius` | 5px, uniform              |
| shadows    | none — `box-shadow` forbidden |

> `--radius` applies to every rounded element: buttons, fields, cards, toasts, modals, badges. Nested radius (e.g. menu items inside a 5px menu): `calc(var(--radius) - 2px)`. `box-shadow` remains forbidden as in v1.6 — the only allowed use of the property is the focus/emphasis inset technique if `outline` cannot apply (rare).

### Border widths

| Token                     | Value | Usage                                        |
| ------------------------- | ----- | -------------------------------------------- |
| `--border-width`          | 1px   | Standard borders, separators                 |
| `--border-width-emphasis` | 2px   | Focus, signature underline, field-in-error   |
| `--border-width-accent`   | 4px   | Toast left accent                            |

### Opacity

| Token                | Value | Usage                                  |
| -------------------- | ----- | -------------------------------------- |
| `--opacity-disabled` | 0.4   | Disabled interactive elements          |
| `--opacity-overlay`  | 0.4   | Modal / drawer overlay (`--text` color) |

---

## 6. TRANSITIONS

New in v2.0: a single asymmetric easing (fast start, soft landing) replaces `ease`. It is the only easing in the system.

| Token                  | Value                              | Usage                              |
| ---------------------- | ---------------------------------- | ---------------------------------- |
| `--ease-out`           | cubic-bezier(0.2, 0.8, 0.2, 1)     | Every transition                   |
| `--transition-default` | 160ms var(--ease-out)              | hover, focus, color/border changes |
| `--transition-slow`    | 240ms var(--ease-out)              | Panels, drawer, signature underline |

**Motion policy**: hover/focus/state changes transition; nothing else animates. No entry animations on dropdowns, modals, or toasts. The **only** expressive movement in the system is the signature underline (§8).

---

## 7. FOCUS

Unchanged from v1.6.

| Token          | Value                                      |
| -------------- | ------------------------------------------- |
| `--focus-ring` | 2px solid `var(--primary)`, offset 2px      |

```css
:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
```

---

## 8. INTERACTIVE COMPONENT STATES

Applies to **neutral interactive elements**: tabs, list/table/tree items, pagination buttons, `.btn-secondary`, `.btn-ghost`. Colored-background buttons (`.btn-primary`, `.btn-danger`) follow §9.

**v2.0 change — hover is a stroke event, not a fill event.** The `--bg-muted` hover fill of v1.6 is replaced by border strengthening: on hover, the element's border climbs one step. Elements without a visible border always carry a **transparent 1px border** so hover never shifts layout.

| State              | Rule                                                                            |
| ------------------ | ------------------------------------------------------------------------------- |
| `default`          | Base style; borderless items have `border: 1px solid transparent`               |
| `:hover`           | Border climbs one step: transparent → `--border`; `--border` → `--border-strong`. Wide list/table rows may add `--bg-subtle` as a secondary cue. Transition `--transition-default` |
| `:active`          | `--bg-muted` background (transient press feedback)                              |
| `.is-active` (selected) | `--primary-bg` background, `--primary` text. Tabs / horizontal nav instead use the **signature underline** (below) |
| `:disabled` / `.is-disabled` | `var(--opacity-disabled)` (0.4), `pointer-events: none`             |
| `:focus-visible`   | `--focus-ring` visible                                                          |

> `.is-active` (persistent) remains distinct from `:active` (transient mouse-down). Do not conflate them.

### Signature gesture — the sliding underline

The selected indicator of **tabs and horizontal navigation** is a 2px accent underline that **slides** from the previous item to the new one (240ms `--ease-out`). It is the identity gesture of the system: implement it wherever a horizontal selection exists, and nowhere else.

Reference implementation (the underline is a positioned `::after` on the container; JS only writes two CSS variables):

```css
/* styles.css — token: primary / border-width-emphasis / transition-slow */
.tabs { position: relative; display: flex; border-bottom: var(--border-width) solid var(--border); }
.tabs::after {
  content: ""; position: absolute; bottom: calc(var(--border-width) * -1);
  height: var(--border-width-emphasis); background: var(--primary);
  left: var(--underline-x, 0); width: var(--underline-w, 0);
  transition: left var(--transition-slow), width var(--transition-slow);
}
```

```ts
// Renderer — on selection change and on mount/resize
function placeUnderline(tabs: HTMLElement) {
  const active = tabs.querySelector<HTMLElement>(".is-active");
  if (!active) return;
  tabs.style.setProperty("--underline-x", `${active.offsetLeft}px`);
  tabs.style.setProperty("--underline-w", `${active.offsetWidth}px`);
}
```

> This is the single sanctioned exception to "no JS-driven visuals": two CSS variables, nothing else. With `prefers-reduced-motion: reduce` the underline snaps (transitions disabled globally, `rules/css.md`).

---

## 9. BUTTONS

| Variant    | Class            | Background     | Text                  | Border              |
| ---------- | ---------------- | -------------- | --------------------- | ------------------- |
| Primary    | `.btn-primary`   | `--primary-600`| `--text-on-primary`   | none                |
| Secondary  | `.btn-secondary` | transparent    | `--text`              | 1px `--border`      |
| Danger     | `.btn-danger`    | `--danger-600` | `--text-on-danger`    | none                |
| Ghost      | `.btn-ghost`     | transparent    | `--text-subtle`       | 1px transparent     |

**States per variant** (transition `--transition-default`):

| Variant   | `:hover`                          | `:active` (pressed)  | `:disabled`              |
| --------- | --------------------------------- | -------------------- | ------------------------ |
| Primary   | `--primary-hover`                 | `--primary-pressed`  | `var(--opacity-disabled)` |
| Danger    | `--danger-700`                    | `--danger-800`       | `var(--opacity-disabled)` |
| Secondary | border → `--border-strong`        | `--bg-muted` bg      | `var(--opacity-disabled)` |
| Ghost     | border → `--border`, text → `--text` | `--bg-muted` bg   | `var(--opacity-disabled)` |

> v2.0: Secondary and Ghost hover by **stroke** (§8), no longer by `--bg-muted` fill. Colored buttons keep their own darkening stops. `:focus-visible` shows the `--focus-ring` on every variant.

> Primary button fill uses `--primary-600` in **both** themes with `--text-on-primary` (unchanged v1.6 logic; the brighter `--primary-400` remains reserved for dark foreground accents: active text/border, icons, focus). Danger fill uses the light `--danger-600` in both themes with white `--text-on-danger`.

**Dynamic sizing** — unchanged from v1.6, the size results from content + padding:

| Size                    | Vertical padding     | Horizontal padding   | Font                            |
| ----------------------- | -------------------- | -------------------- | ------------------------------- |
| `.btn-sm`               | `--spacing-1` (4px)  | `--spacing-3` (12px) | `--weight-medium` `--font-xs`   |
| `.btn-md` (default)     | `--spacing-2` (8px)  | `--spacing-4` (16px) | `--weight-medium` `--font-sm`   |
| `.btn-lg`               | `--spacing-3` (12px) | `--spacing-6` (24px) | `--weight-medium` `--font-base` |

**Aligned button group**: `.btn-group` container — width unified on the widest button (common `min-width` or `auto-fit` grid with equal columns).

---

## 10. ICONS — Lucide

Library: `lucide-react` (npm, embedded locally — **zero CDN**, CSP requires it).
Stroke icons at 1.5–2px: the icon set speaks the same stroke language as the borders (§5).

```tsx
// Usage in a view (React)
import { House } from "lucide-react";
<House className="icon icon-md icon-default" strokeWidth={1.75} aria-hidden="true" />
```

| Token            | Value                     |
| ---------------- | ------------------------- |
| `--icon-default` | `var(--text-subtle)`      |
| `--icon-active`  | `var(--primary)`          |
| `--icon-success` | `var(--success-600)`      |
| `--icon-warning` | `var(--warning-600)`      |
| `--icon-danger`  | `var(--danger-600)`       |
| `--icon-info`    | `var(--info-600)`         |
| `--icon-muted`   | `var(--text-muted)`       |
| `--icon-stroke`  | 1.75                      |

> v2.0: the `--icon-*` tokens consume the derived tokens via `var()` — they follow the project palette and both themes with no redefinition (the v1.6 hardcoded hex table is removed). Lucide renders inline SVG with `stroke: currentColor`, so `color: var(--icon-*)` drives it directly.

**Sizes**: `--icon-sm` (16px), `--icon-md` (20px), `--icon-lg` (24px), applied as `width`/`height` (or the `size` prop).

```css
/* styles.css — token: icon-* */
.icon-default { color: var(--icon-default); }
.icon-md      { width: var(--icon-md); height: var(--icon-md); }
```

> Cross-generator note: the Python generator has no React runtime — it vendors the Lucide SVG files (npm `lucide-static` or the official repository) and renders them as themed `QIcon`s with the same stroke and size tokens (its own `design-system.md §10` is authoritative there). The qtawesome path is retired with Font Awesome.

**Theme change**: no action — CSS variables switch with `data-theme`, icons follow instantly.

---

## 11. CSS APPLICATION RULES

Unchanged from v1.6, plus rule 5.

1. **Zero hardcoded visual value in TS/TSX.** Every color, size, font is in `tokens.css` / `styles.css`. Zero inline `style={}`.
2. **Every styled element has a `className`** matching a named CSS rule (`id` reserved for unique anchors: `#topbar`, `#statusbar`).
3. **Dark mode is handled by `data-theme="dark"` on `<html>`** — all tokens redefined in **a single** `[data-theme="dark"]` block of `tokens.css`. `styles.css` contains no theme selector.
4. **`styles.css` contains no literal value** of color, size, or duration — only `var(--token)`. Every rule carries a comment indicating the source token.
5. **The signature underline is the only JS-positioned visual** (§8): JS may write `--underline-x` / `--underline-w` and nothing else.

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
| Statusbar text      | `--text-subtle` (not `--text-muted`). Essential/error status uses `--text`                     |
| Semantic contrast   | Every derived `--*-600` ≥ 3:1 against `--bg` and against its `--*-50` toast bg; error helper text ≥ 4.5:1 against `--bg` |
| Semantic recognizability | Harmonization hue shift capped at ±6° (§2) — a danger stays red-family in every project  |
| Hover cue           | Border strengthening (§8) must yield a ≥ 3:1 change against the surface, or pair with the `--bg-subtle` secondary cue |
| Minimum target size | 24px. `.btn-sm` (~24px) is the floor; prefer `.btn-md` for touch contexts                      |
| Focus visibility    | `:focus-visible` ring always visible, never removed (`outline: none` forbidden without replacement) |
| Reduced motion      | `@media (prefers-reduced-motion: reduce)` disables transitions, including the signature underline (see `rules/css.md`) |

> Contrast figures are computed estimates, not tool-measured. Phase 1 runs the AA check on: text/bg, text-subtle/bg, accent/bg, text-on-primary/accent, and each derived semantic pair; it reports failures without blocking.

---

## 13. LAYERING (z-index scale)

Unchanged scale. CSS overlays (`position: fixed`/`absolute`) require explicit `z-index`; order from back to front, and a persistent `danger` toast must never be hidden, so toasts sit above modals. v2.0 note: a floating layer is marked by its stroke — `--border-strong` (or the toast's semantic accent) — plus `--bg-elevated` on the surfaces that use it (drawer); **never** by a shadow.

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

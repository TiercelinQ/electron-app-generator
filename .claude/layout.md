# Layout System — v4.0 (Electron)

> Companion layout reference — not a constraint. This file provides: (1) a **proposed default
> composition** and a **catalog of alternative composition patterns** (§12) that Claude co-designs
> from in Phase 3, the user amending or replacing freely;
> (2) the **feedback spec** (toasts, modals) serving the error contract; (3) **defaults and
> technical recommendations** (dimensions, behaviors) — never a composition restriction.
> The retained composition is the one validated in `docs/specs/03-surfaces.md` and locked in
> `docs/specs/04-architect.md`.
> Built on `design-system.md v1.6 (Electron)`. The two files are inseparable.

## Changelog

| Version | Date       | Main change                                                                                                                        |
| ------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| v4.0    | 2026-07-14 | Composition pattern catalog (§12): vertical sidebar, menu bar, master-detail alternatives; Phase 3 becomes a guided co-design flow |
| v3.0    | 2026-07-13 | Non-binding composition: mandatory skeleton becomes the proposed default; caps become defaults/recommendations                     |
| v2.2    | 2026-07-02 | 6 toast positions (Phase 3 choice) · toast position preference — parity with the Python generator                                  |
| v2.1    | 2026-06-14 | statusbar text `--text-subtle` (WCAG) · dark surface ramp · layering reference                                                     |
| v2.0    | initial    | Global structure, topbar, drawer, statusbar, recurring components                                                                  |

Every generated application references the active version in its `README.md`.

---

## 1. GLOBAL STRUCTURE

Proposed default composition — submitted in Phase 3, amendable or replaceable by the user.

```
┌─────────────────────────────────────────────────────┐
│              TOPBAR (48px)                          │
│  [ Logo / Name ]  [ Nav tabs ]  [ Theme ]          │
├─────────────────────────────────────────────────────┤
│                                                     │
│            MAIN CONTENT                             │
│            (scrollable area)                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                STATUSBAR (28px)                     │
└─────────────────────────────────────────────────────┘
```

Proposed default HTML skeleton (`App.tsx` component):

```
<div id="app-shell">          grid rows: var(--topbar-height) 1fr var(--statusbar-height)
  <header id="topbar">
  <main id="main-content">
  <footer id="statusbar">
  <div id="toast-container">  overlaid (position: fixed)
  <aside id="drawer">         overlaid (optional)
</div>
```

**Right drawer** (optional, over the content):

```
┌─────────────────────────────────────────────────────┐
│                     TOPBAR                          │
├───────────────────────────────┬─────────────────────┤
│                               │                     │
│       MAIN CONTENT            │  DRAWER (320px)     │
│       (reduced)               │  sliding            │
│                               │                     │
├───────────────────────────────┴─────────────────────┤
│                   STATUSBAR                         │
└─────────────────────────────────────────────────────┘
```

**Toast** (overlaid, top-right corner):

```
┌─────────────────────────────────────────────────────┐
│                     TOPBAR              [ Toast 1 ] │
├─────────────────────────────────────────[ Toast 2 ]─┤
│                                                     │
│            MAIN CONTENT                             │
│                                                     │
├─────────────────────────────────────────────────────┤
│                   STATUSBAR                         │
└─────────────────────────────────────────────────────┘
```

---

## 2. WINDOW (BrowserWindow)

Default values — customizable in Phase 3.

| Token / option    | Default                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `minWidth`        | 1024                                                                    |
| `minHeight`       | 768                                                                     |
| state on launch   | restored (position + size) via preferences                              |
| theme on launch   | follows the OS theme (`nativeTheme.shouldUseDarkColors`)                |
| OS default theme  | light                                                                   |
| `show`            | `false` then `ready-to-show` (zero white flash)                         |
| `backgroundColor` | current theme `--bg` (anti-flash)                                       |
| `autoHideMenuBar` | `true` — no native Windows menu                                         |
| `webPreferences`  | locked — see `rules/security.md`                                        |
| `icon`            | `resources/icon.ico` (provided by the user, otherwise Electron default) |

---

## 3. TOPBAR

| Token              | Default                  |
| ------------------ | ------------------------ |
| height             | `--topbar-height` = 48px |
| light mode bg      | `--bg` = #FFFFFF         |
| dark mode bg       | `--bg` = #1C1C1C         |
| bottom border      | 1px `--border`           |
| horizontal padding | `--spacing-4` = 16px     |

### Topbar zones (left → right)

```
[ Logo / App name ]  [ Navigation tabs ]  ···  [ Theme ]
```

| Zone   | Content                   | Width        |
| ------ | ------------------------- | ------------ |
| Left   | SVG logo 24px + app name  | fixed        |
| Center | Navigation tabs (`<nav>`) | flexible     |
| Right  | Light/dark theme selector | fixed — 40px |

### Logo / App name

- SVG icon `--icon-lg` (24px) + label `--weight-semibold` `--font-base` (16px).
- Color: `--text`.
- Not clickable.

### Navigation tabs (`<nav id="topbar-tabs">`)

- `<button class="tab">` buttons — never `<a href>` (technical constraint: no real navigation, single-page app).
- Embedded in the topbar, center-aligned.
- 5 visible tabs recommended at most; beyond, a `···` dropdown menu keeps the topbar readable.
- Active tab (`.is-active`): `--primary` text, 2px `--primary` bottom border.
- Inactive tab: `--text-subtle` text, transparent background.
- Hover: `--bg-muted` background, `--transition-default` transition.
- Font: `--weight-medium` `--font-sm` (14px).
- Tab height: `--topbar-height` = 48px (full topbar height).
- Horizontal padding per tab: `--spacing-4` = 16px.
- Active content rendered by React (state `activeTab`) — a single tab mounted at a time.

### Theme selector

- Icon only (fa-sun / fa-moon), size `--icon-lg` = 24px.
- Mandatory `title`: "Passer en mode sombre" / "Passer en mode clair".
- Instant toggle — `data-theme` switched on `<html>` + persisted in preferences via IPC.

---

## 4. MAIN CONTENT AREA

| Token             | Default                            |
| ----------------- | ---------------------------------- |
| light mode bg     | `--bg` = #FFFFFF                   |
| dark mode bg      | `--bg` = #1C1C1C                   |
| inner padding     | `--spacing-6` = 24px               |
| scroll            | vertical — `overflow-y: auto`      |
| max content width | `--content-xl` = 1024px (centered) |

### Section header

```
[ Section title ]   [ Subtitle / short description ]
```

- Title: `--weight-bold` `--font-2xl` (24px), color `--text`.
- Subtitle: `--weight-normal` `--font-sm` (14px), color `--text-subtle`.
- Bottom margin: `--spacing-6` = 24px before the content.

---

## 5. TOAST

Fully replaces the inline banner. No inline banner in the applications.
Component: `views/ToastManager.tsx` — queue in React state, `#toast-container` container in `position: fixed`.

### Position — Phase 3 choice

6 positions available. Default: `top-right`.

| Position        | Anchor          | Enter animation       | Exit animation     |
| --------------- | --------------- | --------------------- | ------------------ |
| `top-right`     | top + right     | Slide from the right  | Fade + slide right |
| `top-left`      | top + left      | Slide from the left   | Fade + slide left  |
| `top-center`    | top + center    | Slide from the top    | Fade + slide up    |
| `bottom-right`  | bottom + right  | Slide from the right  | Fade + slide right |
| `bottom-left`   | bottom + left   | Slide from the left   | Fade + slide left  |
| `bottom-center` | bottom + center | Slide from the bottom | Fade + slide down  |

### Margins and stacking

| Token                          | Value                                        |
| ------------------------------ | -------------------------------------------- |
| width                          | 320px (fixed)                                |
| margin from edge               | `--spacing-4` = 16px                         |
| margin from topbar / statusbar | `--spacing-4` = 16px (per top/bottom anchor) |
| spacing between toasts         | `--spacing-2` = 8px                          |
| stacking                       | Vertical, queue, no overlap                  |
| stacking direction (top)       | new toast on top, older ones descend         |
| stacking direction (bottom)    | new toast at bottom, older ones rise         |
| transition duration            | `--transition-slow` = 250ms                  |

### Implementation

- The `ToastManager` (`views/ToastManager.tsx`) anchors `#toast-container` per `TOAST_POSITION`.
- `TOAST_POSITION` (`src/shared/config.ts`) = `"top-right"` by default, modified per Phase 3 choice.
- Each anchor is a named CSS rule in `styles.css` (position classes on `#toast-container` — no inline style, `@rules/css.md`).

### Display durations

| Type      | Duration   | Manual dismiss    |
| --------- | ---------- | ----------------- |
| `success` | 4s         | No                |
| `info`    | 4s         | No                |
| `warning` | 6s         | Yes (×)           |
| `danger`  | persistent | Yes (×) mandatory |

### Toast anatomy

```
┌────────────────────────────────────┐
│ [icon]  Main message           [×] │
│         Optional description       │
└────────────────────────────────────┘
```

| Token            | Value                                            |
| ---------------- | ------------------------------------------------ |
| padding          | `--spacing-3` vertical, `--spacing-4` horizontal |
| left border      | 4px semantic color                               |
| bg               | semantic bg (`--*-50`)                           |
| message font     | `--weight-medium` `--font-sm` (14px)             |
| description font | `--weight-normal` `--font-xs`, `--text-subtle`   |
| icon             | `--icon-md` = 20px                               |

| Type      | Bg             | Border          | Icon (Font Awesome)       |
| --------- | -------------- | --------------- | ------------------------- |
| `success` | `--success-50` | `--success-600` | `fa-circle-check`         |
| `warning` | `--warning-50` | `--warning-600` | `fa-triangle-exclamation` |
| `danger`  | `--danger-50`  | `--danger-600`  | `fa-circle-exclamation`   |
| `info`    | `--info-50`    | `--info-600`    | `fa-circle-info`          |

> `--*-50` is the toast surface role: pale tint in light, deep tint in dark (redefined in `[data-theme="dark"]`, see `design-system.md §2`). Toast message text uses `--text`. Toast icons use the matching `--icon-*` token. Toast icon colors: success `--icon-success`, warning `--icon-warning`, danger `--icon-danger`, info `--icon-info`.
> Layering: `#toast-container` uses `--z-toast` (400), above modals (`design-system.md §13`), so a persistent `danger` toast is never hidden.

---

## 6. RIGHT DRAWER

Optional component. Default values below.

| Token         | Default                                                                     |
| ------------- | --------------------------------------------------------------------------- |
| width         | `--drawer-width` = 320px                                                    |
| animation     | slide from the right, `--transition-slow` = 250ms (`transform: translateX`) |
| light mode bg | `--bg-elevated` = #FFFFFF                                                   |
| dark mode bg  | `--bg-elevated` = #353535                                                   |
| left border   | 1px `--border`                                                              |
| padding       | `--spacing-6` = 24px                                                        |
| overlay bg    | `--text` 40% opacity                                                        |

- Opened by explicit action only. Never automatically.
- Close: click overlay, Escape key, or × button in the drawer.
- Drawer header: `--weight-semibold` `--font-lg` (18px) title + × button aligned right.
- Drawer content: vertically scrollable on overflow.

---

## 7. STATUSBAR

Default values below.

| Token              | Default                       |
| ------------------ | ----------------------------- |
| height             | `--statusbar-height` = 28px   |
| light mode bg      | `--bg-muted` = #F3F4F6        |
| dark mode bg       | `--bg-muted` = #3F3F3F        |
| top border         | 1px `--border`                |
| horizontal padding | `--spacing-4` = 16px          |
| font               | `--weight-normal` `--font-xs` |
| text color         | `--text-subtle`               |

> WCAG: `--text-subtle` on `--bg-muted` reaches ~4.4:1, marginal vs AA (4.5:1). Essential or error status uses `--text` for full contrast. `--text-muted` is reserved for disabled/decorative use (see `design-system.md §12`).

### Statusbar zones (left → right)

```
[ Status message ]  ···  [ Progress ]  [ Contextual info ]
```

| Zone   | Content                                                                   |
| ------ | ------------------------------------------------------------------------- |
| Left   | Current status message ("Prêt", "Chargement…", "3 éléments sélectionnés") |
| Center | Compact `<progress>` (8px) — visible only when an operation is running    |
| Right  | Fixed contextual info (record count, version, DB connection…)             |

---

## 8. RECURRING COMPONENTS

### Data table (`<table class="data-table">`)

- Header: `--bg-subtle` bg, `--weight-semibold` `--font-sm`, `--text-subtle`.
- Header bottom border: 2px `--border-strong`.
- Row: dynamic height (vertical padding `--spacing-2` = 8px), 1px `--border-subtle` bottom border.
- Columns: dynamic width (`table-layout: auto`). Exception: actions column — fixed width per content.
- Selected row (`.is-selected`): `--primary-bg` bg.
- Row hover: `--bg-muted` bg.
- Row alternation: disabled (flat design).
- Pagination below the table recommended beyond ~50 rows.

### Input form

- Labels above the fields (`<label>` linked via `htmlFor`), `--weight-medium` `--font-sm`, `--text`.
- Fields: `width: 100%` in their container, dynamic height (vertical padding `--spacing-2` = 8px).
- Spacing between fields: `--spacing-4` = 16px.
- Field in error (`.has-error`): 2px `--danger-600` border + `--danger-600` message below the field, `--font-xs`.
- Form actions: aligned right — Cancel (`.btn-secondary`) + Confirm (`.btn-primary`), dynamic width per label.
- Submission via `onSubmit` + `preventDefault` — never navigation.

### Tree view (`<ul class="tree">`)

- Indentation per level: `--spacing-4` = 16px.
- Expand/collapse icon: Font Awesome chevron, `--icon-sm` = 16px, `--text-muted`.
- Item height: dynamic (vertical padding `--spacing-1` = 4px).
- Selected item (`.is-selected`): `--primary-bg` bg.

### Charts / Visualization

- Background: transparent (inherits the main content).
- Palette: `--chart-primary`, `--chart-success`, `--chart-warning`, `--chart-danger`, `--chart-info`.
- Legend: `--weight-normal` `--font-sm`, `--text-subtle`.
- No shadow (flat design).
- Chart library: to validate in Phase 1 (none by default).

### Modal

```
┌─────────────────────────────────────┐
│  Modal title                    [×] │
├─────────────────────────────────────┤
│                                     │
│  Content (form, text…)              │
│                                     │
├─────────────────────────────────────┤
│              [ Cancel ] [ Confirm ] │
└─────────────────────────────────────┘
```

Controlled React component (state `isOpen`) — `<div class="modal-overlay"><div class="modal">`.

| Token         | Default                        |
| ------------- | ------------------------------ |
| width         | dynamic per content, min 480px |
| light mode bg | `--bg` = #FFFFFF               |
| dark mode bg  | `--bg` = #1C1C1C               |
| border        | 1px `--border`                 |
| padding       | `--spacing-6` = 24px           |
| overlay bg    | `--text` 40% opacity           |

- Opened by explicit action only.
- Close: × button, Cancel, Escape key, or click overlay.
- Header: `--weight-semibold` `--font-lg` title + × button on the right, 1px `--border-subtle` bottom border.
- Footer: actions on the right — Cancel (secondary) + Confirm (primary), 1px `--border-subtle` top border.
- Content: vertically scrollable on overflow.
- Zero `alert()` / `confirm()` / `dialog.showMessageBox` — always this styled modal.

### Pagination

Shown below a table when it grows long — beyond ~50 rows by default.

```
[ ← ]  [ 1 ]  [ 2 ]  [ 3 ]  ···  [ 12 ]  [ → ]
                  Page 2 sur 12
```

| Token              | Default                                                 |
| ------------------ | ------------------------------------------------------- |
| position           | below the table, aligned right                          |
| spacing from table | `--spacing-4` = 16px                                    |
| page button        | dynamic per number, padding `--spacing-2` horizontal    |
| active button      | `--primary-bg` bg, `--primary` text                     |
| inactive button    | transparent, `--text-subtle` text                       |
| button hover       | `--bg-muted` bg                                         |
| ← → buttons        | `--icon-sm` icons, disabled on first/last page          |
| page label         | `--weight-normal` `--font-xs`, `--text-muted`, centered |
| visible pages      | 5 numbers by default — `···` ellipsis beyond            |

---

## 9. GLOBAL KEYBOARD NAVIGATION

Default shortcuts — customizable in Phase 3.

| Shortcut            | Action                                 |
| ------------------- | -------------------------------------- |
| `Tab` / `Shift+Tab` | Navigate between interactive elements  |
| `Enter` / `Space`   | Activate focused button / item         |
| `Escape`            | Close active drawer / modal / dropdown |
| `Alt+1…9`           | Direct navigation to tab N             |
| `Ctrl+,`            | Open Settings                          |

Implementation: `keydown` listeners in the renderer. Global shortcuts do not go through `globalShortcut` (reserved for out-of-focus shortcuts, not required here).

---

## 10. PERSISTED PREFERENCES

`preferences.json` file in `app.getPath("userData")` — read/written **only by the main process** (`preferences.model.ts`), exposed to the renderer via IPC.

| Preference         | Default value |
| ------------------ | ------------- |
| theme              | OS system     |
| window size        | 1280×800      |
| window position    | centered      |
| drawer state       | closed        |
| language (if i18n) | fr            |
| toast position     | top-right     |

---

## 11. DESIGN SYSTEM CROSS-REFERENCE

This file does not redefine tokens — it consumes them. Every visual value is traced to `design-system.md v1.6 (Electron)`.

| Need                       | Token                                              |
| -------------------------- | -------------------------------------------------- |
| Main background            | `--bg`                                             |
| Secondary areas background | `--bg-subtle`                                      |
| Drawer background          | `--bg-elevated`                                    |
| Primary text               | `--text`                                           |
| Secondary text             | `--text-subtle`                                    |
| Borders                    | `--border` / `--border-subtle` / `--border-strong` |
| Active / selection color   | `--primary` / `--primary-bg`                       |
| Focus                      | `--focus-ring` 2px offset 2px                      |
| Panel transitions          | `--transition-slow` = 250ms                        |
| State transitions          | `--transition-default` = 150ms                     |
| Shape                      | `--radius` = 0px (flat design)                     |
| Shadows                    | none (flat design)                                 |
| Line-height                | `--leading-tight` 1.25 / `--leading-normal` 1.5    |
| Overlay opacity            | `--opacity-overlay` 0.4 (`--text` color)           |
| Stacking order             | `--z-*` layering scale (`design-system.md §13`)    |

---

## 12. COMPOSITION PATTERNS

Catalog of alternative composition patterns for the Phase 3 co-design flow. The default composition (§1-§10) is pattern **P1**. Each pattern below is a starting point the user may amend or replace; dimensions are defaults. The retained composition is recorded in `docs/specs/03-surfaces.md` and locked in `docs/specs/04-architect.md`. The feedback spec (§5 toasts, §8 modals) applies to every pattern.

### P1 — Topbar + tabs (default)

Horizontal navigation embedded in the topbar — the composition proposed by default in Phase 3.

**Structure**: see §1 (shell, drawer, toast overlay) and §3 (topbar zones, tabs, theme selector). Not repeated here.

| Element         | Default                                                       |
| --------------- | ------------------------------------------------------------- |
| topbar          | `--topbar-height` = 48px — §3                                 |
| navigation tabs | centered in the topbar, 5 visible at most (`···` beyond) — §3 |
| statusbar       | `--statusbar-height` = 28px — §7                              |

**When to recommend**: 2-5 top-level views of comparable weight, flat hierarchy, no sub-navigation.

**Implementation notes**: anchors `#app-shell`, `#topbar`, `#topbar-tabs`, `#main-content`, `#statusbar` (§1). A single tab is mounted at a time (React `activeTab` state).

**Interactions**: toasts (§5), drawer (§6), statusbar (§7), and modals (§8) unchanged. Master-detail (P4) may be used inside a tab.

### P2 — Vertical sidebar

Left navigation column — for many sections, or sections carrying sub-items.

**Structure**

```
┌──────────┬──────────────────────────────────────────┐
│ SIDEBAR  │        TOPBAR (reduced, optional)        │
│ (240px)  ├──────────────────────────────────────────┤
│          │                                          │
│ [ico] …  │            MAIN CONTENT                  │
│ [ico] …  │            (scrollable area)             │
│ [ico] …  │                                          │
├──────────┴──────────────────────────────────────────┤
│                 STATUSBAR (28px)                    │
└─────────────────────────────────────────────────────┘
```

Proposed HTML skeleton (`App.tsx` component):

```
<div id="app-shell">          grid columns: 240px 1fr (sidebar default width)
  <nav id="sidebar">
  <header id="topbar">        reduced (title + global actions) — optional
  <main id="main-content">
  <footer id="statusbar">
  <div id="toast-container">  overlaid (position: fixed)
  <aside id="drawer">         overlaid (optional)
</div>
```

| Element               | Default                                                                |
| --------------------- | ---------------------------------------------------------------------- |
| width (expanded)      | 240px                                                                  |
| width (collapsed)     | icons only — `--icon-lg` + `--spacing-4` padding on each side          |
| bg                    | `--bg-subtle`                                                          |
| right border          | 1px `--border`                                                         |
| item                  | icon `--icon-md` (20px) + label `--weight-medium` `--font-sm` (14px)   |
| item vertical padding | `--spacing-2` = 8px                                                    |
| active item           | `--primary` text, `--bg-muted` background                              |
| inactive item         | `--text-subtle` text, transparent background                           |
| hover                 | `--bg-muted` background, `--transition-default`                        |
| collapse toggle       | optional — state persisted like the drawer (§10)                       |
| topbar (if kept)      | reduced to app name + global actions (theme), `--topbar-height` = 48px |

**When to recommend**: more than 5 top-level views; grouped sections or sub-items; long labels that would crowd a topbar; a navigation the user wants always visible.

**Implementation notes**: anchor `#sidebar` (`<nav>`), items are `<button class="nav-item">` — never `<a href>` (technical constraint: single-page app, no real navigation, same as §3). `#app-shell` becomes a 2-column grid. The collapsed state is a persisted preference (§10), like the drawer.

**Interactions**: toasts (§5) keep their 6 positions and their margins; the drawer (§6) still overlays the content; the statusbar (§7) spans the full width. Master-detail (P4) may compose inside `#main-content`.

### P3 — Menu bar

A classic File/Edit/View command bar above the content — for command-driven, document-oriented apps.

**Structure**

```
┌─────────────────────────────────────────────────────┐
│  File   Edit   View   Help          MENU BAR (32px) │
├─────────────────────────────────────────────────────┤
│              TOPBAR (optional)                      │
├─────────────────────────────────────────────────────┤
│            MAIN CONTENT                             │
│            (scrollable area)                        │
├─────────────────────────────────────────────────────┤
│                STATUSBAR (28px)                     │
└─────────────────────────────────────────────────────┘
```

| Element          | Default                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| height           | 32px                                                                   |
| bg               | `--bg`                                                                 |
| bottom border    | 1px `--border`                                                         |
| menu label       | `--weight-medium` `--font-sm` (14px), `--text`                         |
| label padding    | `--spacing-2` vertical, `--spacing-3` horizontal                       |
| label hover/open | `--bg-muted` background                                                |
| open panel       | `--bg-elevated` bg, 1px `--border`, min-width 200px                    |
| panel item       | `--font-sm`, padding `--spacing-2` / `--spacing-4`, hover `--bg-muted` |
| separator        | 1px `--border-subtle`                                                  |
| disabled item    | `--text-muted`, not clickable                                          |
| layering         | `--z-*` scale (`design-system.md §13`) — never a hardcoded value       |

**When to recommend**: many commands for few views (editor, document tool, admin console); actions that do not map onto navigation tabs; users expecting the File/Edit/View convention.

**Implementation notes**: anchor `#menubar`. **Technical constraint**: this is a custom in-app menu styled with tokens, not the native OS menu — the native `Menu` cannot be styled and would break the design system, so `autoHideMenuBar: true` stays (§2). Panels open on click, close on Escape / outside click (§9), and read the `--z-*` tokens (no inline style, `@rules/css.md`). Menu items dispatch to renderer state or `window.api` — never to an Electron `role`-based native menu.

**Interactions**: toasts (§5), drawer (§6), statusbar (§7), and modals (§8) unchanged. The menu bar is a **command** surface: it composes with a navigation surface (tabs P1 or sidebar P2) rather than replacing it.

### P4 — Master-detail

List panel + detail panel — for one dominant entity browsed and inspected item by item.

**Structure**

```
┌─────────────────────────────────────────────────────┐
│                     TOPBAR                          │
├────────────────────┬────────────────────────────────┤
│  MASTER LIST       │  DETAIL PANE                   │
│  (320px)           │  (flexible)                    │
│  [ item ]          │  [ title + item actions ]      │
│  [ item selected ] │  [ fields / sections ]         │
│  [ item ]          │                                │
├────────────────────┴────────────────────────────────┤
│                   STATUSBAR                         │
└─────────────────────────────────────────────────────┘
```

| Element             | Default                                                    |
| ------------------- | ---------------------------------------------------------- |
| master list width   | 320px                                                      |
| resizable split     | optional — 4px drag handle, `--border`                     |
| list bg             | `--bg-subtle`                                              |
| separator           | 1px `--border`                                             |
| list item padding   | `--spacing-2` vertical, `--spacing-4` horizontal           |
| list item separator | 1px `--border-subtle`                                      |
| selected item       | `--primary-bg` background (same role as the table row, §8) |
| item hover          | `--bg-muted` background                                    |
| detail padding      | `--spacing-6` = 24px                                       |
| empty state         | centered message, `--text-subtle` `--font-sm`              |
| list header actions | add / refresh — top of the list panel                      |

**When to recommend**: a dominant entity listed and inspected/edited one at a time (records, orgs, files); the user needs the list and the detail visible together; it replaces the table → modal round trip.

**Implementation notes**: anchors `#master-list` and `#detail-pane`, two zones inside `#main-content` (flex or grid). Selection lives in React state; the detail pane renders the selected id and an explicit empty state when nothing is selected. Item actions live in the detail header, list-level actions in the list header.

**Interactions**: composes inside the content area of P1, P2, or P3. Toasts (§5) and modals (§8) unchanged — a destructive confirmation stays a styled modal (§8). The right drawer (§6) is usually redundant with the detail pane: pick one.

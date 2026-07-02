# Layout System — v2.2 (Electron)

> Binding reference for all Node.js/Electron/React applications.
> Built on `design-system.md v1.6 (Electron)`. The two files are inseparable.

## Changelog

| Version | Date       | Main change                                                                |
| ------- | ---------- | -------------------------------------------------------------------------- |
| v2.2    | 2026-07-02 | 6 toast positions (Phase 3 choice) · toast position preference — parity with the Python generator |
| v2.1    | 2026-06-14 | statusbar text `--text-subtle` (WCAG) · dark surface ramp · layering reference |
| v2.0    | initial    | Global structure, topbar, drawer, statusbar, recurring components           |

Every generated application references the active version in its `README.md`.

---

## 1. GLOBAL STRUCTURE

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

Mandatory HTML skeleton (`App.tsx` component):

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

| Token / option      | Value                                                                  |
| ------------------- | ----------------------------------------------------------------------- |
| `minWidth`          | 1024                                                                    |
| `minHeight`         | 768                                                                     |
| state on launch     | restored (position + size) via preferences                              |
| theme on launch     | follows the OS theme (`nativeTheme.shouldUseDarkColors`)                |
| OS default theme    | light                                                                   |
| `show`              | `false` then `ready-to-show` (zero white flash)                         |
| `backgroundColor`   | current theme `--bg` (anti-flash)                                       |
| `autoHideMenuBar`   | `true` — no native Windows menu                                         |
| `webPreferences`    | locked — see `rules/security.md`                                        |
| `icon`              | `resources/icon.ico` (provided by the user, otherwise Electron default) |

---

## 3. TOPBAR

| Token              | Value                    |
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

| Zone   | Content                         | Width       |
| ------ | ------------------------------- | ----------- |
| Left   | SVG logo 24px + app name        | fixed       |
| Center | Navigation tabs (`<nav>`)       | flexible    |
| Right  | Light/dark theme selector       | fixed — 40px |

### Logo / App name

- SVG icon `--icon-lg` (24px) + label `--weight-semibold` `--font-base` (16px).
- Color: `--text`.
- Not clickable.

### Navigation tabs (`<nav id="topbar-tabs">`)

- `<button class="tab">` buttons — never `<a href>` (no real navigation, single-page app).
- Embedded in the topbar, center-aligned.
- Maximum 5 visible tabs. Beyond → `···` dropdown menu.
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

| Token               | Value                            |
| ------------------- | -------------------------------- |
| light mode bg       | `--bg` = #FFFFFF                 |
| dark mode bg        | `--bg` = #1C1C1C                 |
| inner padding       | `--spacing-6` = 24px             |
| scroll              | vertical — `overflow-y: auto`    |
| max content width   | `--content-xl` = 1024px (centered) |

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

| Position       | Anchor              | Enter animation                | Exit animation                  |
| -------------- | ------------------- | ------------------------------ | ------------------------------- |
| `top-right`    | top + right         | Slide from the right           | Fade + slide right              |
| `top-left`     | top + left          | Slide from the left            | Fade + slide left               |
| `top-center`   | top + center        | Slide from the top             | Fade + slide up                 |
| `bottom-right` | bottom + right      | Slide from the right           | Fade + slide right              |
| `bottom-left`  | bottom + left       | Slide from the left            | Fade + slide left               |
| `bottom-center`| bottom + center     | Slide from the bottom          | Fade + slide down               |

### Margins and stacking

| Token                            | Value                                                  |
| -------------------------------- | ------------------------------------------------------ |
| width                            | 320px (fixed)                                          |
| margin from edge                 | `--spacing-4` = 16px                                   |
| margin from topbar / statusbar   | `--spacing-4` = 16px (per top/bottom anchor)           |
| spacing between toasts           | `--spacing-2` = 8px                                    |
| stacking                         | Vertical, queue, no overlap                            |
| stacking direction (top)         | new toast on top, older ones descend                   |
| stacking direction (bottom)      | new toast at bottom, older ones rise                   |
| transition duration              | `--transition-slow` = 250ms                            |

### Implementation

- The `ToastManager` (`views/ToastManager.tsx`) anchors `#toast-container` per `TOAST_POSITION`.
- `TOAST_POSITION` (`src/shared/config.ts`) = `"top-right"` by default, modified per Phase 3 choice.
- Each anchor is a named CSS rule in `styles.css` (position classes on `#toast-container` — no inline style, `@rules/css.md`).

### Display durations

| Type      | Duration   | Manual dismiss      |
| --------- | ---------- | ------------------- |
| `success` | 4s         | No                  |
| `info`    | 4s         | No                  |
| `warning` | 6s         | Yes (×)             |
| `danger`  | persistent | Yes (×) mandatory   |

### Toast anatomy

```
┌────────────────────────────────────┐
│ [icon]  Main message           [×] │
│         Optional description       │
└────────────────────────────────────┘
```

| Token              | Value                                            |
| ------------------ | ------------------------------------------------ |
| padding            | `--spacing-3` vertical, `--spacing-4` horizontal |
| left border        | 4px semantic color                               |
| bg                 | semantic bg (`--*-50`)                           |
| message font       | `--weight-medium` `--font-sm` (14px)             |
| description font   | `--weight-normal` `--font-xs`, `--text-subtle`   |
| icon               | `--icon-md` = 20px                               |

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

| Token            | Value                                                                             |
| ---------------- | ---------------------------------------------------------------------------------- |
| width            | `--drawer-width` = 320px                                                           |
| animation        | slide from the right, `--transition-slow` = 250ms (`transform: translateX`)         |
| light mode bg    | `--bg-elevated` = #FFFFFF                                                          |
| dark mode bg     | `--bg-elevated` = #353535                                                          |
| left border      | 1px `--border`                                                                     |
| padding          | `--spacing-6` = 24px                                                               |
| overlay bg       | `--text` 40% opacity                                                               |

- Opened by explicit action only. Never automatically.
- Close: click overlay, Escape key, or × button in the drawer.
- Drawer header: `--weight-semibold` `--font-lg` (18px) title + × button aligned right.
- Drawer content: vertically scrollable on overflow.

---

## 7. STATUSBAR

| Token              | Value                         |
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
- Pagination below the table if > 50 rows.

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

| Token            | Value                              |
| ---------------- | ---------------------------------- |
| width            | dynamic per content, min 480px     |
| light mode bg    | `--bg` = #FFFFFF                   |
| dark mode bg     | `--bg` = #1C1C1C                   |
| border           | 1px `--border`                     |
| padding          | `--spacing-6` = 24px               |
| overlay bg       | `--text` 40% opacity               |

- Opened by explicit action only.
- Close: × button, Cancel, Escape key, or click overlay.
- Header: `--weight-semibold` `--font-lg` title + × button on the right, 1px `--border-subtle` bottom border.
- Footer: actions on the right — Cancel (secondary) + Confirm (primary), 1px `--border-subtle` top border.
- Content: vertically scrollable on overflow.
- Zero `alert()` / `confirm()` / `dialog.showMessageBox` — always this styled modal.

### Pagination

Shown below a table containing more than 50 rows.

```
[ ← ]  [ 1 ]  [ 2 ]  [ 3 ]  ···  [ 12 ]  [ → ]
                  Page 2 sur 12
```

| Token                   | Value                                                    |
| ----------------------- | -------------------------------------------------------- |
| position                | below the table, aligned right                           |
| spacing from table      | `--spacing-4` = 16px                                     |
| page button             | dynamic per number, padding `--spacing-2` horizontal     |
| active button           | `--primary-bg` bg, `--primary` text                      |
| inactive button         | transparent, `--text-subtle` text                        |
| button hover            | `--bg-muted` bg                                          |
| ← → buttons             | `--icon-sm` icons, disabled on first/last page           |
| page label              | `--weight-normal` `--font-xs`, `--text-muted`, centered  |
| max visible pages       | 5 numbers — `···` ellipsis beyond                        |

---

## 9. GLOBAL KEYBOARD NAVIGATION

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

| Preference         | Default value     |
| ------------------ | ----------------- |
| theme              | OS system         |
| window size        | 1280×800          |
| window position    | centered          |
| drawer state       | closed            |
| language (if i18n) | fr                |
| toast position     | top-right         |

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
```


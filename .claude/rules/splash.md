# Splash screen rules — Electron app

> Conditional — only when Phase 3 "Splash screen" = `Yes`. A splash is a short launch window shown while the main window boots, then dismissed. Opt-in, decided in Phase 3, locked in the Phase 4 contract, implemented in Phase 5. When disabled: no splash file, no config constant, the main window shows normally.

The splash follows the design system (flat, palette, dark mode) exactly like the rest of the UI — zero hardcoded visual value, colors read from `tokens.css`. It shows the **application icon if one is defined**, otherwise the application name centered (text-only).

## Icon source

- The splash reuses the **application icon** captured in Phase 1 (`resources/icon.ico`).
- If no icon was defined in Phase 1 and the splash is enabled, Phase 3 offers an **optional icon path** (free-form). A provided image is saved as `resources/icon.ico` and becomes the app icon everywhere (window/taskbar via `BrowserWindow` `icon`, packaging via `electron-builder.yml`) — not a splash-only asset.
- No icon at all → the splash shows the application name only. Never a placeholder image.

## Files

| File | Role |
| ---- | ---- |
| `src/renderer/splash.html` | Standalone splash markup — links `tokens.css` + `splash.css`, references the icon via a relative path, loads `splash.ts`. No React, no `window.api`. |
| `src/renderer/src/styles/splash.css` | Splash rules — consumes only `var(--token)` from `tokens.css` (`@rules/css.md`). Flat, centered layout. |
| `src/renderer/src/splash.ts` | Reads the theme from the URL (`?theme=dark`) and sets `document.documentElement.dataset.theme` so `tokens.css` `[data-theme="dark"]` applies. Zero other logic. |

`splash.html` is a **second renderer entry** in `electron.vite.config.ts` (`build.rollupOptions.input`: `{ index: …/index.html, splash: …/splash.html }`) so electron-vite builds it alongside the main renderer. See `@rules/config.md`.

## Config constants — `src/shared/config.ts`

```ts
// Splash (if enabled in Phase 3) — minimum on-screen time before dismissal
export const SPLASH_MIN_DURATION_MS = 1200;
```

The min duration avoids a flash on fast startup: the splash stays at least `SPLASH_MIN_DURATION_MS`, then closes once the main window is ready.

## Main-process orchestration — `src/main/index.ts`

The splash is created and dismissed by the composition root (`index.ts`), before the main window is shown:

- Create the main `BrowserWindow` with `show: false` (locked `webPreferences`, `@rules/security.md`).
- Determine the startup theme (`dark`/`light`): the persisted `theme` preference if preferences are enabled (`preferences.model.ts`), otherwise `nativeTheme.shouldUseDarkColors`.
- Create a **frameless splash `BrowserWindow`**: `frame: false`, `resizable: false`, `backgroundColor` set to the themed background hex (no white flash), centered, small fixed size. Its `webPreferences` keep the security defaults (`contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`) — **no preload, no IPC** (the splash needs none). Load the built `splash.html` with `?theme=dark|light`.
- When the main window emits `ready-to-show`, dismiss the splash and show the main window only after `SPLASH_MIN_DURATION_MS` has elapsed since the splash appeared (whichever is later), then `splash.close()` + `mainWindow.show()`.

```ts
// principle — inside app.whenReady()
const shownAt = Date.now();
const splash = new BrowserWindow({
  width: 420, height: 260, frame: false, resizable: false, center: true,
  backgroundColor: startupTheme === "dark" ? "#1C1C1C" : "#FFFFFF", // themed bg — matches tokens
  webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
});
splash.loadFile(join(__dirname, "../renderer/splash.html"), { query: { theme: startupTheme } });

mainWindow.once("ready-to-show", () => {
  const wait = Math.max(0, config.SPLASH_MIN_DURATION_MS - (Date.now() - shownAt));
  setTimeout(() => { if (!splash.isDestroyed()) splash.close(); mainWindow.show(); }, wait);
});
```

- The `backgroundColor` literals above are the themed neutrals already defined as tokens — keep them in sync with `tokens.css` `--bg` (light/dark). This is the one place a bg hex is repeated in the main (a `BrowserWindow` option cannot read CSS); comment it as sourced from `--bg`.

## Theme

- The splash respects dark mode when the theme is resolvable at startup (preference or OS). `splash.ts` sets `data-theme` from the URL param; `splash.css` consumes the same `tokens.css`, so light/dark render identically to the app.
- No `@media (prefers-color-scheme)` in `splash.css` — theming is `data-theme`, consistent with `@rules/css.md`.

## Security / CSP

- `splash.html` carries the **same strict CSP** as `index.html` (`@rules/security.md §4`): `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'`. `splash.ts` is same-origin (`script-src 'self'`), the icon is a local `img-src 'self'` resource — no remote resource.
- The splash window keeps the locked `webPreferences` and needs no preload (it exposes nothing).

## Anti-patterns — what NOT to do

- **Do not** hardcode a color/size in `splash.css` or `splash.ts` — consume `tokens.css` variables (`@rules/css.md`). The only tolerated hex is the main-process `backgroundColor` option, commented as sourced from `--bg`.
- **Do not** give the splash window a preload, IPC, or `window.api` — it renders and self-dismisses.
- **Do not** weaken the splash window's `webPreferences` (`contextIsolation`/`nodeIntegration`/`sandbox`).
- **Do not** load a remote image or font in the splash — the icon is the local `resources/icon.ico`.
- **Do not** ship the splash when Phase 3 "Splash screen" = No (no file, no `SPLASH_MIN_DURATION_MS`, no second vite entry).
- **Do not** block the main window forever if `ready-to-show` is slow — the splash closes with the main window becoming ready; it is not a modal gate.

## Integrity verification

Detailed in `@rules/verification.md`. Key points (if splash enabled): `splash.html` + `splash.css` + `splash.ts` present; `splash.html` registered as a second `rollupOptions.input` in `electron.vite.config.ts`; `SPLASH_MIN_DURATION_MS` in `config.ts`; splash created and dismissed in `src/main/index.ts` with the main window in `show: false` until `ready-to-show`; splash window `webPreferences` locked, no preload/IPC; `splash.css` consumes only tokens (no literal); splash CSP present; icon path resolved to `resources/icon.ico` or text-only fallback.

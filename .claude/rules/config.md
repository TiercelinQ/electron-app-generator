# Config, dependencies, i18n, logging, packaging rules

## `src/shared/config.ts` structure

Mandatory minimum structure in every project:

```ts
// Application
export const APP_NAME = "AppName";
export const APP_VERSION = "1.0.0";

// Database (if applicable) — relative to app.getPath("userData")
export const DB_FILENAME = "app_name.db";

// Preferences (if applicable)
export const PREFERENCES_FILENAME = "preferences.json";

// Internationalization (if enabled)
export const DEFAULT_LOCALE = "fr";
export const SUPPORTED_LOCALES = ["fr", "en"] as const;

// Window
export const WINDOW_MIN_WIDTH = 1024;
export const WINDOW_MIN_HEIGHT = 768;
export const WINDOW_DEFAULT_WIDTH = 1280;
export const WINDOW_DEFAULT_HEIGHT = 800;

// Toast position — layout.md §5 (Phase 3 choice, persisted preference)
export const TOAST_POSITION = "top-right";

// Logging — @rules/logging.md
export const LOG_LEVEL = "info";
export const LOG_MAX_BYTES = 1_000_000; // 1 MB, electron-log file rotation

// Splash (if enabled in Phase 3) — minimum on-screen time before dismissal — @rules/splash.md
export const SPLASH_MIN_DURATION_MS = 1200;
```

- Any constant reused in more than one file goes into `shared/config.ts`.
- Absolute paths (userData) are resolved **in the main only** (`app.getPath`) — never in `shared/` or the renderer.
- Zero color in `config.ts` — colors (icons included) live in `tokens.css` (difference vs the Python generator).

## IPC channels — `src/shared/ipc-channels.ts`

```ts
export const IPC = {
  PREF_GET: "pref:get",
  PREF_SET: "pref:set",
  RECORD_LIST: "record:list",
  RECORD_SAVE: "record:save",
  // if Salesforce CLI (Phase 1) — @rules/sf-cli.md
  SF_ORG_LIST: "sf:org:list",
  SF_ORG_LOGIN: "sf:org:login",
  SF_ORG_LOGOUT: "sf:org:logout",
  SF_ORG_RECONNECT: "sf:org:reconnect",
  SF_ORG_SET_DEFAULT: "sf:org:setDefault",
} as const;
```

Convention: `entity:action`. Zero hardcoded channel string outside this file. The `sf` binary path, when overridden, is a **non-secret `sfPath` key in `preferences.json`** (`preferences.model.ts`), not a `config.ts` constant — see `@rules/sf-cli.md`.

## `package.json` — mandatory scripts

```json
{
  "scripts": {
    "postinstall": "node scripts/ensure-electron.cjs",
    "dev": "electron-vite dev",
    "build": "electron-vite build",
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit -p tsconfig.node.json && tsc --noEmit -p tsconfig.web.json",
    "dist": "electron-vite build && electron-builder --win"
  }
}
```

- `postinstall` **mandatory** in every project — see the "Postinstall — Electron binary reliability" section.
- If `better-sqlite3` (native module): chain `electron-builder install-app-deps` after the reliability script → `"postinstall": "node scripts/ensure-electron.cjs && electron-builder install-app-deps"`.

## Dependency versioning

`package.json`: caret versions (`^`), pinned to the minor version validated in Phase 1. `package-lock.json` committed.

```json
"dependencies":    { "better-sqlite3": "^12.0.0", "i18next": "^26.0.0", "react-i18next": "^17.0.0",
                     "react": "^19.0.0", "react-dom": "^19.0.0", "electron-log": "^5.4.0",
                     "@fortawesome/fontawesome-free": "^6.7.2" },
"devDependencies": { "electron": "^42.0.0", "electron-vite": "^5.0.0", "electron-builder": "^26.0.0",
                     "typescript": "^6.0.0", "vite": "^7.0.0", "@vitejs/plugin-react": "^5.2.0",
                     "typescript-eslint": "^8.0.0", "eslint-plugin-react": "^7.37.5",
                     "eslint-plugin-react-hooks": "^7.0.0", "eslint": "^10.0.0", "prettier": "^3.8.0" }
```

Versioning notes:
- `@fortawesome/fontawesome-free`: **frozen on the 6.x line at `^6.7.2`** (last 6.x) — FA 7.x (currently 7.3.0) is out but introduces breaking changes on CSS class names. Do not bump to 7.x without a full audit of the classes used in `design-system.md` and `layout.md`.
- `electron-vite ^5.0.0`: peer dep `vite@"^5.0.0 || ^6.0.0 || ^7.0.0"` — **Vite 8 not supported** by the current stable (verified 2026-06: `vite` latest is 8.x, but `electron-vite@5.0.0` — the latest stable, 6.x is beta-only — still caps at vite 7). Stay on `vite ^7.0.0`. Note: a newer `vite` major being out does *not* mean it is usable here — what matters is electron-vite's peer range. Pair with `@vitejs/plugin-react ^5.2.0` (peer `vite ^4 → ^8`). **Do not** bump `@vitejs/plugin-react` to 6.x — that line requires `vite ^8` and is incompatible with vite 7 / electron-vite 5.
- `eslint-plugin-react-hooks`: version 5.x never existed — the package went from 4.6.x to 7.x. Latest stable: `7.1.1`.
- `eslint-plugin-react`: latest stable `7.37.5`.
- `typescript ^6.0.0`: `moduleResolution: classic` removed (electron-vite uses `bundler` → no impact), `esModuleInterop: false` forbidden (already true by default). Safe for any new project.
- `eslint ^10.0.0`: flat config mandatory (`eslint.config.mjs` — already the format used). Requires Node ≥ 20.19.
- `typescript-eslint ^8.0.0`: unified package for flat config — replaces the old separate `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser`. TypeScript peer dep: `>=4.8.4 <6.1.0`.
- `better-sqlite3`: native module — recompiled for Electron via `electron-builder install-app-deps` chained after `ensure-electron.cjs` in `postinstall` (see the dedicated section). To include in the last batch instructions if SQLite is selected. Versioned migrations: see `@rules/db.md`.
- **Salesforce CLI (if Phase 1 = Yes)** — add to `dependencies`: `cross-spawn ^7.0.6`; to `devDependencies`: `@types/cross-spawn ^6.0.6`. `electron-vite` bundles `cross-spawn` into the main bundle automatically; `esModuleInterop` is already on. No other runtime dependency (no `jsforce`/`@salesforce/core` — the `sf` CLI covers the v1 use cases). Detail: `@rules/sf-cli.md`.
- **Tests (if Phase 1 Q5 = Yes)** — add to `devDependencies`: `vitest ^4.1.0`, `@testing-library/react ^16.3.0`, `@testing-library/jest-dom`, `jsdom ^29.0.0`, plus the `"test": "vitest run"` script. Detail: `@rules/tests.md`.
- **`electron-log ^5.4.0`**: mandatory in every project (file logging) — see `@rules/logging.md`.

> **Version maintenance**: this table and these notes reflect the state validated at the time of writing. Before pinning in a new project, re-confirm the current minor versions and the breaking-change notes above (`npm outdated`, the package release notes) — they age. The caret rule and the structure stay; the numbers and notes are refreshed per project in Phase 1.

## Postinstall — Electron binary reliability

Electron's official `postinstall` downloads the binary (`electron.exe` on Windows, `Electron` on macOS/Linux) then extracts it into `node_modules/electron/dist/` and writes `node_modules/electron/path.txt`. This **fails silently** in several real cases:
- **`ELECTRON_RUN_AS_NODE=1` in the environment** (set by Electron-based shells/IDEs — VS Code, Cursor — on their child node processes). Under this flag Electron's `install.js` no-ops the download: exit 0, **no zip cached**, no binary. This is the most common cause inside an editor terminal and the one a cache-only fallback cannot fix (nothing to restore).
- Antivirus (Windows Defender chief among them) blocks `node.exe` writing `electron.exe` during extraction.
- Permission or lock on `node_modules/electron/dist/`.
- Network interruption during the download (incomplete zip in cache).

Symptom: `Error: Electron uninstall` when launching `electron-vite dev` or any other wrapper. Electron's `install.js` does not propagate the error — so `npm install` returns success.

**Mandatory solution**: every generated project includes `scripts/ensure-electron.cjs` below + the matching `postinstall` hook in `package.json`. The script:
- No-op if `path.txt` and the binary are already present.
- Else, if `ELECTRON_RUN_AS_NODE` is set: re-run Electron's own `install.js` with a **cleaned environment** (that variable deleted) so the download actually runs, then re-check.
- Else: looks for the zip in the local Electron cache (`%LOCALAPPDATA%\electron\Cache` / `~/Library/Caches/electron` / `~/.cache/electron`), extracts it into `node_modules/electron/dist/`, writes `path.txt`.
- Otherwise: explicit error message with probable cause and action to take.

Dependencies: Node std lib + `extract-zip` (transitive dependency of `@electron/get`, therefore already in `node_modules` after installing Electron). No direct dependency to add to `package.json`.

Covers Windows, macOS, and Linux (x64 and arm64).

### File `scripts/ensure-electron.cjs`

```js
#!/usr/bin/env node
// scripts/ensure-electron.cjs
// Filet de sécurité pour le postinstall d'electron.
// Si l'extraction du binaire a échoué silencieusement (antivirus, permission,
// téléchargement interrompu), on récupère depuis le cache local. Sans cela :
// "Error: Electron uninstall" au lancement de electron-vite.

const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");

const ELECTRON_DIR = path.join(__dirname, "..", "node_modules", "electron");
const DIST_DIR = path.join(ELECTRON_DIR, "dist");
const PATH_TXT = path.join(ELECTRON_DIR, "path.txt");

function relExecPath() {
  switch (process.platform) {
    case "win32":
      return "electron.exe";
    case "darwin":
      return "Electron.app/Contents/MacOS/Electron";
    default:
      return "electron";
  }
}

function cacheDir() {
  if (process.env.ELECTRON_CACHE) return process.env.ELECTRON_CACHE;
  switch (process.platform) {
    case "win32":
      return path.join(
        process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local"),
        "electron",
        "Cache"
      );
    case "darwin":
      return path.join(os.homedir(), "Library", "Caches", "electron");
    default:
      return path.join(
        process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache"),
        "electron"
      );
  }
}

function isInstalled() {
  return (
    fs.existsSync(PATH_TXT) &&
    fs.existsSync(path.join(DIST_DIR, relExecPath()))
  );
}

// Dans un shell lancé par une app Electron (VS Code, Cursor…),
// ELECTRON_RUN_AS_NODE=1 est hérité par les process node enfants. Sous ce
// flag, l'installeur officiel d'Electron (install.js) avale le téléchargement
// du binaire (sortie 0, aucun zip mis en cache). On relance donc l'installeur
// avec un environnement nettoyé avant toute restauration depuis le cache.
function retryDownloadWithCleanEnv() {
  const installer = path.join(ELECTRON_DIR, "install.js");
  if (!fs.existsSync(installer)) return;
  const env = { ...process.env };
  delete env.ELECTRON_RUN_AS_NODE;
  try {
    execFileSync(process.execPath, [installer], { stdio: "inherit", env });
  } catch {
    // install.js n'échoue pas en sortie non nulle : on vérifie via isInstalled().
  }
}

function findCachedZip(version) {
  const dir = cacheDir();
  if (!fs.existsSync(dir)) return null;
  const zipName = `electron-v${version}-${process.platform}-${process.arch}.zip`;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const candidate = path.join(dir, entry.name, zipName);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

async function main() {
  if (isInstalled()) return;

  if (!fs.existsSync(ELECTRON_DIR)) {
    console.error(
      "[ensure-electron] Package 'electron' absent — lancer 'npm install' d'abord."
    );
    process.exit(1);
  }

  // 1) Relancer le téléchargement officiel avec un env nettoyé.
  if (process.env.ELECTRON_RUN_AS_NODE) {
    retryDownloadWithCleanEnv();
    if (isInstalled()) {
      console.log(
        "[ensure-electron] Binaire téléchargé après nettoyage de ELECTRON_RUN_AS_NODE."
      );
      return;
    }
  }

  const { version } = JSON.parse(
    fs.readFileSync(path.join(ELECTRON_DIR, "package.json"), "utf8")
  );

  // 2) Sinon, restaurer depuis le cache local (extraction échouée).
  const zipPath = findCachedZip(version);
  if (!zipPath) {
    console.error(
      "[ensure-electron] Binaire Electron absent et zip introuvable dans le cache."
    );
    console.error(`[ensure-electron] Cache attendu : ${cacheDir()}`);
    console.error(
      `[ensure-electron] Fichier recherché : electron-v${version}-${process.platform}-${process.arch}.zip`
    );
    console.error(
      "[ensure-electron] Cause probable : téléchargement bloqué (réseau, proxy, antivirus)."
    );
    console.error(
      "[ensure-electron] Action : vérifier la connexion, exclure node_modules et le cache de l'antivirus, puis réinstaller."
    );
    process.exit(1);
  }

  // Electron >= 42 a renommé l'extracteur embarqué (extract-zip ->
  // @electron-internal/extract-zip). On essaie les deux noms.
  let extract;
  for (const name of ["@electron-internal/extract-zip", "extract-zip"]) {
    try {
      const mod = require(name);
      extract = mod.default || mod;
      break;
    } catch {
      /* try next name */
    }
  }
  if (!extract) {
    console.error(
      "[ensure-electron] Module d'extraction introuvable (@electron-internal/extract-zip ou extract-zip) — dépendance transitive d'electron manquante."
    );
    process.exit(1);
  }

  fs.mkdirSync(DIST_DIR, { recursive: true });
  try {
    await extract(zipPath, { dir: DIST_DIR });
  } catch (err) {
    console.error(`[ensure-electron] Extraction échouée : ${err.message}`);
    console.error(
      "[ensure-electron] Cause probable : antivirus bloque l'écriture du binaire par node.exe."
    );
    console.error(
      "[ensure-electron] Action : exclure node_modules et le cache Electron de l'antivirus, puis relancer 'npm run postinstall'."
    );
    process.exit(1);
  }

  fs.writeFileSync(PATH_TXT, relExecPath(), { encoding: "ascii" });
  console.log(`[ensure-electron] Binaire restauré depuis : ${zipPath}`);
}

main().catch((err) => {
  console.error(`[ensure-electron] Erreur inattendue : ${err.message}`);
  process.exit(1);
});
```

## TypeScript

- `strict: true` in all tsconfig. `noUnusedLocals`, `noUnusedParameters` enabled.
- Three configs (electron-vite model): `tsconfig.node.json` (main + preload), `tsconfig.web.json` (renderer), `tsconfig.json` (references).
- `any` forbidden unless justified with a comment. Incoming IPC payloads are `unknown` then validated.
- TSDoc on exported classes and public methods.

## Internationalization (if enabled in Phase 1)

- `i18next` + `react-i18next`, JSON resources: `src/renderer/src/i18n/fr.json` and `en.json`.
- All visible strings go through `t("key")` in the views (`useTranslation`).
- Dotted-notation keys per entity: `record.saved`, `nav.settings`.
- Language loaded at startup from preferences (via IPC), FR by default.
- Language change: hot via `i18n.changeLanguage()` (no restart — advantage vs QTranslator), persisted in preferences.
- Zero visible hardcoded string in views, controllers, or models. If i18n not enabled: centralized FR strings in `src/renderer/src/i18n/fr.json` anyway (future toggle at zero cost) — exception: a "Small" project where a `LABELS` object in `shared/config.ts` is enough.

## Logging

Summary — full detail in `@rules/logging.md`.

- `electron-log ^5.4.0` (mandatory dependency) + `src/main/logger.ts` (`setupLogging()`, called first in `src/main/index.ts`).
- File transport: `app.getPath("userData")/logs/main.log`, capped at `LOG_MAX_BYTES`, level `LOG_LEVEL` (`debug` if env var `[APP_NAME]_DEBUG=1`).
- Zero `console.log` in delivered code — only `log.*`.

## Windows packaging (`.exe`)

Tool: **electron-builder**. `electron-builder.yml` file at the root:

```yaml
appId: com.[user].[appname]
productName: AppName
directories:
  output: release
files:
  - out/**
win:
  target: [nsis, portable]
  icon: resources/icon.ico
nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
```

Command: `npm run dist`. **Opt-in via Phase 1 Q7** — if `Yes`, the last batch delivers the commented `electron-builder.yml` + `dist` instructions (also available later on explicit request).

### Application icon

- File: `resources/icon.ico`, multi-resolution (16→256px, 256 mandatory).
- Window (dev/taskbar): BrowserWindow `icon` option → `join(__dirname, "../../resources/icon.ico")`.
- Executable: `win.icon` in `electron-builder.yml` (already present).
- If the user provides no icon in Phase 1: default Electron icon, noted in the generated README.
- **Splash icon (if the splash screen is on, Phase 3)**: the splash reuses this `resources/icon.ico`. If no icon was set in Phase 1 and the user provides a splash icon path in Phase 3, save it as `resources/icon.ico` — it then serves the window/taskbar and packaging too. No icon at all → text-only splash. See `@rules/splash.md`.

## Second renderer entry — splash (if the splash screen is on, Phase 3)

When a splash screen is enabled, `src/renderer/splash.html` is a **second renderer entry** so electron-vite builds it alongside the main renderer:

```ts
// electron.vite.config.ts — renderer section
renderer: {
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/renderer/index.html"),
        splash: resolve(__dirname, "src/renderer/splash.html"),
      },
    },
  },
},
```

The main process loads the built `splash.html` (`out/renderer/splash.html`). Splash assets, orchestration, and CSP: `@rules/splash.md`.

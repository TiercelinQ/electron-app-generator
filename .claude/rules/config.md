# Règles config, dépendances, i18n, logging, packaging

## Structure `src/shared/config.ts`

Structure minimale obligatoire dans tout projet :

```ts
// Application
export const APP_NAME = "NomApp";
export const APP_VERSION = "1.0.0";

// Base de données (si applicable) — relatif à app.getPath("userData")
export const DB_FILENAME = "nom_app.db";

// Préférences (si applicable)
export const PREFERENCES_FILENAME = "preferences.json";

// Internationalisation (si activée)
export const DEFAULT_LOCALE = "fr";
export const SUPPORTED_LOCALES = ["fr", "en"] as const;

// Fenêtre
export const WINDOW_MIN_WIDTH = 1024;
export const WINDOW_MIN_HEIGHT = 768;
export const WINDOW_DEFAULT_WIDTH = 1280;
export const WINDOW_DEFAULT_HEIGHT = 800;
```

- Toute constante réutilisée dans plus d'un fichier va dans `shared/config.ts`.
- Les chemins absolus (userData) sont résolus **dans le main uniquement** (`app.getPath`) — jamais dans `shared/` ni le renderer.
- Zéro couleur dans `config.ts` — les couleurs (icônes comprises) vivent dans `tokens.css` (différence vs générateur Python).

## Canaux IPC — `src/shared/ipc-channels.ts`

```ts
export const IPC = {
  PREF_GET: "pref:get",
  PREF_SET: "pref:set",
  RECORD_LIST: "record:list",
  RECORD_SAVE: "record:save",
} as const;
```

Convention : `entite:action`. Zéro chaîne de canal en dur hors de ce fichier.

## `package.json` — scripts obligatoires

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

- `postinstall` **obligatoire** dans tout projet — voir section "Postinstall — fiabilisation du binaire Electron".
- Si `better-sqlite3` (module natif) : chaîner `electron-builder install-app-deps` après le script de fiabilisation → `"postinstall": "node scripts/ensure-electron.cjs && electron-builder install-app-deps"`.

## Versioning des dépendances

`package.json` : versions caret (`^`), fixées à la version mineure validée en Phase 1. `package-lock.json` commité.

```json
"dependencies":    { "better-sqlite3": "^12.0.0", "i18next": "^26.0.0", "react-i18next": "^17.0.0",
                     "react": "^19.0.0", "react-dom": "^19.0.0", "@fortawesome/fontawesome-free": "^6.5.0" },
"devDependencies": { "electron": "^42.0.0", "electron-vite": "^5.0.0", "electron-builder": "^26.0.0",
                     "typescript": "^6.0.0", "vite": "^7.0.0", "@vitejs/plugin-react": "^5.2.0",
                     "typescript-eslint": "^8.0.0", "eslint-plugin-react": "^7.37.5",
                     "eslint-plugin-react-hooks": "^7.0.0", "eslint": "^10.0.0", "prettier": "^3.8.0" }
```

Notes de versioning :
- `@fortawesome/fontawesome-free` : **gelé à `^6.5.0`** — FA 7.x (7.2.0 actuel) est sorti mais introduit des breaking changes sur les noms de classes CSS. Ne pas monter sans audit complet des classes utilisées dans `design-system.md` et `layout.md`.
- `electron-vite ^5.0.0` : peer dep `vite@"^5.0.0 || ^6.0.0 || ^7.0.0"` — **Vite 8 non supporté**. Utiliser `vite ^7.0.0` + `@vitejs/plugin-react ^5.2.0` (supporte vite ^4 → ^8, compatible electron-vite 5).
- `eslint-plugin-react-hooks` : la version 5.x n'a jamais existé — le package est passé de 4.6.x à 7.x. Dernière stable : `7.1.1`.
- `eslint-plugin-react` : dernière stable `7.37.5`.
- `typescript ^6.0.0` : `moduleResolution: classic` supprimé (electron-vite utilise `bundler` → sans impact), `esModuleInterop: false` interdit (déjà vrai par défaut). Safe pour tout nouveau projet.
- `eslint ^10.0.0` : flat config obligatoire (`eslint.config.mjs` — déjà le format utilisé). Requiert Node ≥ 20.19.
- `typescript-eslint ^8.0.0` : package unifié pour flat config — remplace les anciens `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser` séparés. Peer dep TypeScript : `>=4.8.4 <6.1.0`.
- `better-sqlite3` : module natif — recompilé pour Electron via `electron-builder install-app-deps` chaîné après `ensure-electron.cjs` dans `postinstall` (voir section dédiée). À inclure dans les instructions du dernier lot si SQLite retenue.

## Postinstall — fiabilisation du binaire Electron

Le `postinstall` officiel du package `electron` télécharge le binaire (`electron.exe` sur Windows, `Electron` sur macOS/Linux) puis l'extrait dans `node_modules/electron/dist/` et écrit `node_modules/electron/path.txt`. Cette extraction **échoue silencieusement** dans plusieurs cas réels :
- Antivirus (Windows Defender en tête) bloque l'écriture de `electron.exe` par `node.exe` pendant l'extraction.
- Permission ou verrou sur `node_modules/electron/dist/`.
- Interruption réseau pendant le téléchargement (zip incomplet en cache).

Symptôme : `Error: Electron uninstall` au lancement de `electron-vite dev` ou de tout autre wrapper. Le script `install.js` d'Electron ne propage pas l'erreur — `npm install` retourne donc succès.

**Solution obligatoire** : tout projet généré inclut `scripts/ensure-electron.cjs` ci-dessous + le hook `postinstall` correspondant dans `package.json`. Le script :
- No-op si `path.txt` et le binaire sont déjà présents.
- Sinon : recherche le zip dans le cache local Electron (`%LOCALAPPDATA%\electron\Cache` / `~/Library/Caches/electron` / `~/.cache/electron`), l'extrait dans `node_modules/electron/dist/`, écrit `path.txt`.
- Sinon : message d'erreur explicite avec cause probable et action à mener.

Dépendances : Node std lib + `extract-zip` (dépendance transitive d'`@electron/get`, donc déjà dans `node_modules` après l'installation d'Electron). Aucune dépendance directe à ajouter à `package.json`.

Couvre Windows, macOS et Linux (x64 et arm64).

### Fichier `scripts/ensure-electron.cjs`

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

  const { version } = JSON.parse(
    fs.readFileSync(path.join(ELECTRON_DIR, "package.json"), "utf8")
  );

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

  let extract;
  try {
    extract = require("extract-zip");
  } catch {
    console.error(
      "[ensure-electron] Module 'extract-zip' introuvable — dépendance transitive d'electron manquante."
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

- `strict: true` dans tous les tsconfig. `noUnusedLocals`, `noUnusedParameters` activés.
- Trois configs (modèle electron-vite) : `tsconfig.node.json` (main + preload), `tsconfig.web.json` (renderer), `tsconfig.json` (références).
- `any` interdit sauf justification en commentaire. Les payloads IPC entrants sont `unknown` puis validés.
- TSDoc sur classes exportées et méthodes publiques.

## Internationalisation (si activée en Phase 1)

- `i18next` + `react-i18next`, ressources JSON : `src/renderer/src/i18n/fr.json` et `en.json`.
- Toutes les chaînes visibles passent par `t("cle")` dans les views (`useTranslation`).
- Clés en notation pointée par entité : `record.saved`, `nav.settings`.
- Langue chargée au démarrage depuis les préférences (via IPC), FR par défaut.
- Changement de langue : à chaud via `i18n.changeLanguage()` (pas de redémarrage — avantage vs QTranslator), persisté en préférences.
- Zéro chaîne visible en dur dans views, controllers ou models. Si i18n non activée : chaînes FR centralisées dans `src/renderer/src/i18n/fr.json` quand même (bascule future à coût nul) — exception : projet "Petit" où un objet `LABELS` dans `shared/config.ts` suffit.

## Logging (sur demande uniquement)

Si activé pour un projet : `electron-log ^5.4.0` (à valider en Phase 1 — Node n'a pas d'équivalent stdlib avec handler fichier).

```ts
// src/main/index.ts
import log from "electron-log/main";
log.initialize();
log.transports.file.level = "info";
// fichier : app.getPath("userData")/logs/main.log
```

Format par défaut electron-log : `{y}-{m}-{d} {h}:{i}:{s}.{ms} [{level}] {text}` — suffisant pour usage personnel. Renderer : `electron-log/renderer` si nécessaire.

## Packaging Windows (`.exe`)

Outil : **electron-builder**. Fichier `electron-builder.yml` à la racine :

```yaml
appId: com.[utilisateur].[nomapp]
productName: NomApp
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

Commande : `npm run dist`. Livré dans le dernier lot **sur demande explicite** : `electron-builder.yml` commenté + instructions.

### Icône applicative

- Fichier : `resources/icon.ico`, multi-résolutions (16→256px, 256 obligatoire).
- Fenêtre (dev/taskbar) : option `icon` du BrowserWindow → `join(__dirname, "../../resources/icon.ico")`.
- Exécutable : `win.icon` dans `electron-builder.yml` (déjà présent).
- Si l'utilisateur ne fournit pas d'icône en Phase 1 : icône Electron par défaut, signalé dans le README généré.
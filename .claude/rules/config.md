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
    "dev": "electron-vite dev",
    "build": "electron-vite build",
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit -p tsconfig.node.json && tsc --noEmit -p tsconfig.web.json",
    "dist": "electron-vite build && electron-builder --win"
  }
}
```

## Versioning des dépendances

`package.json` : versions caret (`^`), fixées à la version mineure validée en Phase 1. `package-lock.json` commité.

```json
"dependencies":    { "better-sqlite3": "^11.0.0", "i18next": "^23.0.0", "react-i18next": "^14.0.0",
                     "react": "^18.3.0", "react-dom": "^18.3.0", "@fortawesome/fontawesome-free": "^6.5.0" },
"devDependencies": { "electron": "^30.0.0", "electron-vite": "^2.0.0", "electron-builder": "^24.0.0",
                     "typescript": "^5.4.0", "vite": "^5.0.0", "@vitejs/plugin-react": "^4.0.0",
                     "eslint": "^9.0.0", "prettier": "^3.0.0" }
```

Note `better-sqlite3` : module natif — recompilé pour Electron via `electron-builder install-app-deps` (postinstall). À inclure dans les instructions du dernier lot si SQLite retenue.

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

Si activé pour un projet : `electron-log` (à valider en Phase 1 — Node n'a pas d'équivalent stdlib avec handler fichier).

```ts
// src/main/index.ts
import log from "electron-log/main";
log.initialize();
log.transports.file.level = "info";
// fichier : app.getPath("userData")/logs/main.log
```

Format : `%(asctime)s — %(level)s — %(message)s` (défaut electron-log conforme). Niveau INFO par défaut. Renderer : `electron-log/renderer` si nécessaire.

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

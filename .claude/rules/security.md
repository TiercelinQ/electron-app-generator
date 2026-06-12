# Règles de sécurité Electron — NON NÉGOCIABLES

Appliquées à 100% des applications générées. Tout écart impose le protocole de déclaration du contrat (arrêt → déclaration → validation).

## 1. BrowserWindow — webPreferences verrouillées

```ts
new BrowserWindow({
  webPreferences: {
    contextIsolation: true,        // obligatoire
    nodeIntegration: false,        // obligatoire
    sandbox: true,                 // obligatoire
    webSecurity: true,             // jamais désactivé
    preload: join(__dirname, "../preload/index.js"),
  },
});
```

- `nodeIntegrationInWorker`, `nodeIntegrationInSubFrames`, `allowRunningInsecureContent` : jamais activés.
- Module `remote` / `@electron/remote` : interdit.

## 2. Preload — surface minimale

- `contextBridge.exposeInMainWorld("api", …)` expose **uniquement des fonctions nommées**, jamais `ipcRenderer` brut, jamais `require`, jamais d'objet Node.
- Chaque fonction mappe un seul canal déclaré dans `shared/ipc-channels.ts`.
- Zéro logique dans le preload.

## 3. Validation des entrées IPC (côté main, dans les controllers)

- Tout payload entrant est typé `unknown` puis validé avant usage : type, champs obligatoires, bornes, format.
- Validation par fonctions dédiées (type guards TS) — bibliothèque de schémas (zod…) uniquement si validée en Phase 1.
- Chemins de fichiers reçus du renderer : résolus puis vérifiés (`path.resolve` + contrôle qu'ils restent sous le répertoire autorisé). Zéro traversal.
- Requêtes SQL : **toujours** préparées/paramétrées (`db.prepare(...).run(params)`) — zéro concaténation.

## 4. Navigation et contenu

- CSP stricte en `<meta>` dans `index.html` :
  `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'`
  (`'unsafe-inline'` style toléré uniquement si exigé par une lib validée — sinon retiré.)
- Blocage de toute navigation et ouverture de fenêtre non prévues :

```ts
app.on("web-contents-created", (_e, contents) => {
  contents.on("will-navigate", (e) => e.preventDefault());
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
});
```

- `shell.openExternal` : uniquement sur des URLs constantes définies dans `shared/config.ts` — jamais sur une valeur venant du renderer ou de données.
- Aucune ressource distante (CDN, fonts, scripts) — tout est embarqué via npm.

## 5. Permissions

```ts
session.defaultSession.setPermissionRequestHandler((_wc, _permission, callback) => callback(false));
```

Autorisation explicite par permission uniquement si une fonctionnalité validée en Phase 1 l'exige.

## 6. Données

- `preferences.json`, base SQLite, logs : dans `app.getPath("userData")` — jamais dans le dossier d'installation.
- Aucun secret en dur dans le code. Secrets utilisateur (si besoin) : `safeStorage` d'Electron.
- Aucune donnée applicative commitée (`.gitignore` : `*.db`, `preferences.json`).

## 7. Divers

- `app.requestSingleInstanceLock()` si l'application écrit des données (SQLite/JSON) — évite la corruption multi-instance.
- Electron maintenu en version stable supportée ; `npm audit` mentionné dans les instructions du dernier lot.
- DevTools : ouverts uniquement en dev (`if (!app.isPackaged)`).

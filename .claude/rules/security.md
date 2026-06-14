# Electron security rules — NON-NEGOTIABLE

Applied to 100% of generated applications. Any deviation requires the contract declaration protocol (stop → declare → validate).

## 1. BrowserWindow — locked webPreferences

```ts
new BrowserWindow({
  webPreferences: {
    contextIsolation: true,        // mandatory
    nodeIntegration: false,        // mandatory
    sandbox: true,                 // mandatory
    webSecurity: true,             // never disabled
    preload: join(__dirname, "../preload/index.js"),
  },
});
```

- `nodeIntegrationInWorker`, `nodeIntegrationInSubFrames`, `allowRunningInsecureContent`: never enabled.
- `remote` / `@electron/remote` module: forbidden.

## 2. Preload — minimal surface

- `contextBridge.exposeInMainWorld("api", …)` exposes **only named functions**, never raw `ipcRenderer`, never `require`, never a Node object.
- Each function maps a single channel declared in `shared/ipc-channels.ts`.
- Zero logic in the preload.

## 3. IPC input validation (main side, in the controllers)

- Every incoming payload is typed `unknown` then validated before use: type, mandatory fields, bounds, format.
- Validation by dedicated functions (TS type guards) — schema library (zod…) only if validated in Phase 1.
- File paths received from the renderer: resolved then checked (`path.resolve` + verify they stay under the allowed directory). Zero traversal.
- SQL queries: **always** prepared/parameterized (`db.prepare(...).run(params)`) — zero concatenation.

## 4. Navigation and content

- Strict CSP in `<meta>` in `index.html`:
  `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'`
  (`'unsafe-inline'` style tolerated only if required by a validated lib — otherwise removed.)
- Block any unplanned navigation and window opening:

```ts
app.on("web-contents-created", (_e, contents) => {
  contents.on("will-navigate", (e) => e.preventDefault());
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
});
```

- `shell.openExternal`: only on constant URLs defined in `shared/config.ts` — never on a value coming from the renderer or from data.
- No remote resource (CDN, fonts, scripts) — everything embedded via npm.

## 5. Permissions

```ts
session.defaultSession.setPermissionRequestHandler((_wc, _permission, callback) => callback(false));
```

Explicit per-permission authorization only if a feature validated in Phase 1 requires it.

## 6. Data

- `preferences.json`, SQLite database, logs: in `app.getPath("userData")` — never in the install folder.
- No hardcoded secret in the code. User secrets (if needed): Electron's `safeStorage`.
- No application data committed (`.gitignore`: `*.db`, `preferences.json`).

## 7. Misc

- `app.requestSingleInstanceLock()` if the application writes data (SQLite/JSON) — avoids multi-instance corruption.
- Electron kept on a supported stable version; `npm audit` mentioned in the last batch instructions.
- DevTools: opened only in dev (`if (!app.isPackaged)`).

## Anti-patterns — what NOT to do

- **Do not** weaken any `webPreferences` flag (`contextIsolation`, `nodeIntegration`, `sandbox`, `webSecurity`) — even "temporarily" for debugging.
- **Do not** expose `ipcRenderer`, `require`, `process`, or any Node primitive through `contextBridge`.
- **Do not** use a payload from the renderer without validating it first (type guard, bounds, path resolution).
- **Do not** concatenate a value into a SQL string — always `prepare` + params.
- **Do not** `shell.openExternal` a URL coming from the renderer or from data — only constants from `shared/config.ts`.
- **Do not** load a remote resource (CDN font/script/style) — everything is local npm.
- **Do not** import the deprecated `remote` / `@electron/remote` module.

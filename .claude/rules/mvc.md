# MVC rules — Electron

## MVC → Electron process mapping

| Layer      | Location                     | Content                                  |
| ---------- | ---------------------------- | ---------------------------------------- |
| Model      | `src/main/models/`           | Business logic, data access              |
| Controller | `src/main/controllers/` + `src/preload/` | IPC bridge main ↔ renderer  |
| View       | `src/renderer/src/views/`    | React components, DOM/CSS only           |

## Responsibilities

### Models — `src/main/models/`
- Pure Node.js + TypeScript. Classes or modules per entity.
- Raise named business errors (`models/errors.ts`).
- **Forbidden**: any Electron UI API (`BrowserWindow`, `dialog`, `ipcMain`…). Tolerated: `app.getPath()` for data paths.
- **Forbidden**: any import from `controllers/`, `preload/`, or `renderer/`.

### Controllers — `src/main/controllers/`
- One file per entity: `[entity].controller.ts`.
- Register the `ipcMain.handle(channel, …)` handlers.
- Validate every IPC input (type, bounds, format) before calling the Model — see `@rules/security.md`.
- Intercept business errors and return a structured result (see `@rules/errors.md`). **Never propagate a raw exception across the IPC.**
- **Forbidden**: business logic, direct data access, UI construction.

### Preload — `src/preload/index.ts`
- Expose a minimal typed API via `contextBridge.exposeInMainWorld("api", …)`.
- Each method = one `ipcRenderer.invoke(channel, payload)`. Zero logic.
- The API type is declared in `src/shared/types.ts` (interface `WindowApi`) and referenced by the renderer (`window.api`).

### Views — `src/renderer/src/views/`
- Functional React components + hooks. One file per entity: `[Entity]View.tsx`.
- No business logic. No Node/Electron access — only `window.api`.
- Show errors via `ToastManager` (never business error handling).
- `views/layout/`: structural components (Topbar, Statusbar, Drawer, Modal).

## Unidirectional imports

```
renderer (views) ──window.api──▶ preload ──ipcRenderer──▶ controllers ──▶ models
                                                              │
shared/ (types, config, ipc-channels) ◀───────────────────────┴── importable by all layers
```

- `shared/` contains only types, constants, and channel names — zero logic, zero dependency.
- IPC channel names are centralized in `src/shared/ipc-channels.ts` — zero hardcoded channel string anywhere else.
- One entity = one model + one controller + one view. Shared constants in `src/shared/config.ts`.

## Generated reference tree

```
my-app/
├── package.json
├── electron.vite.config.ts
├── tsconfig.json · tsconfig.node.json · tsconfig.web.json
├── eslint.config.mjs · .prettierrc
├── electron-builder.yml            # if packaging (Phase 1 Q7) — @rules/config.md
├── README.md
├── docs/
│   └── specs/                      # generation specs (user's language): 01-scoping … 04-architect
├── resources/                      # .ico icon, packaging assets
├── scripts/
│   └── ensure-electron.cjs         # postinstall — Electron binary reliability
├── src/
│   ├── shared/
│   │   ├── config.ts               # application constants
│   │   ├── types.ts                # DTOs + WindowApi interface
│   │   └── ipc-channels.ts         # centralized channel names
│   ├── main/
│   │   ├── index.ts                # main entry, BrowserWindow, security
│   │   ├── logger.ts               # electron-log setup — @rules/logging.md
│   │   ├── models/
│   │   │   ├── errors.ts           # named business errors
│   │   │   ├── db.ts               # single DB access point (if DB ≠ none) — @rules/db.md
│   │   │   ├── migrations.ts       # versioned migrations (if DB ≠ none) — @rules/db.md
│   │   │   ├── sf-cli.ts           # sf runner + typed helpers (if Salesforce CLI) — @rules/sf-cli.md
│   │   │   ├── preferences.model.ts
│   │   │   └── [entity].model.ts
│   │   └── controllers/
│   │       ├── index.ts            # registerAllControllers()
│   │       ├── org.controller.ts   # Org Manager handlers, sf:org:* channels (if Salesforce CLI) — @rules/sf-cli.md
│   │       └── [entity].controller.ts
│   ├── preload/
│   │   └── index.ts                # contextBridge
│   └── renderer/
│       ├── index.html              # CSP meta included
│       ├── splash.html             # splash markup (if splash enabled — @rules/splash.md)
│       └── src/
│           ├── main.tsx            # React entry
│           ├── splash.ts           # splash theme bootstrap (if splash enabled) — @rules/splash.md
│           ├── App.tsx             # shell: topbar, content, statusbar
│           ├── views/
│           │   ├── layout/         # Topbar.tsx, Statusbar.tsx, Drawer.tsx, Modal.tsx
│           │   ├── ToastManager.tsx
│           │   ├── OrgView.tsx     # Org Manager UI (if Salesforce CLI) — @rules/sf-cli.md
│           │   └── [Entity]View.tsx
│           ├── hooks/              # shared hooks (useTheme, useToast…)
│           ├── utils/helpers.ts    # pure functions (formatting, validation)
│           ├── i18n/               # index.ts, fr.json, en.json
│           └── styles/
│               ├── tokens.css      # all tokens, :root + [data-theme="dark"]
│               ├── styles.css      # rules consuming var(--token)
│               └── splash.css      # splash rules, consumes tokens (if splash enabled) — @rules/splash.md
```

`utils/helpers.ts`: pure functions only (date/number formatting, validation). Forbidden: business logic, data access, Electron/React imports.

## Batch delivery

**Small project (3 batches):**

| Batch | Content                                                                                            |
| ----- | -------------------------------------------------------------------------------------------------- |
| 1     | `src/shared/` + `src/main/models/`                                                                 |
| 2     | `src/main/controllers/` + `src/preload/` + `src/renderer/src/views/` + `hooks/`                    |
| 3     | `src/main/index.ts` + `src/main/logger.ts` + renderer entries + `utils/` + `styles/` + `i18n/` + `scripts/` + root configs + `package.json` + README + instructions |

**Medium / Large project (4 batches):**

| Batch | Content                                                                                            |
| ----- | -------------------------------------------------------------------------------------------------- |
| 1     | `src/shared/` + `src/main/models/`                                                                 |
| 2     | `src/renderer/src/views/` + `hooks/`                                                               |
| 3     | `src/main/controllers/` + `src/preload/`                                                           |
| 4     | `src/main/index.ts` + `src/main/logger.ts` + renderer entries + `utils/` + `styles/` + `i18n/` + `scripts/` + root configs + `package.json` + README + instructions |

> **Salesforce CLI integration (if Phase 1 = Yes)** — no dedicated batch. `sf-cli.ts` (runner + helpers) ships in **Batch 1** with the other models; `org.controller.ts` and the preload methods ship with the controllers/preload batch; `OrgView.tsx` ships with the views batch. The `sf:org:*` channels go in `src/shared/ipc-channels.ts` (Batch 1). It counts toward the size (`## CALIBRATION` in `CLAUDE.md`). See `@rules/sf-cli.md`.

> **Splash screen (if Phase 3 = Yes)** — no dedicated batch. `SPLASH_MIN_DURATION_MS` ships in `src/shared/config.ts` (**Batch 1**); the splash assets (`splash.html`, `styles/splash.css`, `splash.ts`) and the second `rollupOptions.input` entry ship with the styles/entry batch (last non-test batch, alongside `src/main/index.ts` which orchestrates the splash). It counts toward the size. See `@rules/splash.md`.

### Tests batch (only if Phase 1 Q5 = Yes)
Add a final dedicated batch — `test/` (mirroring `src/`) + `vitest.config.ts` + dev dependencies (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`) + the `"test"` script. → Small 4 batches / Medium-Large 5 batches. Patterns and coverage: `@rules/tests.md`.

### Delivery format
- Announcement: `Batch N/[total] — [content]`
- Files written directly to disk, complete and self-contained blocks.
- Automatic chaining between batches without confirmation.
- Last batch: install instructions (`npm install`, `npm run dev`, `npm run typecheck`, `npm run build`, `npm run dist`) + `electron-builder install-app-deps` note if better-sqlite3 + `README.md` at the root.

## Anti-patterns — what NOT to do (MVC / IPC)

- **Do not** expose `ipcRenderer` raw, `require`, or any Node object through the preload `contextBridge`. Expose only named functions, one per declared channel.
- **Do not** put business logic in a controller or a view. Controllers validate + dispatch; views render. Logic lives in models.
- **Do not** access Node/Electron from the renderer — only `window.api`.
- **Do not** hardcode an IPC channel string outside `src/shared/ipc-channels.ts`.
- **Do not** import `controllers/`, `preload/`, or `renderer/` from a model. Models are framework-free Node.
- **Do not** propagate a raw exception across the IPC — return a structured `IpcResult<T>` (`@rules/errors.md`).
- **Do not** spread one entity across more files than `model + controller + view`. If it grows, that is a contract change → declare the deviation (Phase 4 protocol).
- **Do not** put a shared constant in only one layer — promote it to `src/shared/config.ts`.

## Post-delivery adjustments

Requested by the user after execution. Isolated fix on the affected file + its direct dependencies. Deliver the complete fixed file.

## Anomaly resolution — cleanup protocol

When an anomaly requires several attempts before being resolved, as soon as the definitive solution is identified and delivered, produce a mandatory cleanup report:

```
Anomaly resolved. Elements to remove from the previous attempts:

File [name]:
- [line / block / import / IPC channel / className / CSS rule to delete]
- ...
```

- List only the elements added during the failed attempts that are no longer needed.
- Cover all affected files: TS/TSX, CSS, shared, configs.
- Deliver the complete cleaned files if the user confirms.
- Then offer: "Do you want to remember this point? `/electron-save-memory`"

## Deletions

Total deletion across all files: code, imports, IPC channels (declaration + handler + preload + calls), types, classNames, CSS rules, i18n keys. Forbidden: commented-out code, empty implementations, residue. Deliver the complete modified files.

## Integrity verification

Detailed in `@rules/verification.md`. Key points: MVC responsibilities respected (zero business logic in view/controller, zero UI in model); unidirectional imports (`renderer → preload → controllers → models`, `shared/` importable by all); IPC channels consistent end-to-end (`ipc-channels.ts` ↔ handlers ↔ preload ↔ renderer calls) and `WindowApi` aligned; architectural contract (`docs/specs/04-architect.md`) respected. Run silently every batch; cross-file checks on the last batch.

# Logging rules — Electron

## Principle

- `electron-log` (^5.4.0) — **mandatory runtime dependency** in every generated app (Node has no stdlib equivalent with a file handler).
- File transport capped in size (rotation to `main.old.log` beyond `LOG_MAX_BYTES`).
- Main-process logging is the source of truth; the renderer logs through `electron-log/renderer` (enabled by `log.initialize()` in the main).
- Zero `console.log` / `console.error` in delivered code — only `log.*`.

---

## Centralized configuration

Mandatory file `src/main/logger.ts` (single setup point, called first in `src/main/index.ts`):

```ts
// src/main/logger.ts
import log from "electron-log/main";
import * as config from "../shared/config";

export function setupLogging(): void {
  log.initialize(); // enables electron-log/renderer in the renderer (IPC bridge)
  log.transports.file.level = debugEnabled() ? "debug" : config.LOG_LEVEL;
  log.transports.file.maxSize = config.LOG_MAX_BYTES;
  // Console echo in debug mode only (production runs windowed, console unread)
  log.transports.console.level = debugEnabled() ? "debug" : false;
}

function debugEnabled(): boolean {
  return process.env[`${config.APP_NAME.toUpperCase()}_DEBUG`] === "1";
}
```

- Log file: `app.getPath("userData")/logs/main.log` (electron-log default) — never in the install folder (`@rules/security.md §6`).
- Default electron-log format kept: `{y}-{m}-{d} {h}:{i}:{s}.{ms} [{level}] {text}` — enough for personal/pro desktop use.
- `LOG_LEVEL` and `LOG_MAX_BYTES` live in `src/shared/config.ts` (`@rules/config.md`).

---

## Usage in modules

```ts
// src/main/models/record.model.ts
import log from "electron-log/main";

export function saveRecord(input: RecordInput): number {
  log.debug("Sauvegarde record", input.id);
  // ...
}
```

Renderer (when needed): `import log from "electron-log/renderer"` — works once `log.initialize()` ran in the main. No preload change required.

### Level conventions

| Level | Usage                                                            |
| ----- | ---------------------------------------------------------------- |
| debug | Detailed traces, intermediate values                             |
| info  | Important business steps (startup, key user action)              |
| warn  | Unexpected but non-blocking conditions (user validation failed)  |
| error | Intercepted business error (`DatabaseError`…) or uncaught error  |

### Errors always logged

In `catch` blocks that do not re-throw (an `IpcResult` error is returned, a toast is shown), call `log.error(message, err)` so the stacktrace lands in the file. The global `uncaughtException` handler and the React Error Boundary path (`@rules/errors.md`) log through electron-log too.

---

## Activation from `src/main/index.ts`

```ts
import log from "electron-log/main";
import { setupLogging } from "./logger";

setupLogging(); // first statement — before migrations and window creation
log.info("Démarrage application");
```

---

## Anti-patterns — what NOT to do

- **Do not** use `console.log` / `console.error` in delivered code — only `log.*`.
- **Do not** log a password, token, or personally identifiable data.
- **Do not** configure transports outside `src/main/logger.ts` (single setup point, called first in `src/main/index.ts`).
- **Do not** silence a `catch` that doesn't re-throw without a `log.error(...)`.

## Integrity verification

Detailed in `@rules/verification.md`. Key points: `src/main/logger.ts` present and conforming; `setupLogging()` called first in `src/main/index.ts`; `electron-log` in `dependencies`; no `console.log` in delivered `src/`; every non-re-throwing `catch` calls `log.error(...)`.

# Error handling rules

## Model → Controller → View escalation convention (across the IPC)

- **Model**: raises explicit business errors (classes extending `Error`, defined in `src/main/models/errors.ts`, with a fixed `name`).
- **Controller**: intercepts via `try/catch` in the `ipcMain.handle` handler. **Never propagates a raw exception across the IPC** (Electron serializes error classes poorly). Returns a structured result.
- **Preload**: passes the result through as-is. Zero error logic.
- **View**: reads the result, calls the toast via the `useToast` hook. Handles no error logic.

## IPC result contract

Single type in `src/shared/types.ts`:

```ts
export type IpcResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { type: ToastType; message: string; description?: string } };

export type ToastType = "success" | "info" | "warning" | "danger";
```

## Full example

```ts
// src/main/models/errors.ts
export class RecordNotFoundError extends Error {
  constructor(message: string) { super(message); this.name = "RecordNotFoundError"; }
}
export class DatabaseError extends Error {
  constructor(message: string) { super(message); this.name = "DatabaseError"; }
}
```

```ts
// src/main/controllers/record.controller.ts
ipcMain.handle(IPC.RECORD_SAVE, async (_e, payload: unknown): Promise<IpcResult<Record>> => {
  const data = validateRecordPayload(payload); // rules/security.md
  try {
    return { ok: true, data: recordModel.save(data) };
  } catch (err) {
    if (err instanceof RecordNotFoundError) {
      return { ok: false, error: { type: "danger", message: err.message } };
    }
    if (err instanceof DatabaseError) {
      return { ok: false, error: { type: "danger", message: "Erreur base de données", description: err.message } };
    }
    throw err; // unexpected error → global main handler
  }
});
```

```tsx
// src/renderer/src/views/RecordView.tsx
const result = await window.api.saveRecord(data);
if (!result.ok) { toast(result.error); return; }
toast({ type: "success", message: t("record.saved") });
```

## Rules

- Zero `dialog.showMessageBox`, `alert()`, `confirm()` for business errors — **toasts only** (types, durations, anatomy: `layout.md §5`).
- Zero inline banner.
- Destructive confirmations (deletion…): styled modal (`layout.md §8`), never `confirm()`.
- Error handling on all critical operations: file I/O, database, IPC, JSON parsing, `sf` CLI spawn (if the Salesforce integration is on — the runner maps `ENOENT`/non-zero status to an `IpcResult` error, never throws across the IPC; see `@rules/sf-cli.md`).
- Unexpected main errors: global handler (`process.on("uncaughtException")` + `log.error` via electron-log — @rules/logging.md) — the app does not crash silently.
- Unexpected renderer errors: React Error Boundary at `App.tsx` level → persistent `danger` toast.
- Visible error messages: go through i18n if enabled.

## Anti-patterns — what NOT to do

- **Do not** call `alert()`, `confirm()`, or `dialog.showMessageBox` for a business error or a confirmation — toast or styled modal only.
- **Do not** `throw` a raw exception out of an `ipcMain.handle` handler for a known business error — return `{ ok: false, error: {...} }`.
- **Do not** build the user-facing message in the model — the model raises a typed error; the controller decides the toast wording (via i18n).
- **Do not** swallow an error silently (`catch (_) {}`) — map it to an `IpcResult` error or let it reach the global handler.
- **Do not** handle business error logic in a view — the view only reads `result.ok` and toasts.
- **Do not** forget the global main handler (`uncaughtException`) and the renderer Error Boundary — both are mandatory.

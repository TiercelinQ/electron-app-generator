# Règles de gestion des erreurs

## Convention de remontée Model → Controller → View (à travers l'IPC)

- **Model** : lève des erreurs métier explicites (classes héritant d'`Error`, définies dans `src/main/models/errors.ts`, avec `name` fixé).
- **Controller** : intercepte via `try/catch` dans le handler `ipcMain.handle`. **Ne propage jamais d'exception brute à travers l'IPC** (Electron sérialise mal les classes d'erreur). Retourne un résultat structuré.
- **Preload** : transmet le résultat tel quel. Zéro logique d'erreur.
- **View** : lit le résultat, appelle le toast via le hook `useToast`. Ne gère aucune logique d'erreur.

## Contrat de résultat IPC

Type unique dans `src/shared/types.ts` :

```ts
export type IpcResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { type: ToastType; message: string; description?: string } };

export type ToastType = "success" | "info" | "warning" | "danger";
```

## Exemple complet

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
    throw err; // erreur inattendue → handler global main
  }
});
```

```tsx
// src/renderer/src/views/RecordView.tsx
const result = await window.api.saveRecord(data);
if (!result.ok) { toast(result.error); return; }
toast({ type: "success", message: t("record.saved") });
```

## Règles

- Zéro `dialog.showMessageBox`, `alert()`, `confirm()` pour les erreurs métier — **toasts uniquement** (types, durées et anatomie : `layout.md §5`).
- Zéro bandeau inline.
- Confirmations destructives (suppression…) : modale stylée (`layout.md §8`), jamais `confirm()`.
- Gestion d'erreurs sur toutes les opérations critiques : I/O fichiers, base de données, IPC, parsing JSON.
- Erreurs inattendues du main : handler global (`process.on("uncaughtException")` + log) — l'application ne crashe pas silencieusement.
- Erreurs inattendues du renderer : Error Boundary React au niveau de `App.tsx` → toast `danger` persistant.
- Messages d'erreur visibles : passent par i18n si activée.

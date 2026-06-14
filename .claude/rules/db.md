# Database rules — Electron

## Stack per Phase 1 Q2 choice

| DB choice   | Library                  | Reference                      |
| ----------- | ------------------------ | ------------------------------ |
| SQLite      | `better-sqlite3`         | `src/main/models/db.ts`        |
| JSON        | `node:fs` (stdlib)       | direct in the models           |
| CSV         | `node:fs` + a parser val. Phase 1 | direct in the models  |
| none        | —                        | —                              |

All DB access lives in the **main process** (`src/main/models/`) — never in the renderer or preload. The renderer reaches data only through IPC (`@rules/mvc.md`).

---

## Architecture (SQLite) — single access point

```ts
// src/main/models/db.ts
import Database from "better-sqlite3";
import { app } from "electron";
import { join } from "node:path";
import * as config from "../../shared/config";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const file = join(app.getPath("userData"), config.DB_FILENAME);
    db = new Database(file);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
  return db;
}
```

### Usage in the business models

```ts
// src/main/models/record.model.ts
import { getDb } from "./db";

export function saveRecord(input: { nom: string; email: string }): number {
  const stmt = getDb().prepare("INSERT INTO records (nom, email) VALUES (?, ?)");
  return Number(stmt.run(input.nom, input.email).lastInsertRowid);
}
```

---

## Versioned migrations

### Principle

- The schema is versioned via `PRAGMA user_version` (or a `_schema_version` table).
- `config.DB_SCHEMA_VERSION` is the target version expected by the code.
- At main startup (**before** creating the `BrowserWindow`), `runMigrations()` applies the missing migrations sequentially. **Up only** — no automatic rollback.

```ts
// src/main/models/migrations.ts
import { getDb } from "./db";
import * as config from "../../shared/config";

const MIGRATIONS: Record<number, string[]> = {
  1: [
    `CREATE TABLE IF NOT EXISTS records (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       nom TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL
     )`,
  ],
  // 2: [ "ALTER TABLE records ADD COLUMN phone TEXT" ],
};

export function runMigrations(): void {
  const db = getDb();
  let current = db.pragma("user_version", { simple: true }) as number;
  if (current > config.DB_SCHEMA_VERSION) {
    throw new Error(`DB version ${current} ahead of code ${config.DB_SCHEMA_VERSION}. Update the app.`);
  }
  const tx = db.transaction(() => {
    for (const v of Object.keys(MIGRATIONS).map(Number).sort((a, b) => a - b)) {
      if (v > current) {
        for (const stmt of MIGRATIONS[v]) db.exec(stmt);
        db.pragma(`user_version = ${v}`);
        current = v;
      }
    }
  });
  tx();
}
```

### Call from `src/main/index.ts`

```ts
import { runMigrations } from "./models/migrations";
// ... after app.whenReady(), before createWindow()
runMigrations();
```

---

## JSON / CSV mode (no DBMS)

- Storage under `app.getPath("userData")` — never in the install folder (`@rules/security.md`).
- A model module encapsulates its file path; reads/writes are atomic where possible.
- No versioned migrations in JSON/CSV — explicit conversion on load if the shape changes.

---

## Seed data (if DB ≠ none)

Delivered in the last phase of generation as a standalone script `scripts/seed.ts` (npm script `npm run seed`):
- Single responsibility: populate the DB with a coherent demo dataset via the main-process models (`src/main/models/`) / `getDb()`, never raw SQL outside `db.ts`.
- Idempotent: check the target tables are empty before inserting; re-running must not duplicate rows.
- FK integrity: insert parents before children, reuse the returned ids.
- Volume: ~5-15 rows per entity, realistic French values.
- Never run automatically (no call from `src/main/index.ts`); run manually with `npm run seed`.

---

## Anti-patterns — what NOT to do

- **Do not** access the DB from the renderer or preload — main process only, via IPC.
- **Do not** call `new Database(...)` outside `src/main/models/db.ts`.
- **Do not** build a query by string concatenation — always `prepare(...)` with `?` params (`@rules/security.md`).
- **Do not** `SELECT *` without justification (list the columns).
- **Do not** write an automatic `down` migration.

## Integrity verification

Detailed in `@rules/verification.md`. Key points (if DB ≠ none): `db.ts` single access point present; `migrations.ts` present and called in `src/main/index.ts` before the window; `config.DB_SCHEMA_VERSION` consistent with `max(MIGRATIONS)`; no DB access outside `models/`; SQL 100% parameterized.

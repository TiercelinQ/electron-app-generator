# Automated tests rules — Electron/React/TS

## Activation

Conditional — enabled if Phase 1 (Q5) = `Yes`.

If enabled:
- Test setup mandatory in the architectural contract (Phase 4).
- Dedicated extra batch in Phase 5 (Small: 4 batches · Medium/Large: 5 batches).
- Dev dependencies added (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`).

If disabled:
- No test files, no extra batch. Batch count unchanged (Small: 3 · Medium/Large: 4).

---

## Non-negotiable stack

- `vitest` (unit + integration; native mocking via `vi`)
- `@testing-library/react` + `@testing-library/jest-dom` + `jsdom` (renderer component smoke tests)
- No other test framework.

`package.json` script: `"test": "vitest run"` (+ `"test:watch": "vitest"`).
`vitest.config.ts` (or `test` block in `electron.vite.config.ts`) with `environment: "jsdom"` for the renderer project.

---

## What to test, per layer

| Layer                          | Target              | What to test                                                        |
| ------------------------------ | ------------------- | ------------------------------------------------------------------- |
| `src/shared/`                  | Pure logic          | type guards / validators, DTO helpers                               |
| `src/renderer/src/utils/`      | 100% lines          | all branches of the pure functions                                  |
| `src/main/models/`             | Business logic      | public methods, named errors, edge cases (better-sqlite3 mocked)    |
| `src/main/controllers/`        | Wiring + validation | invalid payload rejected; success returns `{ ok: true }`; error → `{ ok: false }` |
| `src/renderer/src/views/`      | Smoke only          | renders without crash + key roles/labels present                    |

---

## Conventions

- File naming: `[module].test.ts` / `[Component].test.tsx` next to the source or under `test/` mirroring `src/`.
- Test names: explicit French behavior — always French, independent of the user's interface language — e.g. `rejette_un_payload_sans_email`.
- No `expect(true).toBe(true)`, no empty test, no `any` in test code without justification.
- No real network, no real filesystem DB — mock `better-sqlite3` and IPC. Use `vi.mock`.
- No arbitrary `setTimeout` waits — use `await`, fake timers (`vi.useFakeTimers()`), or Testing Library `findBy*`.

---

## Controller test pattern (mandatory)

```ts
import { describe, it, expect, vi } from "vitest";
import { registerRecordController } from "../src/main/controllers/record.controller";

describe("record.controller", () => {
  it("retourne une erreur danger sur payload invalide", async () => {
    const model = { save: vi.fn() };
    const handler = getHandler(registerRecordController, model); // helper wiring ipcMain.handle
    const res = await handler({}, { email: "" });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.type).toBe("danger");
  });
});
```

## Renderer smoke test pattern (mandatory)

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecordView } from "../src/renderer/src/views/RecordView";

describe("RecordView", () => {
  it("se rend sans crash et expose le bouton principal", () => {
    render(<RecordView />);
    expect(screen.getByRole("button", { name: /enregistrer/i })).toBeInTheDocument();
  });
});
```

Mock `window.api` in a setup file: `globalThis.window.api = { saveRecord: vi.fn(), ... }`.

---

## Anti-patterns — what NOT to do

- **Do not** write `expect(true).toBe(true)`, an empty test, or a `it.skip` left behind.
- **Do not** hit the network or a real DB — mock `better-sqlite3` and `window.api`.
- **Do not** use arbitrary `setTimeout` waits — fake timers or `findBy*`.
- **Do not** test a controller without mocking its model / DB.
- **Do not** go beyond smoke for views (render + key role/label).
- **Do not** create a test suite when Phase 1 Q5 = No (and `/electron-run-tests` never scaffolds one unasked).

## Integrity verification

Detailed in `@rules/verification.md`. Key points: each source module has a matching test (Phase 4 mapping); `npm test` (vitest) exit 0; dev dependencies present in `package.json`.

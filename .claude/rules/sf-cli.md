# Salesforce CLI integration rules — Electron app

> Conditional — only when Phase 1 "Salesforce CLI" = `Yes`. When enabled, the default scaffold is **runner + typed helpers + a starter Org Manager** (`@rules/mvc.md`). Targets the **`sf` v2 CLI** only. The app never handles OAuth tokens — `sf` owns the auth flow and the OS keychain.

The runner lives in the **main process** (`src/main/models/sf-cli.ts`) — the renderer never spawns a process. The Org Manager view reaches it through the standard IPC path (`@rules/mvc.md`): `view → window.api → preload → controller → model`.

## Command catalog (source of truth for sf commands/flags)

This rule is the **hub** that routes every sf-aware skill to the command catalog under `.claude/sf-cli-reference/`. Whenever you write or modify an `sf` invocation (a helper's `argv`, a new subcommand, a flag):

1. **Never invent** an `sf` command, subcommand, or flag from memory — verify it against the catalog.
2. Read `sf-cli-reference/INDEX.md` first (small: convention + capability → file map), then **open only the section file** matching the capability you need (`auth-orgs.md`, `metadata-deploy.md`, `apex.md`, `data.md`, `packaging.md`, `users-schema.md`, `platform-api.md`, `advanced.md`). **Never read the whole catalog** — it is large; section-scoped reads keep the context lean.
3. Each catalog entry states the exact flags and whether `--json` / `--api-version` / `-o, --target-org` apply. The typed helpers below source their `argv` from there.
4. The catalog reflects `sf` v2 at a given release; field names/flags drift across versions. For anything uncertain or recent (`advanced.md` plugins), confirm against the installed CLI with `sf <command> --help`.

## Principle

The main process shells out to the user's `sf` binary with `--json` and parses the envelope. Everything the integration needs (orgs, auth, SOQL, Tooling API, metadata, Apex) is an `sf` subcommand — no `jsforce`/`@salesforce/core` dependency.

- `sf` is a **runtime prerequisite**; if absent → a clear toast (the runner maps `ENOENT`). The official Salesforce Extension Pack / DX tooling is a documented optional recommendation in the README only — never a hard dependency of the generated app.
- **Resolve `sf` cross-OS via a `sfPath` preference (no platform branch).** When persistent preferences are enabled (Phase 1), store an optional `sfPath` key in `preferences.json` (`preferences.model.ts`): empty → the bare command `sf` is resolved from PATH (cross-spawn); set → the configured absolute path is used. Inject the reader into the model: `new SfCli(() => preferencesModel.get("sfPath") || "sf")`. This covers non-standard installs (the standalone installer's bundled binary, custom paths) on every OS without an `if (win32)`.
- **Install (cross-OS, documented in the README, not imposed)**: the official `sf` installer for the user's OS bundles its own Node and avoids coupling to the system Node version; `npm install -g @salesforce/cli` also works but runs on the system Node. Either way the app only needs `sf` reachable (PATH or `sfPath`).
- **Use `cross-spawn`, not `node:child_process`.** On Windows the `sf` binary is a `sf.cmd` shim; a bare `child_process.spawn("sf", …, { shell:false })` fails with `ENOENT` (and Node's security fix blocks running a `.cmd` without a shell). `cross-spawn` resolves the shim and **escapes arguments correctly** — it keeps the "argument array, no injectable shell" guarantee on every OS. Add `cross-spawn` (dependency) + `@types/cross-spawn` (dev) — see `@rules/config.md`. `esModuleInterop` is already true under electron-vite; `electron-vite` bundles `cross-spawn` into the main bundle automatically (no extra config).

## Runner — `src/main/models/sf-cli.ts`

```ts
import spawn from "cross-spawn";          // resolves the Windows sf.cmd shim, escapes args — no injectable shell
import type { IpcResult } from "../../shared/types";

export interface SfEnvelope<T> { status: number; result: T; warnings?: string[]; message?: string; name?: string; }

export class SfCli {
  /** `resolveBin` returns the sf command/path to run (PATH or the `sfPath` preference). Cross-OS, no platform branch. */
  constructor(private readonly resolveBin: () => string = () => "sf") {}

  /** Run `sf <args> --json`. args is an ARRAY — never a concatenated shell string (security). */
  async run<T>(args: string[]): Promise<IpcResult<T>> {
    return new Promise((resolve) => {
      const child = spawn(this.resolveBin(), [...args, "--json"]);   // cross-spawn — args array, no injectable shell
      let out = "", err = "";
      child.stdout?.on("data", (d) => (out += d));       // cross-spawn types streams as nullable
      child.stderr?.on("data", (d) => (err += d));
      child.on("error", (e) =>
        resolve(this.fail(e.message.includes("ENOENT")
          ? "Salesforce CLI (sf) introuvable. Installez le CLI ou définissez la préférence `sfPath`."
          : e.message)));
      child.on("close", () => {
        let parsed: SfEnvelope<T> | undefined;
        try { parsed = JSON.parse(out || err); } catch { /* non-JSON output */ }
        if (!parsed) return resolve(this.fail("Réponse sf illisible.", err || out));
        if (parsed.status !== 0) return resolve(this.fail(parsed.message ?? "Commande sf en échec.", parsed.name));
        resolve({ ok: true, data: parsed.result });
      });
    });
  }
  private fail(message: string, description?: string): IpcResult<never> {
    return { ok: false, error: { type: "danger", message, description } };
  }
}
```

- `spawn(bin, [...args, "--json"])` via **`cross-spawn`** — argument array, no shell (cross-spawn never spawns through a shell, so there is no injectable command line). User values (alias, SOQL) are **separate array elements**, never spliced into a string. This is the command-injection guard (`@rules/security.md`).
- The runner returns `IpcResult<T>` (`@rules/errors.md`) — **not** the vscode `Result<T>`. The controller surfaces the failure as a toast; the renderer only reads `result.ok`.
- Parse **defensively**: `sf` field names vary across CLI versions. Read the `status`/`result` envelope, guard missing fields, and verify the actual shape at generation time against the installed `sf`.
- Map a non-zero `status` / `ENOENT` / unparseable output to an `IpcResult` error — the controller decides the toast.

## Typed helpers (on top of the runner)

```ts
listOrgs(): Promise<IpcResult<OrgInfo[]>>             // sf org list           → result.nonScratchOrgs / scratchOrgs (defensive)
getDefaultOrg(): Promise<IpcResult<string | undefined>>  // sf config get target-org
setDefaultOrg(alias: string): Promise<IpcResult<void>>   // sf config set target-org=<alias>
loginWeb(alias: string): Promise<IpcResult<void>>    // sf org login web --alias <alias>   (sf opens the browser)
logout(alias: string): Promise<IpcResult<void>>      // sf org logout --target-org <alias> --no-prompt
reconnect(alias: string): Promise<IpcResult<void>>   // re-run login web for an expired token
query(soql: string, org?: string): Promise<IpcResult<QueryResult>>          // sf data query --query <soql>
queryTooling(soql: string, org?: string): Promise<IpcResult<QueryResult>>   // sf data query --use-tooling-api --query <soql>
retrieve(args): Promise<IpcResult<...>>              // sf project retrieve start
deploy(args): Promise<IpcResult<...>>                // sf project deploy start
runApex(file: string, org?: string): Promise<IpcResult<...>>                // sf apex run --file <file>
```

- Each helper builds the args array and delegates to `run<T>()`. Model the return types defensively (only the fields the UI uses). DTOs (`OrgInfo`, `QueryResult`) live in `src/shared/types.ts`.
- **Every helper's command and flags are verified against the catalog** (the comment after each helper points at its capability): orgs/auth/config → `sf-cli-reference/auth-orgs.md`, `query`/`queryTooling` → `data.md`, `runApex` → `apex.md`, `retrieve`/`deploy` → `metadata-deploy.md`. Do not guess a flag — look it up in the matching section file.
- `OrgInfo`: read `alias`, `username`, `connectedStatus` (e.g. `Connected`, `RefreshTokenAuthError`), `isDefaultUsername`, `instanceUrl` when present.

## Auth orchestration

- The main process **drives** `sf org login/logout` and `sf config set target-org`; it never reads, writes, or stores a token. `sf` performs the OAuth web flow and stores tokens in its own keychain.
- "Reconnect on expired token" = re-run `sf org login web` for that alias (`connectedStatus === "RefreshTokenAuthError"`).
- The app may persist a **non-secret** alias in `preferences.json`; never a token (`@rules/security.md`). If a real secret ever has to be stored, use Electron's `safeStorage` — never plain `preferences.json`.

## Starter Org Manager (default scaffold)

One entity = `model + controller + view` (`@rules/mvc.md`). The Org Manager is that entity for the `sf` integration:

- **Model** (`src/main/models/sf-cli.ts`): the runner + typed helpers above.
- **Controller** (`src/main/controllers/org.controller.ts`): one `ipcMain.handle` per `sf:org:*` channel, each validating its input (alias non-empty, expected type) before calling the helper, returning `IpcResult<T>`. Channels declared in `src/shared/ipc-channels.ts` (`@rules/config.md`):
  - `sf:org:list` → `listOrgs`
  - `sf:org:login` → `loginWeb` (alias from the renderer, validated)
  - `sf:org:logout` → `logout` (after a styled confirmation modal in the view)
  - `sf:org:reconnect` → `reconnect`
  - `sf:org:setDefault` → `setDefaultOrg`
- **Preload** (`src/preload/index.ts`): one named function per channel (`sfOrgList`, `sfOrgLogin(alias)`, `sfOrgLogout(alias)`, `sfOrgReconnect(alias)`, `sfOrgSetDefault(alias)`), declared in the `WindowApi` interface (`src/shared/types.ts`).
- **View** (`src/renderer/src/views/OrgView.tsx`): lists orgs from `window.api.sfOrgList()`, shows connected (`fa-circle-check`) vs disconnected (`fa-circle-xmark`) state and marks the default org, with buttons add / remove / reconnect / set-default / refresh. Icon colors via tokens, no business logic (it reads `result.ok` and toasts via `useToast`). After any mutating action, re-list the orgs.

## Anti-patterns — what NOT to do

- **Do not** build the `sf` command as a concatenated string or use `shell: true` with interpolated input — pass an args array via `cross-spawn`.
- **Do not** call `node:child_process.spawn("sf", …)` directly — on Windows it fails to resolve the `sf.cmd` shim (`ENOENT`). Use `cross-spawn`.
- **Do not** spawn `sf` from the renderer or the preload — the runner lives in `src/main/models/` and is reached only through IPC.
- **Do not** read, store, or log an org token — `sf` owns tokens; the app stores at most a non-secret alias.
- **Do not** add `jsforce`/`@salesforce/core` for the v1 use cases — the CLI covers them.
- **Do not** return a raw `Promise` rejection across the IPC — the runner returns `IpcResult<T>`; the controller never re-throws a known sf failure (`@rules/errors.md`).
- **Do not** assume exact `sf --json` field names — parse defensively and verify against the installed CLI.
- **Do not** target `sfdx` (legacy) — `sf` v2 only.

## Integrity verification

Detailed in `@rules/verification.md`. Key points (if sf enabled): all `sf` calls go through `src/main/models/sf-cli.ts` via **`cross-spawn`** with an args array (no `node:child_process` direct, no shell, no renderer spawn); `sf` resolved from PATH or the `sfPath` preference (cross-OS, no platform branch); ENOENT → clear toast pointing to install / `sfPath`; no token stored/logged; Org Manager channels validate input and the view refreshes after a mutation; `cross-spawn` bundled by electron-vite into the main bundle; README documents the cross-OS `sf` prerequisite + `sfPath` + optional tooling recommendation.

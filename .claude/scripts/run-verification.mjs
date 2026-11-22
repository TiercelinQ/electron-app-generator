// Role: run the executable verification ladder (verification.md section A) and summarize the result.
// Inputs: <root> [--dist]
//   Commands: npm install, install-app-deps (if better-sqlite3), typecheck, lint, build,
//   npm test (if test/ exists), npm run dist (with --dist). Stops at the first failing command.
// Outputs: stdout = command / status / duration table, then the first error lines of the failure.
// Exit codes: 0 all green, 1 a command failed, 4 invalid argument.
// Command replaced: /electron-run-tests, step 1 (interpreting a failure stays with the model).
// Example: node .claude/scripts/run-verification.mjs C:\projects\MyApp --dist

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const dist = args.includes("--dist");
const root = args.find((a) => !a.startsWith("--"));
if (!root || !existsSync(join(root, "package.json"))) {
  console.error("Usage: run-verification.mjs <root> [--dist] (package.json required)");
  process.exit(4);
}

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const hasSqlite = Boolean({ ...pkg.dependencies, ...pkg.devDependencies }["better-sqlite3"]);
const hasTests = existsSync(join(root, "test"));

const steps = [{ label: "npm install", cmd: "npm", argv: ["install"] }];
if (hasSqlite) steps.push({ label: "install-app-deps", cmd: "npx", argv: ["electron-builder", "install-app-deps"] });
steps.push(
  { label: "npm run typecheck", cmd: "npm", argv: ["run", "typecheck"] },
  { label: "npm run lint", cmd: "npm", argv: ["run", "lint"] },
  { label: "npm run build", cmd: "npm", argv: ["run", "build"] },
);
if (hasTests) steps.push({ label: "npm test", cmd: "npm", argv: ["test"] });
if (dist) steps.push({ label: "npm run dist", cmd: "npm", argv: ["run", "dist"] });

const rows = [];
let failure = null;
for (const s of steps) {
  if (failure) {
    rows.push([s.label, "not run", "-"]);
    continue;
  }
  const t0 = Date.now();
  const opts = { cwd: root, encoding: "utf8", timeout: 10 * 60 * 1000, maxBuffer: 64 * 1024 * 1024 };
  // Windows: npm and npx are .cmd files, hence the single command line passed to the shell.
  const r =
    process.platform === "win32"
      ? spawnSync([s.cmd, ...s.argv].join(" "), { ...opts, shell: true })
      : spawnSync(s.cmd, s.argv, opts);
  const secs = ((Date.now() - t0) / 1000).toFixed(1) + " s";
  if (r.status === 0) rows.push([s.label, "OK", secs]);
  else {
    rows.push([s.label, `FAILED (code ${r.status ?? r.signal ?? "?"})`, secs]);
    failure = { label: s.label, output: `${r.stdout ?? ""}\n${r.stderr ?? ""}`.trim() };
  }
}

console.log("| Command | Status | Duration |\n|---|---|---|");
for (const r of rows) console.log(`| ${r.join(" | ")} |`);
if (failure) {
  const errs = failure.output.split(/\r?\n/).filter((l) => /error|failed|✖|ERR!/i.test(l)).slice(0, 15);
  console.log(`\nFirst errors from "${failure.label}":`);
  console.log((errs.length ? errs : failure.output.split(/\r?\n/).slice(-15)).join("\n"));
  process.exit(1);
}

// Role: static integrity checks of verification.md section B, done by pattern search instead of model reading.
// Inputs: <root> (root of the generated Electron app)
// Outputs: stdout = one "[point] file:line: message" line per finding, then a total; "OK" if none.
//   Points: 4 TODO · 6/12 inline style, box-shadow · 8 alert/confirm/dialog · logging console.* ·
//   ipc string channels outside ipc-channels.ts and declared/handlers/preload consistency ·
//   15 versions · 16 .gitignore.
// Exit codes: 0 no finding, 1 at least one finding, 4 invalid argument.
// Tolerated cases (signature underline, splash backgroundColor) are still judged by the model.
// Command replaced: /electron-p5-development, /electron-add-feature, /electron-fix-issue, section B.
// Example: node .claude/scripts/static-checks.mjs C:\projects\MyApp

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.argv[2];
if (!root || !existsSync(root)) {
  console.error("Usage: static-checks.mjs <root>");
  process.exit(4);
}

const findings = [];
const add = (point, file, line, msg) => findings.push(`[${point}] ${file}${line ? ":" + line : ""}: ${msg}`);
const rel = (f) => relative(root, f).split("\\").join("/");

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e === "out" || e === "dist") continue;
    const p = join(dir, e);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

const files = walk(join(root, "src")).filter((f) => /\.(ts|tsx|css)$/.test(f));
const rules = [
  { point: "4", re: /\/\/\s*TODO/, ext: /\.(ts|tsx|css)$/, msg: "// TODO is forbidden" },
  { point: "6", re: /\bstyle=\{/, ext: /\.tsx$/, msg: "inline style={} attribute is forbidden", skip: /--underline-[xw]/ },
  { point: "6", re: /box-shadow/, ext: /\.(css|ts|tsx)$/, msg: "box-shadow is forbidden (depth by stroke)" },
  { point: "8", re: /\b(alert|confirm)\s*\(|dialog\.showMessageBox/, ext: /\.(ts|tsx)$/, msg: "alert/confirm/showMessageBox is forbidden (toast or modal)" },
  { point: "logging", re: /\bconsole\.(log|error)\s*\(/, ext: /\.(ts|tsx)$/, msg: "console.log/error is forbidden, use log.*" },
  {
    point: "ipc",
    re: /(ipcMain\.handle|ipcRenderer\.(invoke|send|on))\(\s*["'`]/,
    ext: /\.(ts|tsx)$/,
    msg: "string-literal IPC channel outside ipc-channels.ts",
    skip: null,
    skipFile: /ipc-channels\.ts$/,
  },
];
for (const f of files) {
  const lines = readFileSync(f, "utf8").split(/\r?\n/);
  for (const r of rules) {
    if (!r.ext.test(f) || (r.skipFile && r.skipFile.test(f))) continue;
    lines.forEach((l, i) => {
      if (r.re.test(l) && !(r.skip && r.skip.test(l))) add(r.point, rel(f), i + 1, r.msg);
    });
  }
}

// IPC channel consistency: declared / handlers / preload
const chFile = join(root, "src", "shared", "ipc-channels.ts");
if (existsSync(chFile)) {
  const declared = [...readFileSync(chFile, "utf8").matchAll(/^\s*([A-Z0-9_]+)\s*:/gm)].map((m) => m[1]);
  const used = (dir, re) => {
    const set = new Set();
    for (const f of walk(join(root, dir)).filter((x) => /\.ts$/.test(x)))
      for (const m of readFileSync(f, "utf8").matchAll(re)) set.add(m[1]);
    return set;
  };
  const handled = used("src/main/controllers", /ipcMain\.handle\(\s*IPC\.([A-Z0-9_]+)/g);
  const invoked = used("src/preload", /ipcRenderer\.invoke\(\s*IPC\.([A-Z0-9_]+)/g);
  for (const k of declared) {
    if (!handled.has(k)) add("ipc", "src/shared/ipc-channels.ts", 0, `channel ${k} has no handler in controllers/`);
    if (!invoked.has(k)) add("ipc", "src/shared/ipc-channels.ts", 0, `channel ${k} is missing from the preload`);
  }
  for (const k of [...handled, ...invoked]) if (!declared.includes(k)) add("ipc", "src/", 0, `IPC.${k} is used but not declared`);
}

// Point 15: the three versions must be equal
const ver = {};
try {
  ver["package.json"] = readFileSync(join(root, "package.json"), "utf8").match(/"version"\s*:\s*"([^"]+)"/)?.[1];
  ver["config.ts APP_VERSION"] = readFileSync(join(root, "src/shared/config.ts"), "utf8").match(/APP_VERSION\s*=\s*["']([^"']+)/)?.[1];
  ver["CHANGELOG top"] = readFileSync(join(root, "docs/release/CHANGELOG.md"), "utf8").match(/^## \[(\d+\.\d+\.\d+)\]/m)?.[1];
} catch {
  add("15", "docs/release/CHANGELOG.md", 0, "version file or changelog is unreadable");
}
if (new Set(Object.values(ver)).size > 1) add("15", "(versions)", 0, `versions differ: ${JSON.stringify(ver)}`);

// Point 16: .gitignore
const gi = join(root, ".gitignore");
if (!existsSync(gi)) add("16", ".gitignore", 0, "file is missing");
else {
  const set = new Set(readFileSync(gi, "utf8").split(/\r?\n/).map((l) => l.trim()));
  for (const need of ["node_modules/", "/dist/", "/out/", "/release/", ".env", "tasks/", ".claude/settings.local.json", ".claude/agent-memory/"])
    if (!set.has(need)) add("16", ".gitignore", 0, `missing entry: ${need}`);
  for (const bad of ["scripts/", "test/", ".claude/settings.json", "docs/release/CHANGELOG.md", "CLAUDE.md"])
    if (set.has(bad)) add("16", ".gitignore", 0, `must not ignore: ${bad}`);
}

console.log(findings.length ? `${findings.join("\n")}\n\n${findings.length} finding(s).` : "OK: no finding.");
process.exit(findings.length ? 1 : 0);

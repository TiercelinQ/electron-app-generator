# Electron App Generator - Unified

> Claude Code generator for **Windows desktop apps** - Node.js · Electron · React · TypeScript.

Part of a family of Claude Code generators. See also [flutter-app-generator](https://github.com/TiercelinQ/flutter-app-generator), [python-app-generator](https://github.com/TiercelinQ/python-app-generator), [sf-node-generator](https://github.com/TiercelinQ/sf-node-generator), and [vscode-ext-generator](https://github.com/TiercelinQ/vscode-ext-generator).

Unified edition: the full generation pipeline **plus** post-delivery maintenance skills, an explicit role per skill, persisted specs, centralized executable verification, and native memory.

---

## What it does

A structured prompt system that generates complete, production-ready Electron/React desktop applications through a 5-phase cycle, then maintains them:

1. **Scoping** - 8 questions (objective, DB, prefs, i18n, tests, icon, packaging, Salesforce CLI opt-in) + color palette (named or custom; accent + optional overrides, neutrals and semantics derived, WCAG AA check)
2. **Featuring** - structured feature sheet, explicit out-of-scope, locked sizing
3. **Surfaces** - topbar tabs, drawer/modal, toast position (6 positions), splash screen
4. **Architect** - full file tree, IPC channel table, tokens→CSS table - locked before any code is written
5. **Development** - auto-chained batch delivery, seed script if a DB is used

Each phase writes a spec in the user's language to `docs/specs/` (`01-scoping` … `04-architect`); the contract is the source of truth.

**Maintenance commands**: `/electron-add-feature` (add a feature, contract-compliant), `/electron-trace-feature` (trace behavior), `/electron-fix-issue` (root-cause debugging with a decision tree), `/electron-refactor-code` (validated, behavior-preserving), `/electron-migrate-design` (convert a v1.x app to design system v2.0), `/electron-run-tests` (executable verification). Plus `/electron-load-project` and `/electron-generate-readme` to load/document existing apps.

Every generated app enforces the same visual design system, strict MVC architecture, and locked Electron security.

---

## Generated app stack

| Element        | Value                                                       |
| -------------- | ----------------------------------------------------------- |
| Target OS      | Windows                                                     |
| Runtime        | Node.js 24 LTS+ · Electron stable (≥ 42)                    |
| Language       | TypeScript strict                                          |
| Renderer       | React 19 - functional components + hooks                    |
| Build          | electron-vite                                               |
| Architecture   | Strict MVC - main = Models · renderer = Views · IPC = Controllers |
| Styling        | Centralized CSS - `tokens.css` + `styles.css`               |
| Icons          | Lucide (`lucide-react`, local npm)                          |
| i18n           | i18next + react-i18next FR/EN (opt-in)                      |
| DB             | SQLite (better-sqlite3, versioned migrations) · JSON · CSV · none (opt-in) |
| Logging        | electron-log (file transport, mandatory)                    |
| Tests          | Vitest + Testing Library (opt-in)                          |
| Salesforce CLI | `sf` v2 wrapper via cross-spawn + starter Org Manager (opt-in) |
| Packaging      | electron-builder (NSIS + portable, opt-in)                  |
| Security       | contextIsolation · sandbox · no nodeIntegration · strict CSP |
| Quality        | ESLint + Prettier · JSDoc/TSDoc · IpcResult<T> error contract |

---

## Requirements

```bash
claude --version    # Claude Code CLI - installed and authenticated
node --version      # Node.js 24 LTS+
```

---

## Getting started

```bash
git clone https://github.com/TiercelinQ/electron-app-generator.git
cd electron-app-generator
claude
```

Then in Claude Code:

```
/electron-app
```

---

## Commands

| Command                 | Action                                             |
| ----------------------- | -------------------------------------------------- |
| `/electron-app`         | Start menu (4 entry points incl. maintenance)      |
| `/electron-p1-scoping`       | Scoping - 8 questions + color palette              |
| `/electron-p2-featuring`       | Featuring - requirements sheet + locked sizing     |
| `/electron-p3-surfaces`        | Surfaces - layout proposal + customization        |
| `/electron-p4-architect`       | Architect - locked architecture contract (IPC)     |
| `/electron-p5-development` | Auto-chained batch delivery                        |
| `/electron-add-feature`            | Add a feature to a shipped project                 |
| `/electron-trace-feature`              | Trace a feature across the MVC/IPC layers          |
| `/electron-fix-issue`                  | Fix a bug - decision tree, root cause              |
| `/electron-refactor-code`             | Refactor under explicit validation only            |
| `/electron-migrate-design`            | Convert a v1.x app to design system v2.0           |
| `/electron-run-tests`                 | Executable verification (typecheck, lint, build)   |
| `/electron-load-project`       | Load an existing project from its specs/README     |
| `/electron-generate-readme`      | Generate README.md for an existing project         |
| `/electron-save-session`              | Save current session state                         |
| `/electron-show-state`               | Current project status                             |
| `/electron-show-contract`              | Display locked architecture contract               |
| `/electron-save-memory`            | Persist a note in Claude Code native memory        |

---

## Generated app structure

```
my-app/
├── package.json · electron.vite.config.ts · tsconfig*.json · eslint.config.mjs
├── electron-builder.yml · README.md
├── CLAUDE.md                      # Project identity (origin, business context, deviations)
├── .claude/settings.json          # Guardrails + verification hook (self-enforced app)
├── docs/specs/                    # Generation specs (user's language): 01-scoping … 04-architect
├── resources/                     # .ico icon, packaging assets
├── scripts/ensure-electron.cjs    # Electron binary reliability (postinstall)
└── src/
    ├── shared/                    # config.ts · types.ts (WindowApi) · ipc-channels.ts
    ├── main/                      # index.ts (security) · models/ · controllers/
    ├── preload/index.ts           # contextBridge (minimal surface)
    └── renderer/
        ├── index.html             # CSP meta
        └── src/                   # main.tsx · App.tsx · views/ · hooks/ · utils/ · i18n/ · styles/
```

---

## Design system

All generated apps share the same visual system, defined in `.claude/design-system.md` (v2.0):

- **Depth by stroke** - borders express hierarchy and elevation, zero shadows, zero gradients; soft 5px radius
- **CSS tokens** - all colors, sizes and durations are `var(--token)`; full light/dark theme via a single `[data-theme="dark"]` block
- **system-ui** typography (native OS face - Segoe UI Variable on Windows 11)
- **Color palette** - one mandatory accent (+ up to 4 optional role overrides); accent-tinted neutrals, accent stops, and per-project semantic colors all derived from it (info = accent). Default "Steel Blue" + Teal, Forest, Slate, Amber, Ruby named palettes + custom palette
- **Lucide icons** (`lucide-react`, stroke 1.75) and one signature gesture: the sliding underline on tabs
- **Toasts only** - no inline banners, no `dialog.showMessageBox`/`alert`/`confirm` for business errors

---

## Security

`.claude/rules/security.md` is non-negotiable, applied to 100% of generated apps: locked `webPreferences` (`contextIsolation`, `nodeIntegration: false`, `sandbox`), strict CSP, every IPC input validated on the main side, minimal preload surface (named functions only), zero remote resource. `/electron-fix-issue` and `/electron-add-feature` always route through it.

---

## Documentation

- [GUIDE.md](GUIDE.md) - full usage guide (FR)
- `.claude/design-system.md` - visual token reference
- `.claude/layout.md` - layout companion (pattern catalog + proposed default composition + toast spec)
- `.claude/rules/` - domain rules:
  - `mvc.md` · `css.md` · `errors.md` · `security.md` · `config.md` · `db.md` · `sf-cli.md` (opt-in) · `splash.md` (opt-in) · `tests.md` (opt-in) · `logging.md` · `readme.md`
  - `verification.md` - single source of truth for executable + static checks
- `.claude/sf-cli-reference/` - `sf` v2 command/flag catalog (loaded by section when the Salesforce integration is on)

---

## Generator family

| Generator | Stack | Target |
| --------- | ----- | ------ |
| [python-app-generator](https://github.com/TiercelinQ/python-app-generator) | Python · PySide6 · QSS | Windows desktop |
| [electron-app-generator](https://github.com/TiercelinQ/electron-app-generator) | Node.js · Electron · React · TS | Windows desktop |
| [flutter-app-generator](https://github.com/TiercelinQ/flutter-app-generator) | Flutter · Dart · Riverpod | Android |
| [sf-node-generator](https://github.com/TiercelinQ/sf-node-generator) | Node.js · TypeScript · Salesforce CLI | Headless CLI |
| [vscode-ext-generator](https://github.com/TiercelinQ/vscode-ext-generator) | TypeScript · esbuild · native theming | VS Code extension |

---

## License

MIT

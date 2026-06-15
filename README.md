# Electron App Generator - Unified

> Claude Code generator for **Windows desktop apps** - Node.js · Electron · React · TypeScript.

Part of a family of Claude Code generators. See also [python-app-generator](https://github.com/TiercelinQ/python-app-generator) and [flutter-app-generator](https://github.com/TiercelinQ/flutter-app-generator).

Unified edition: the full generation pipeline **plus** post-delivery maintenance skills, an explicit role per skill, persisted specs, centralized executable verification, and native memory.

---

## What it does

A structured prompt system that generates complete, production-ready Electron/React desktop applications through a 5-phase cycle, then maintains them:

1. **Scoping** - 6 questions (objective, DB, prefs, i18n, icon, tests) + primary color
2. **Featuring** - structured feature sheet, explicit out-of-scope, locked sizing
3. **Designing** - topbar tabs, drawer/modal, toast position
4. **Architect** - full file tree, IPC channel table, tokens→CSS table - locked before any code is written
5. **Development** - auto-chained batch delivery, seed script if a DB is used

Each phase writes a French spec to `docs/specs/` (`01-scoping` … `04-architect`); the contract is the source of truth.

**Maintenance commands**: `/add-feature` (add a feature, contract-compliant), `/trace-feature` (trace behavior), `/fix-issue` (root-cause debugging with a decision tree), `/refactor-code` (validated, behavior-preserving), `/run-tests` (executable verification). Plus `/load-project` and `/generate-readme` to load/document existing apps.

Every generated app enforces the same visual design system, strict MVC architecture, and locked Electron security.

---

## Generated app stack

| Element        | Value                                                       |
| -------------- | ----------------------------------------------------------- |
| Target OS      | Windows                                                     |
| Runtime        | Node.js 22 LTS+ · Electron stable (≥ 42)                    |
| Language       | TypeScript strict                                          |
| Renderer       | React 19 - functional components + hooks                    |
| Build          | electron-vite                                               |
| Architecture   | Strict MVC - main = Models · renderer = Views · IPC = Controllers |
| Styling        | Centralized CSS - `tokens.css` + `styles.css`               |
| Icons          | Font Awesome Free (local npm)                               |
| i18n           | i18next + react-i18next FR/EN (opt-in)                      |
| DB             | better-sqlite3 - versioned migrations (opt-in)             |
| Tests          | Vitest + Testing Library (opt-in)                          |
| Packaging      | electron-builder (NSIS + portable)                          |
| Security       | contextIsolation · sandbox · no nodeIntegration · strict CSP |
| Quality        | ESLint + Prettier · JSDoc/TSDoc · IpcResult<T> error contract |

---

## Requirements

```bash
claude --version    # Claude Code CLI - installed and authenticated
node --version      # Node.js 22 LTS+
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
| `/p1-scoping`       | Scoping - 6 questions + primary color              |
| `/p2-featuring`       | Featuring - requirements sheet + locked sizing     |
| `/p3-designing`        | Designing - layout proposal + customization        |
| `/p4-architect`       | Architect - locked architecture contract (IPC)     |
| `/p5-development` | Auto-chained batch delivery                        |
| `/add-feature`            | Add a feature to a shipped project                 |
| `/trace-feature`              | Trace a feature across the MVC/IPC layers          |
| `/fix-issue`                  | Fix a bug - decision tree, root cause              |
| `/refactor-code`             | Refactor under explicit validation only            |
| `/run-tests`                 | Executable verification (typecheck, lint, build)   |
| `/load-project`       | Load an existing project from its specs/README     |
| `/generate-readme`      | Generate README.md for an existing project         |
| `/save-session`              | Save current session state                         |
| `/show-state`               | Current project status                             |
| `/show-contract`              | Display locked architecture contract               |
| `/save-memory`            | Persist a note in Claude Code native memory        |

---

## Generated app structure

```
my-app/
├── package.json · electron.vite.config.ts · tsconfig*.json · eslint.config.mjs
├── electron-builder.yml · README.md
├── CLAUDE.md                      # Project identity (origin, business context, deviations)
├── .claude/settings.json          # Guardrails + verification hook (self-enforced app)
├── docs/specs/                    # Generation specs (FR): 01-scoping … 04-architect
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

All generated apps share the same visual system, defined in `design-system.md`:

- **Flat design** - zero border-radius, zero shadows, zero gradients
- **CSS tokens** - all colors, sizes and durations are `var(--token)`; full light/dark theme via a single `[data-theme="dark"]` block
- **Segoe UI** typography (Windows native)
- **Steel Blue** primary color recommended by default (+ 4 contextual proposals) - 4 token values to change the entire app color
- **Toasts only** - no inline banners, no `dialog.showMessageBox`/`alert`/`confirm` for business errors

---

## Security

`rules/security.md` is non-negotiable, applied to 100% of generated apps: locked `webPreferences` (`contextIsolation`, `nodeIntegration: false`, `sandbox`), strict CSP, every IPC input validated on the main side, minimal preload surface (named functions only), zero remote resource. `/fix-issue` and `/add-feature` always route through it.

---

## Documentation

- [GUIDE.md](GUIDE.md) - full usage guide (FR)
- `design-system.md` - visual token reference
- `layout.md` - layout reference (shell, topbar, drawer, statusbar, toasts)
- `rules/` - domain rules:
  - `mvc.md` · `css.md` · `errors.md` · `security.md` · `config.md` · `db.md` · `tests.md`
  - `verification.md` - single source of truth for executable + static checks

---

## Generator family

| Generator | Stack | Target |
| --------- | ----- | ------ |
| [claude-python-app-generator](https://github.com/TiercelinQ/claude-python-app-generator) | Python · PyQt6 · QSS | Windows desktop |
| [electron-app-generator](https://github.com/TiercelinQ/electron-app-generator) | Node.js · Electron · React · TS | Windows desktop |
| [flutter-app-generator](https://github.com/TiercelinQ/flutter-app-generator) | Flutter · Dart · Riverpod | Android |

---

## License

MIT

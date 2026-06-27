# Electron App Generator - Unified

> Claude Code generator for **Windows desktop apps** - Node.js · Electron · React · TypeScript.

Part of a family of Claude Code generators. See also [python-app-generator](https://github.com/TiercelinQ/python-app-generator) and [flutter-app-generator](https://github.com/TiercelinQ/flutter-app-generator).

Unified edition: the full generation pipeline **plus** post-delivery maintenance skills, an explicit role per skill, persisted specs, centralized executable verification, and native memory.

---

## What it does

A structured prompt system that generates complete, production-ready Electron/React desktop applications through a 5-phase cycle, then maintains them:

1. **Scoping** - 6 questions (objective, DB, prefs, i18n, icon, tests) + color palette (named or custom; 5 roles, dark + supporting tokens derived, WCAG AA check)
2. **Featuring** - structured feature sheet, explicit out-of-scope, locked sizing
3. **Designing** - topbar tabs, drawer/modal, toast position
4. **Architect** - full file tree, IPC channel table, tokens→CSS table - locked before any code is written
5. **Development** - auto-chained batch delivery, seed script if a DB is used

Each phase writes a spec in the user's language to `docs/specs/` (`01-scoping` … `04-architect`); the contract is the source of truth.

**Maintenance commands**: `/electron-add-feature` (add a feature, contract-compliant), `/electron-trace-feature` (trace behavior), `/electron-fix-issue` (root-cause debugging with a decision tree), `/electron-refactor-code` (validated, behavior-preserving), `/electron-run-tests` (executable verification). Plus `/electron-load-project` and `/electron-generate-readme` to load/document existing apps.

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
| DB             | SQLite (better-sqlite3, versioned migrations) · JSON · CSV · none (opt-in) |
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
| `/electron-p1-scoping`       | Scoping - 6 questions + color palette              |
| `/electron-p2-featuring`       | Featuring - requirements sheet + locked sizing     |
| `/electron-p3-designing`        | Designing - layout proposal + customization        |
| `/electron-p4-architect`       | Architect - locked architecture contract (IPC)     |
| `/electron-p5-development` | Auto-chained batch delivery                        |
| `/electron-add-feature`            | Add a feature to a shipped project                 |
| `/electron-trace-feature`              | Trace a feature across the MVC/IPC layers          |
| `/electron-fix-issue`                  | Fix a bug - decision tree, root cause              |
| `/electron-refactor-code`             | Refactor under explicit validation only            |
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

All generated apps share the same visual system, defined in `.claude/design-system.md`:

- **Flat design** - zero border-radius, zero shadows, zero gradients
- **CSS tokens** - all colors, sizes and durations are `var(--token)`; full light/dark theme via a single `[data-theme="dark"]` block
- **Segoe UI** typography (Windows native)
- **Color palette** - 5 roles (main background, secondary background, accent, text, details) chosen for the light theme; dark theme and all supporting tokens derived. Default "Steel Blue" + Teal, Forest, Slate, Amber, Ruby named palettes + custom palette; semantic colors stay fixed
- **Toasts only** - no inline banners, no `dialog.showMessageBox`/`alert`/`confirm` for business errors

---

## Security

`.claude/rules/security.md` is non-negotiable, applied to 100% of generated apps: locked `webPreferences` (`contextIsolation`, `nodeIntegration: false`, `sandbox`), strict CSP, every IPC input validated on the main side, minimal preload surface (named functions only), zero remote resource. `/electron-fix-issue` and `/electron-add-feature` always route through it.

---

## Documentation

- [GUIDE.md](GUIDE.md) - full usage guide (FR)
- `.claude/design-system.md` - visual token reference
- `.claude/layout.md` - layout reference (shell, topbar, drawer, statusbar, toasts)
- `.claude/rules/` - domain rules:
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

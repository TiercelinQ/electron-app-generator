# Electron App Generator

> Claude Code generator for **Windows desktop apps** — Node.js · Electron · TypeScript · React · electron-vite.

Part of a family of Claude Code generators. See also [python-app-generator](https://github.com/TiercelinQ/claude-python-app-generator) and [flutter-app-generator](https://github.com/TiercelinQ/flutter-app-generator).

---

## What it does

A structured prompt system that generates complete, production-ready Electron applications through a 5-phase cycle:

1. **Scoping** — stack decisions, primary color, library validation, lot sizing
2. **Requirements** — structured feature sheet, explicit out-of-scope
3. **Layout** — navigation, drawer/modal, toast position
4. **Architecture contract** — full file tree, IPC channel map, CSS token table — locked before any code is written
5. **Development** — files written directly to disk in batches, no manual steps

Every generated app enforces the same visual design system, security rules, and MVC architecture.

---

## Generated app stack

| Element   | Value                                   |
| --------- | --------------------------------------- |
| Runtime   | Node.js 22 LTS+ · Electron stable (≥42) |
| Language  | TypeScript strict                       |
| Renderer  | React 19                                |
| Build     | electron-vite                           |
| Styling   | Centralized CSS — tokens + data-theme   |
| Icons     | Font Awesome Free (npm, local — no CDN) |
| i18n      | i18next FR/EN                           |
| Database  | better-sqlite3 (optional)               |
| Packaging | electron-builder (NSIS + portable)      |
| Quality   | ESLint · Prettier · TypeScript strict   |

---

## Requirements

```bash
# Claude Code CLI — installed and authenticated
claude --version

# Node.js 22 LTS+
node --version
npm --version
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

| Command                 | Action                                      |
| ----------------------- | ------------------------------------------- |
| `/electron-app`         | Start menu / resume / load existing project |
| `/phase1-cadrage`       | Scoping — questions + primary color         |
| `/phase2-analyse`       | Structured requirements sheet               |
| `/phase3-layout`        | Layout proposal + customization             |
| `/phase4-contrat`       | Locked architecture contract                |
| `/phase5-developpement` | Batch delivery — files written to disk      |
| `/charger-projet`       | Load an existing project from its README.md |
| `/generate-readme`      | Generate README.md for an existing project  |
| `/session`              | Save current session state                  |
| `/statut`               | Current project status                      |
| `/contrat`              | Display locked architecture contract        |
| `/memoriser`            | Memorize an error, decision, or preference  |

---

## Generated app structure

```
my-app/
├── package.json
├── electron.vite.config.ts
├── tsconfig.json · tsconfig.node.json · tsconfig.web.json
├── eslint.config.mjs · .prettierrc
├── electron-builder.yml
├── README.md
├── resources/                     # icon.ico
├── scripts/
│   └── ensure-electron.cjs        # Electron binary install guard (postinstall)
└── src/
    ├── shared/
    │   ├── config.ts              # App constants
    │   ├── types.ts               # DTOs · IpcResult · WindowApi interface
    │   └── ipc-channels.ts        # Centralized IPC channel names
    ├── main/
    │   ├── index.ts               # BrowserWindow · security setup
    │   ├── models/                # Business logic · data access
    │   └── controllers/           # ipcMain handlers
    ├── preload/
    │   └── index.ts               # contextBridge — window.api
    └── renderer/
        ├── index.html             # Strict CSP
        └── src/
            ├── views/             # React components
            ├── hooks/
            ├── utils/helpers.ts
            ├── i18n/
            └── styles/
                ├── tokens.css     # :root + [data-theme="dark"]
                └── styles.css     # var(--token) only — no hard-coded values
```

---

## Design system

All generated apps share the same visual system, defined in `.claude/design-system.md`:

- **Flat design** — zero border-radius, zero shadows, zero gradients
- **CSS custom properties** — all colors, sizes and durations are tokens; light/dark theme via `data-theme` attribute on `<html>`
- **Segoe UI** typography (Windows native)
- **Slate Blue** primary color by default — 4 token values to change the entire app color
- **Toasts only** — no inline banners, no `alert()`, no `dialog.showMessageBox` for business errors

---

## Security

Enforced on every generated app (`rules/security.md`):

- `contextIsolation: true` · `nodeIntegration: false` · `sandbox: true`
- Strict CSP in `index.html`
- All IPC inputs validated as `unknown` before use
- Parametrized SQL only — no string interpolation
- No remote module, no deprecated Electron APIs

---

## Documentation

- [GUIDE.md](GUIDE.md) — full usage guide
- `.claude/design-system.md` — visual token reference
- `.claude/layout.md` — layout reference (topbar, toasts, drawer, modal, table, pagination)
- `.claude/rules/` — domain rules (MVC, CSS, errors, config, security)

---

## Generator family

| Generator                                                                         | Stack                           | Target          |
| --------------------------------------------------------------------------------- | ------------------------------- | --------------- |
| [claude-python-app-generator](https://github.com/TiercelinQ/python-app-generator) | Python · PyQt6 · QSS            | Windows desktop |
| [electron-app-generator](https://github.com/TiercelinQ/electron-app-generator)    | Node.js · Electron · React · TS | Windows desktop |
| [flutter-app-generator](https://github.com/TiercelinQ/flutter-app-generator)      | Flutter · Dart · Riverpod       | Android         |

---

## License

MIT

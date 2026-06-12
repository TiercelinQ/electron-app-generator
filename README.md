# Electron App Generator

> Système de génération d'applications desktop **Windows** en **Node.js / Electron / TypeScript / React**, piloté par **Claude Code**.

Pendant Electron du [python-app-generator](https://github.com/TiercelinQ/claude-python-app-generator) — mêmes phases, mêmes commandes, même design system — adapté au web (tokens CSS, IPC sécurisé, electron-vite).

---

## Fonctionnalités

- **Cycle en 5 phases** : cadrage → analyse → layout → contrat architectural verrouillé → développement par lots
- **MVC strict mappé sur Electron** : `main/models` · `main/controllers` + `preload` (IPC) · `renderer/views` (React)
- **Design system contraignant** : tokens CSS light/dark, flat design, Font Awesome Free (local), toasts overlay
- **Sécurité Electron non négociable** : `contextIsolation`, `sandbox`, CSP stricte, validation IPC
- **Continuité** : sauvegarde/reprise de session, contrat consultable, mémoire des décisions

---

## Stack des applications générées

| Élément     | Valeur                                  |
| ----------- | --------------------------------------- |
| Runtime     | Node.js 20 LTS+ · Electron stable (≥30) |
| Langage     | TypeScript strict                       |
| Renderer    | React 18                                |
| Build       | electron-vite                           |
| Style       | CSS centralisé — tokens + data-theme    |
| Icônes      | Font Awesome Free (npm, local)          |
| i18n        | i18next FR/EN                           |
| DB (option) | better-sqlite3                          |
| Packaging   | electron-builder (NSIS + portable)      |
| Qualité     | ESLint + Prettier · TypeScript strict   |

---

## Prérequis

```bash
# Claude Code CLI installé et connecté
claude --version

# Node.js 20 LTS+
node --version
npm --version
```

---

## Démarrage

```bash
git clone https://github.com/TiercelinQ/electron-app-generator.git
cd electron-app-generator
claude
```

Puis dans Claude Code :

```
/electron-app
```

---

## Commandes disponibles

| Commande                | Action                                             |
| ----------------------- | -------------------------------------------------- |
| `/electron-app`         | Menu démarrage / reprise                           |
| `/phase1-cadrage`       | Cadrage — questions + couleur primaire             |
| `/phase2-analyse`       | Fiche besoins structurée                           |
| `/phase3-layout`        | Proposition layout + personnalisation              |
| `/phase4-contrat`       | Contrat architectural verrouillé                   |
| `/phase5-developpement` | Livraison par lots — fichiers écrits sur le disque |
| `/charger-projet`       | Charger un projet existant depuis son README.md    |
| `/generate-readme`      | Générer README.md d'un projet existant             |
| `/session`              | Sauvegarder la session                             |
| `/statut`               | État courant du projet                             |
| `/contrat`              | Arborescence du contrat validé                     |
| `/memoriser`            | Mémoriser une erreur, décision ou préférence       |

---

## Structure d'une application générée

```
mon-app/
├── package.json
├── electron.vite.config.ts
├── tsconfig.json · tsconfig.node.json · tsconfig.web.json
├── eslint.config.mjs · .prettierrc
├── electron-builder.yml
├── README.md
├── resources/                     # icon.ico
└── src/
    ├── shared/
    │   ├── config.ts              # Constantes applicatives
    │   ├── types.ts               # DTOs · IpcResult · interface WindowApi
    │   └── ipc-channels.ts        # Canaux IPC centralisés
    ├── main/
    │   ├── index.ts               # BrowserWindow · sécurité
    │   ├── models/                # Logique métier · accès données
    │   └── controllers/           # Handlers ipcMain
    ├── preload/
    │   └── index.ts               # contextBridge — window.api
    └── renderer/
        ├── index.html             # CSP stricte
        └── src/
            ├── views/             # Composants React
            ├── hooks/
            ├── utils/helpers.ts
            ├── i18n/
            └── styles/
                ├── tokens.css     # :root + [data-theme="dark"]
                └── styles.css     # var(--token) uniquement
```

---

## Documentation

- [GUIDE.md](GUIDE.md) — guide complet d'utilisation
- `.claude/design-system.md` — tokens visuels contraignants
- `.claude/layout.md` — référence layout (topbar, toasts, drawer, modale, tableau, pagination)
- `.claude/rules/` — règles par domaine (MVC, CSS, erreurs, config, sécurité)

---

## Générateurs de la même famille

- [claude-python-app-generator](https://github.com/TiercelinQ/claude-python-app-generator) — Python · PyQt6 · Windows
- [flutter-app-generator](https://github.com/TiercelinQ/flutter-app-generator) — Flutter · Dart · Android

---

## Licence

MIT

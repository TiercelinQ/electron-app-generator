# Guide d'utilisation — Electron App Generator (unifié)

> Version unifiée : pipeline de génération + skills de maintenance, rôle explicite par skill, specs persistées, vérification exécutable, mémoire native.

---

## Structure du framework

```
claude-electron-framework/
├── CLAUDE.md                 # Instructions core (EN) · persona · communication FR · index commandes · calibrage
├── design-system.md          # Référence visuelle contraignante (tokens CSS) — source de vérité unique
├── layout.md                 # Référence layout contraignante — shell, topbar, drawer, statusbar, toasts
├── rules/
│   ├── mvc.md                # main=Models · preload+IPC=Controllers · renderer=Views, livraison par lots
│   ├── css.md                # Tokens CSS, thème data-theme, flat design, nommage
│   ├── errors.md             # Contrat IpcResult<T>, toasts, Error Boundary + uncaughtException
│   ├── security.md           # Sécurité Electron verrouillée (webPreferences, CSP, validation IPC)
│   ├── config.md             # config.ts, versioning, postinstall ensure-electron.cjs, packaging
│   ├── db.md                 # Accès better-sqlite3, migrations versionnées
│   ├── tests.md              # Vitest + Testing Library, couverture par couche
│   └── verification.md       # Vérification EXÉCUTABLE centralisée + intégrité statique
├── skills/
│   ├── electron-app/         # Menu démarrage / reprise / maintenance (4 options)
│   ├── p1-scoping/       # Scoping — 6 questions + couleur → docs/specs/01-scoping.md
│   ├── p2-featuring/       # Fiche besoins → docs/specs/02-featuring.md
│   ├── p3-designing/        # Proposition layout → docs/specs/03-designing.md
│   ├── p4-architect/       # Contrat architectural verrouillé → docs/specs/04-architect.md
│   ├── p5-development/ # Livraison par lots (enchaînement auto)
│   ├── implement/            # Ajouter une feature à un projet livré (respect contrat + sécurité)
│   ├── analyze/              # Tracer une fonctionnalité renderer→preload→controller→model
│   ├── fix/                  # Corriger un bug — arbre de décision, cause racine
│   ├── refactor/             # Restructurer sous validation explicite uniquement
│   ├── test/                 # Vérification exécutable (typecheck, lint, build)
│   ├── load-project/       # Chargement d'un projet existant
│   ├── generate-readme/      # Génération README.md projet existant
│   ├── session/              # Sauvegarde de session
│   ├── show-state/               # État courant du projet
│   ├── show-contract/              # Arborescence du contrat validé
│   └── memoriser/            # Persiste dans la mémoire native Claude Code
├── settings.json             # Permissions d'exécution (npm, npx, node)
├── GUIDE.md                  # Ce fichier
└── README.md                 # Présentation du repo GitHub (EN)
```

> Structure **plate** : un seul `design-system.md` et un seul `layout.md` (source de vérité unique). `CLAUDE.md` les importe via `@`.

---

## Nouveautés de la version unifiée

| Apport                        | Détail                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------- |
| **Rôle par skill**            | Chaque skill ouvre sur un persona ciblé (Role / Goal / Deliverable).            |
| **Specs persistées**          | Phases 1→4 écrivent `docs/specs/01-scoping.md` … `04-architect.md` (en français). |
| **Contrat = source de vérité**| `docs/specs/04-architect.md` relu par `/load-project`, `/show-contract`, `/feature-add`, `/refactor`. |
| **Skills de maintenance**     | `analyze`, `implement`, `fix`, `refactor`, `test` avec arbres de décision et anti-patterns. |
| **Vérification exécutable**   | `rules/verification.md` : typecheck, lint, build — échec bloquant.              |
| **Mémoire native**            | `/memoriser` écrit dans la mémoire native Claude Code + `MEMORY.md`.            |

---

## Installation

```bash
# Démarrer Claude Code depuis le dossier du framework (ou copier dans le projet cible).
claude
```

### Prérequis

```bash
claude --version      # Claude Code CLI installé et connecté
node --version        # Node.js 22 LTS+ (pour exécuter les apps générées)
```

### Activer la mémoire (une seule fois, par machine)

```
/config → Memory → Enable auto memory → On
```

---

## Démarrer une nouvelle application

```
/electron-app → 1
```

### Phase 1 — Scoping

6 questions en un seul bloc : objectif · base de données (SQLite better-sqlite3 / JSON / CSV / aucune) · préférences persistantes · i18n FR/EN · icône `.ico` · tests (Vitest + Testing Library). Puis choix de couleur primaire (Steel Blue recommandé par défaut + 4 propositions adaptées au contexte). Calibrage annoncé.

| Taille        | Lots (sans tests) | Lots (avec tests) |
| ------------- | ----------------- | ----------------- |
| Petit         | 3                 | 4                 |
| Moyen / Grand | 4                 | 5                 |

Écrit `docs/specs/01-scoping.md`.

### Phase 2 — Featuring

Fiche structurée + calibrage figé. Validation bloquante avant Phase 3. Écrit `docs/specs/02-featuring.md`.

### Phase 3 — Designing

Proposition issue de `layout.md` + personnalisation (onglets topbar, drawer/modale, position des toasts). Validation bloquante. Écrit `docs/specs/03-designing.md`.

### Phase 4 — Architect

Arborescence + rôle de chaque fichier + **tableau des canaux IPC** (canal → controller → model → `window.api` → view) + tableau tokens → CSS. **Verrouillé après validation.** Écrit `docs/specs/04-architect.md` (source de vérité).

### Phase 5 — Development

Fichiers écrits directement sur le disque. Annonce `Lot N/[total] — [contenu]`. Enchaînement automatique. Dernier lot : `scripts/ensure-electron.cjs`, instructions d'installation, `README.md` + `scripts/seed.ts` (jeu de données cohérent si une base est présente). Vérification exécutable appliquée.

---

## Reprendre une session

```
/session             # sauvegarder en fin de session (docs/sessions/)
/electron-app → 2    # reprendre : fournir le chemin du fichier SESSION
```

---

## Travailler sur un projet livré

```
/electron-app → 3     # ou directement /load-project depuis la racine du projet
```

Claude lit `docs/specs/04-architect.md` (priorité), sinon le README, sinon le code, puis applique toutes les règles. Projet sans README : `/generate-readme`.

### Maintenance (`/electron-app → 4`)

| Besoin                          | Commande      |
| ------------------------------- | ------------- |
| Ajouter une fonctionnalité      | `/feature-add`   |
| Comprendre / tracer le code     | `/analyze`     |
| Corriger un bug                 | `/fix`         |
| Restructurer (sous validation)  | `/refactor`    |
| Vérifier le build / lancer les checks | `/test`  |

---

## Vérification exécutable

`rules/verification.md` est la source unique. Commandes (échec bloquant quand l'environnement le permet) :

```bash
npm install                  # + postinstall ensure-electron.cjs
npm run typecheck            # tsc --noEmit (node + web)
npm run lint                 # eslint
npm run build                # electron-vite build
npm run dist                 # packaging — sur demande
```

> Module natif `better-sqlite3` : `npx electron-builder install-app-deps` après l'installation.
> `Error: Electron uninstall` → `npm run postinstall` (le script restaure le binaire depuis le cache).

`/test` exécute cette échelle ; `/fix` y renvoie pour confirmer une correction.

---

## Sécurité Electron

`rules/security.md` est non négociable et appliqué à 100% : `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, CSP stricte, validation de toute entrée IPC côté main, preload à surface minimale (fonctions nommées uniquement), zéro ressource distante. `/fix` et `/feature-add` y renvoient systématiquement.

---

## Gestion des anomalies et mémoire

Après correction (`/fix` ou Phase 5), Claude produit un bilan de nettoyage puis propose `Veux-tu mémoriser ce point ? /memoriser`. `/memoriser` catégorise et écrit dans la **mémoire native Claude Code** (+ `MEMORY.md`).

---

## Commandes de référence

| Commande                | Modèle | Action                                               |
| ----------------------- | ------ | ---------------------------------------------------- |
| `/electron-app`         | Haiku  | Menu démarrage / reprise / maintenance               |
| `/p1-scoping`       | Sonnet | Scoping — 6 questions + couleur                      |
| `/p2-featuring`       | Sonnet | Fiche besoins                                        |
| `/p3-designing`        | Sonnet | Proposition layout + personnalisation                |
| `/p4-architect`       | Sonnet | Contrat architectural verrouillé (canaux IPC)        |
| `/p5-development` | Sonnet | Livraison par lots — enchaînement automatique        |
| `/feature-add`            | Sonnet | Ajouter une feature à un projet livré                |
| `/analyze`              | Sonnet | Tracer une fonctionnalité à travers les couches      |
| `/fix`                  | Sonnet | Corriger un bug — cause racine                       |
| `/refactor`             | Sonnet | Restructurer sous validation                         |
| `/test`                 | Sonnet | Vérification exécutable                               |
| `/load-project`       | Sonnet | Charger un projet existant                           |
| `/generate-readme`      | Sonnet | Générer README.md d'un projet existant               |
| `/session`              | Haiku  | Sauvegarder la session                               |
| `/show-state`               | Haiku  | État courant                                         |
| `/show-contract`              | Haiku  | Contrat architectural validé                         |
| `/memoriser`            | Haiku  | Persister dans la mémoire native                     |

---

## Structure d'une application générée

```
mon-app/
├── package.json · electron.vite.config.ts · tsconfig*.json · eslint.config.mjs
├── electron-builder.yml · README.md
├── CLAUDE.md                      # Identité projet (origine, contexte, écarts) — généré en fin de Phase 5
├── .claude/settings.json          # Garde-fous + hook de vérification (app auto-contrôlée)
├── docs/specs/                    # Specs de génération (FR)
├── resources/                     # icône .ico, assets packaging
├── scripts/ensure-electron.cjs    # Fiabilisation du binaire Electron (postinstall)
└── src/
    ├── shared/                    # config.ts, types.ts (WindowApi), ipc-channels.ts
    ├── main/                      # index.ts (sécurité), models/, controllers/
    ├── preload/index.ts           # contextBridge (surface minimale)
    └── renderer/
        ├── index.html             # CSP meta
        └── src/                   # main.tsx, App.tsx, views/, hooks/, utils/, i18n/, styles/
```

---

## Points de vigilance

- `design-system.md` et `layout.md` sont la **source de vérité unique** — ne pas les dupliquer.
- Sécurité Electron (`rules/security.md`) non négociable — jamais affaiblie, même temporairement.
- Les canaux IPC sont centralisés dans `src/shared/ipc-channels.ts` — zéro chaîne de canal en dur ailleurs.
- Le contrat (`docs/specs/04-architect.md`) est verrouillé. Tout changement structurel passe par `/feature-add` ou le protocole de déclaration d'écart.
- `/load-project`, `/generate-readme`, `/feature-add`, `/analyze`, `/fix`, `/refactor`, `/test` s'invoquent depuis la racine du projet cible.
- Aucune ressource distante (CDN) — tout est embarqué via npm (contrainte CSP).

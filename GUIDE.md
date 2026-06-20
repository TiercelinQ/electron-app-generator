# Guide d'utilisation — Electron App Generator (unifié)

> Version unifiée : pipeline de génération + skills de maintenance, rôle explicite par skill, specs persistées, vérification exécutable, mémoire native.

---

## Structure du framework

```
claude-electron-framework/
├── CLAUDE.md                 # Instructions core (EN) · persona · communication FR · index commandes · calibrage
├── GUIDE.md                  # Ce fichier
├── README.md                 # Présentation du repo GitHub (EN)
├── LICENSE.txt
└── .claude/
    ├── design-system.md      # Référence visuelle contraignante (tokens CSS) — source de vérité unique
    ├── layout.md             # Référence layout contraignante — shell, topbar, drawer, statusbar, toasts
    ├── rules/
    │   ├── mvc.md            # main=Models · preload+IPC=Controllers · renderer=Views, livraison par lots
    │   ├── css.md            # Tokens CSS, thème data-theme, flat design, nommage
    │   ├── errors.md         # Contrat IpcResult<T>, toasts, Error Boundary + uncaughtException
    │   ├── security.md       # Sécurité Electron verrouillée (webPreferences, CSP, validation IPC)
    │   ├── config.md         # config.ts, versioning, postinstall ensure-electron.cjs, packaging
    │   ├── db.md             # Accès better-sqlite3, migrations versionnées
    │   ├── tests.md          # Vitest + Testing Library, couverture par couche
    │   └── verification.md   # Vérification EXÉCUTABLE centralisée + intégrité statique
    ├── skills/
    │   ├── electron-app/            # Menu démarrage / reprise / maintenance (4 options)
    │   ├── electron-p1-scoping/     # Scoping — 6 questions + couleur → docs/specs/01-scoping.md
    │   ├── electron-p2-featuring/   # Fiche besoins → docs/specs/02-featuring.md
    │   ├── electron-p3-designing/   # Proposition layout → docs/specs/03-designing.md
    │   ├── electron-p4-architect/   # Contrat architectural verrouillé → docs/specs/04-architect.md
    │   ├── electron-p5-development/ # Livraison par lots (enchaînement auto)
    │   ├── electron-add-feature/    # Ajouter une feature à un projet livré (respect contrat + sécurité)
    │   ├── electron-trace-feature/  # Tracer une fonctionnalité renderer→preload→controller→model
    │   ├── electron-fix-issue/      # Corriger un bug — arbre de décision, cause racine
    │   ├── electron-refactor-code/  # Restructurer sous validation explicite uniquement
    │   ├── electron-run-tests/      # Vérification exécutable (typecheck, lint, build)
    │   ├── electron-load-project/   # Chargement d'un projet existant
    │   ├── electron-generate-readme/ # Génération README.md projet existant
    │   ├── electron-save-session/   # Sauvegarde de session
    │   ├── electron-show-state/     # État courant du projet
    │   ├── electron-show-contract/  # Arborescence du contrat validé
    │   └── electron-save-memory/    # Persiste dans la mémoire native Claude Code
    ├── settings.json         # Permissions d'exécution (npm, npx, node) + garde-fous deny (.env, secrets, artefacts)
    └── settings.local.json   # Overrides locaux (non versionné)
```

> Source de vérité **unique** : un seul `design-system.md` et un seul `layout.md`, sous `.claude/`. `CLAUDE.md` les importe via `@`.

---

## Nouveautés de la version unifiée

| Apport                        | Détail                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------- |
| **Rôle par skill**            | Chaque skill ouvre sur un persona ciblé (Role / Goal / Deliverable).            |
| **Specs persistées**          | Phases 1→4 écrivent `docs/specs/01-scoping.md` … `04-architect.md` (dans la langue de l'utilisateur). |
| **Contrat = source de vérité**| `docs/specs/04-architect.md` relu par `/electron-load-project`, `/electron-show-contract`, `/electron-add-feature`, `/electron-refactor-code`. |
| **Skills de maintenance**     | `electron-trace-feature`, `electron-add-feature`, `electron-fix-issue`, `electron-refactor-code`, `electron-run-tests` avec arbres de décision et anti-patterns. |
| **Vérification exécutable**   | `rules/verification.md` : typecheck, lint, build — échec bloquant.              |
| **Mémoire native**            | `/electron-save-memory` écrit dans la mémoire native Claude Code + `MEMORY.md`.            |

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

6 questions en un seul bloc : objectif · base de données (SQLite better-sqlite3 / JSON / CSV / aucune) · préférences persistantes · i18n FR/EN · icône `.ico` · tests (Vitest + Testing Library). Puis choix de la **palette** : 5 rôles (fond principal, fond secondaire, accent, texte, détails) pour le thème clair, le sombre et les tokens secondaires étant dérivés. Palette « Teal » par défaut + 5 palettes nommées (Steel Blue, Forest, Slate, Amber, Ruby) + palette personnalisée ; contrôle de contraste WCAG AA (averti). Sémantiques figées. Calibrage annoncé.

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
/electron-save-session             # sauvegarder en fin de session (docs/sessions/)
/electron-app → 2    # reprendre : fournir le chemin du fichier SESSION
```

---

## Travailler sur un projet livré

```
/electron-app → 3     # ou directement /electron-load-project depuis la racine du projet
```

Claude lit `docs/specs/04-architect.md` (priorité), sinon le README, sinon le code, puis applique toutes les règles. Projet sans README : `/electron-generate-readme`.

### Maintenance (`/electron-app → 4`)

| Besoin                          | Commande      |
| ------------------------------- | ------------- |
| Ajouter une fonctionnalité      | `/electron-add-feature`   |
| Comprendre / tracer le code     | `/electron-trace-feature`     |
| Corriger un bug                 | `/electron-fix-issue`         |
| Restructurer (sous validation)  | `/electron-refactor-code`    |
| Vérifier le build / lancer les checks | `/electron-run-tests`  |

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

`/electron-run-tests` exécute cette échelle ; `/electron-fix-issue` y renvoie pour confirmer une correction.

---

## Sécurité Electron

`rules/security.md` est non négociable et appliqué à 100% : `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, CSP stricte, validation de toute entrée IPC côté main, preload à surface minimale (fonctions nommées uniquement), zéro ressource distante. `/electron-fix-issue` et `/electron-add-feature` y renvoient systématiquement.

---

## Gestion des anomalies et mémoire

Après correction (`/electron-fix-issue` ou Phase 5), Claude produit un bilan de nettoyage puis propose `Veux-tu mémoriser ce point ? /electron-save-memory`. `/electron-save-memory` catégorise et écrit dans la **mémoire native Claude Code** (+ `MEMORY.md`).

---

## Commandes de référence

| Commande                | Modèle | Action                                               |
| ----------------------- | ------ | ---------------------------------------------------- |
| `/electron-app`         | Haiku  | Menu démarrage / reprise / maintenance               |
| `/electron-p1-scoping`       | Sonnet | Scoping — 6 questions + couleur                      |
| `/electron-p2-featuring`       | Sonnet | Fiche besoins                                        |
| `/electron-p3-designing`        | Sonnet | Proposition layout + personnalisation                |
| `/electron-p4-architect`       | Sonnet | Contrat architectural verrouillé (canaux IPC)        |
| `/electron-p5-development` | Sonnet | Livraison par lots — enchaînement automatique        |
| `/electron-add-feature`            | Sonnet | Ajouter une feature à un projet livré                |
| `/electron-trace-feature`              | Sonnet | Tracer une fonctionnalité à travers les couches      |
| `/electron-fix-issue`                  | Sonnet | Corriger un bug — cause racine                       |
| `/electron-refactor-code`             | Sonnet | Restructurer sous validation                         |
| `/electron-run-tests`                 | Sonnet | Vérification exécutable                               |
| `/electron-load-project`       | Sonnet | Charger un projet existant                           |
| `/electron-generate-readme`      | Sonnet | Générer README.md d'un projet existant               |
| `/electron-save-session`              | Haiku  | Sauvegarder la session                               |
| `/electron-show-state`               | Haiku  | État courant                                         |
| `/electron-show-contract`              | Haiku  | Contrat architectural validé                         |
| `/electron-save-memory`            | Haiku  | Persister dans la mémoire native                     |

---

## Structure d'une application générée

```
mon-app/
├── package.json · electron.vite.config.ts · tsconfig*.json · eslint.config.mjs
├── electron-builder.yml · README.md
├── CLAUDE.md                      # Identité projet (origine, contexte, écarts) — généré en fin de Phase 5
├── .claude/settings.json          # Garde-fous + hook de vérification (app auto-contrôlée)
├── docs/specs/                    # Specs de génération (langue utilisateur)
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

- `.claude/design-system.md` et `.claude/layout.md` sont la **source de vérité unique** — ne pas les dupliquer.
- Sécurité Electron (`.claude/rules/security.md`) non négociable — jamais affaiblie, même temporairement.
- Les canaux IPC sont centralisés dans `src/shared/ipc-channels.ts` — zéro chaîne de canal en dur ailleurs.
- Le contrat (`docs/specs/04-architect.md`) est verrouillé. Tout changement structurel passe par `/electron-add-feature` ou le protocole de déclaration d'écart.
- `/electron-load-project`, `/electron-generate-readme`, `/electron-add-feature`, `/electron-trace-feature`, `/electron-fix-issue`, `/electron-refactor-code`, `/electron-run-tests` s'invoquent depuis la racine du projet cible.
- Aucune ressource distante (CDN) — tout est embarqué via npm (contrainte CSP).

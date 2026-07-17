# Guide d'utilisation — Electron App Generator (unifié)

> Version unifiée : pipeline de génération + skills de maintenance, rôle explicite par skill, specs persistées, vérification exécutable, mémoire native.

---

## Structure du framework

```
electron-app-generator/
├── CLAUDE.md                 # Instructions core (EN) · persona · communication FR · index commandes · calibrage
├── GUIDE.md                  # Ce fichier
├── README.md                 # Présentation du repo GitHub (EN)
├── LICENSE
└── .claude/
    ├── design-system.md      # Référence visuelle contraignante (v2.0, tokens CSS) — source de vérité unique
    ├── layout.md             # Cadre layout d'accompagnement — catalogue de patterns + composition par défaut + spec toasts
    ├── sf-cli-reference/     # Catalogue commandes/flags sf v2 (chargé par section si intégration Salesforce)
    ├── rules/
    │   ├── mvc.md            # main=Models · preload+IPC=Controllers · renderer=Views, livraison par lots
    │   ├── css.md            # Tokens CSS, thème data-theme, profondeur par le trait, nommage
    │   ├── errors.md         # Contrat IpcResult<T>, toasts, Error Boundary + uncaughtException
    │   ├── security.md       # Sécurité Electron verrouillée (webPreferences, CSP, validation IPC)
    │   ├── config.md         # config.ts, versioning, postinstall ensure-electron.cjs, packaging
    │   ├── db.md             # Accès better-sqlite3, migrations versionnées
    │   ├── sf-cli.md         # Intégration Salesforce CLI opt-in (runner cross-spawn, Org Manager)
    │   ├── splash.md         # Splash screen opt-in (fenêtre de démarrage, icône, thème)
    │   ├── tests.md          # Vitest + Testing Library, couverture par couche
    │   ├── logging.md        # electron-log obligatoire (fichier, niveaux, zéro console.log)
    │   ├── verification.md   # Vérification EXÉCUTABLE centralisée + intégrité statique
    │   └── readme.md         # Synchro README post-livraison (régénération auto)
    ├── skills/
    │   ├── electron-app/            # Menu démarrage / reprise / maintenance (4 options)
    │   ├── electron-p1-scoping/     # Scoping — 8 questions + couleur → docs/specs/01-scoping.md
    │   ├── electron-p2-featuring/   # Fiche besoins → docs/specs/02-featuring.md
    │   ├── electron-p3-surfaces/   # Proposition layout → docs/specs/03-surfaces.md
    │   ├── electron-p4-architect/   # Contrat architectural verrouillé → docs/specs/04-architect.md
    │   ├── electron-p5-development/ # Livraison par lots (enchaînement auto)
    │   ├── electron-add-feature/    # Ajouter une feature à un projet livré (respect contrat + sécurité)
    │   ├── electron-trace-feature/  # Tracer une fonctionnalité renderer→preload→controller→model
    │   ├── electron-fix-issue/      # Corriger un bug — arbre de décision, cause racine
    │   ├── electron-refactor-code/  # Restructurer sous validation explicite uniquement
    │   ├── electron-migrate-design/ # Convertir une app v1.x vers le design system v2.0
    │   ├── electron-release/        # Figer une version SemVer (changelog cumulé)
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

> Source de vérité **unique** : un seul `design-system.md` et un seul `layout.md`, sous `.claude/` (lus à la demande par les skills UI, non auto-importés — voir `CLAUDE.md` § BINDING REFERENCES). `design-system.md` est contraignant (skin) ; la composition décrite par `layout.md` est un **défaut modifiable**, co-défini en Phase 3 et verrouillé dans `docs/specs/04-architect.md`.

---

## Nouveautés de la version unifiée

| Apport                        | Détail                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------- |
| **Rôle par skill**            | Chaque skill ouvre sur un persona ciblé (Role / Goal / Deliverable).            |
| **Specs persistées**          | Phases 1→4 écrivent `docs/specs/01-scoping.md` … `04-architect.md` (dans la langue de l'utilisateur). |
| **Contrat = source de vérité**| `docs/specs/04-architect.md` relu par `/electron-load-project`, `/electron-show-contract`, `/electron-add-feature`, `/electron-refactor-code`. |
| **Skills de maintenance**     | `electron-trace-feature`, `electron-add-feature`, `electron-fix-issue`, `electron-refactor-code`, `electron-migrate-design`, `electron-release`, `electron-run-tests` avec arbres de décision et anti-patterns. |
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
node --version        # Node.js 24 LTS+ (pour exécuter les apps générées)
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

8 questions en un seul bloc : objectif · base de données (SQLite better-sqlite3 / JSON / CSV / aucune) · préférences persistantes · i18n FR/EN · tests (Vitest + Testing Library) · icône `.ico` · packaging (electron-builder) · intégration Salesforce CLI (opt-in `sf` v2 ; défaut recommandé à Yes si l'objectif mentionne Salesforce). Puis choix de la **palette** : un accent obligatoire + jusqu'à 4 rôles optionnels (fond principal, fond secondaire, texte, détails) en override. Tout le reste est dérivé de l'accent : neutres teintés (les deux thèmes), stops d'accent, couleurs sémantiques harmonisées vers l'accent (info = accent). Palette « Steel Blue » par défaut + 5 palettes nommées (Teal, Forest, Slate, Amber, Ruby) + palette personnalisée ; contrôle de contraste WCAG AA (averti, non bloquant), y compris sur les paires sémantiques dérivées.

Calibrage **provisoire** annoncé (figé après Phase 2) :

| Taille        | Lots (sans tests) | Lots (avec tests) |
| ------------- | ----------------- | ----------------- |
| Petit         | 3                 | 4                 |
| Moyen / Grand | 4                 | 5                 |

Écrit `docs/specs/01-scoping.md`.

### Phase 2 — Featuring

Fiche structurée + calibrage **confirmé** à partir du compte réel. Validation bloquante avant Phase 3. Écrit `docs/specs/02-featuring.md`.

### Phase 3 — Surfaces

Co-conception guidée. Questionnaire structurant (navigation horizontale ou verticale, organisation du contenu, formulaires et actions) appuyé sur le catalogue de patterns de `layout.md` §12 : topbar + onglets (défaut), sidebar verticale, barre de menus, master-detail. Puis proposition sur mesure, composition librement amendable, et questions de détail (position des onglets, drawer/modale, 6 positions de toasts, splash screen). Validation bloquante. Écrit `docs/specs/03-surfaces.md`.

> **Splash screen (opt-in)** : question Oui/Non (Oui recommandé). Si Oui, fenêtre de démarrage sans cadre affichée jusqu'à ce que la fenêtre principale soit prête, suivant le design system (flat, palette, dark mode). Elle affiche l'icône de l'app si définie (Phase 1) ; sinon, un chemin d'icône optionnel est demandé en Phase 3, à défaut le splash montre le nom de l'app. Durée minimale d'affichage configurable (`SPLASH_MIN_DURATION_MS`). Détail : `rules/splash.md`.

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
| Convertir une app v1.x vers le design system v2.0 | `/electron-migrate-design` |
| Figer une version SemVer (changelog cumulé) | `/electron-release` |
| Vérifier le build / lancer les checks | `/electron-run-tests`  |

---

## Vérification exécutable

`rules/verification.md` est la source unique. Commandes (échec bloquant quand l'environnement le permet) :

```bash
npm install                  # + postinstall ensure-electron.cjs
npm run typecheck            # tsc --noEmit (node + web)
npm run lint                 # eslint
npm run build                # electron-vite build
npm run dist                 # packaging — si activé (Phase 1 Q7) ou sur demande
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
| `/electron-p1-scoping`       | Sonnet | Scoping — 8 questions + couleur                      |
| `/electron-p2-featuring`       | Sonnet | Fiche besoins                                        |
| `/electron-p3-surfaces`        | Sonnet | Proposition layout + personnalisation                |
| `/electron-p4-architect`       | Sonnet | Contrat architectural verrouillé (canaux IPC)        |
| `/electron-p5-development` | Sonnet | Livraison par lots — enchaînement automatique        |
| `/electron-add-feature`            | Sonnet | Ajouter une feature à un projet livré                |
| `/electron-trace-feature`              | Sonnet | Tracer une fonctionnalité à travers les couches      |
| `/electron-fix-issue`                  | Sonnet | Corriger un bug — cause racine                       |
| `/electron-refactor-code`             | Sonnet | Restructurer sous validation                         |
| `/electron-migrate-design`            | Sonnet | Convertir une app v1.x vers le design system v2.0    |
| `/electron-release`                   | Sonnet | Figer une version SemVer depuis le changelog cumulé   |
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
├── docs/release/CHANGELOG.md      # Changelog SemVer (Keep a Changelog)
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

### Versioning & changelog

Chaque app générée porte une version SemVer et un changelog `docs/release/CHANGELOG.md` (format Keep a Changelog, rédigé en anglais). Les skills de maintenance (`add-feature`, `fix-issue`, `refactor-code`, `migrate-design`) accumulent leurs entrées sous `## [Unreleased]` ; `/electron-release` les fige en un bloc de version daté et incrémente la source de version (`package.json` + le miroir `src/shared/config.ts` `APP_VERSION`). La version n'est jamais incrémentée en silence. Voir `rules/versioning.md`.

---

## Points de vigilance

- `.claude/design-system.md` et `.claude/layout.md` sont la **source de vérité unique** — ne pas les dupliquer. La composition portée par `layout.md` est un défaut modifiable (retenue validée en Phase 3) ; le skin de `design-system.md` reste contraignant.
- Sécurité Electron (`.claude/rules/security.md`) non négociable — jamais affaiblie, même temporairement.
- Les canaux IPC sont centralisés dans `src/shared/ipc-channels.ts` — zéro chaîne de canal en dur ailleurs.
- Le contrat (`docs/specs/04-architect.md`) est verrouillé. Tout changement structurel passe par `/electron-add-feature` ou le protocole de déclaration d'écart.
- `/electron-load-project`, `/electron-generate-readme`, `/electron-add-feature`, `/electron-trace-feature`, `/electron-fix-issue`, `/electron-refactor-code`, `/electron-migrate-design`, `/electron-release`, `/electron-run-tests` s'invoquent depuis la racine du projet cible.
- Aucune ressource distante (CDN) — tout est embarqué via npm (contrainte CSP).

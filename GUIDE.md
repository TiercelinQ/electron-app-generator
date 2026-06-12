# Guide d'utilisation — Electron App Generator

---

## Structure du projet

```
electron-app-generator/
├── .claude/
│   ├── CLAUDE.md                              # Instructions core
│   ├── design-system.md                       # Référence visuelle contraignante (tokens CSS)
│   ├── layout.md                              # Référence layout contraignante
│   ├── rules/
│   │   ├── mvc.md                             # Séparation MVC main/preload/renderer, lots, nettoyage
│   │   ├── css.md                             # Tokens, data-theme, flat design, organisation CSS
│   │   ├── errors.md                          # Protocole erreurs Model→IPC→View, toasts
│   │   ├── config.md                          # shared/config.ts, package.json, i18n, logging, packaging
│   │   └── security.md                        # Sécurité Electron — non négociable
│   └── skills/
│       ├── electron-app/    /electron-app     # Menu démarrage / reprise
│       ├── phase1-cadrage/  /phase1-cadrage   # Cadrage — 4 questions + couleur primaire
│       ├── phase2-analyse/  /phase2-analyse   # Fiche besoins structurée
│       ├── phase3-layout/   /phase3-layout    # Proposition layout + personnalisation
│       ├── phase4-contrat/  /phase4-contrat   # Contrat architectural verrouillé
│       ├── phase5-developpement/ /phase5-...  # Livraison par lots + README.md
│       ├── charger-projet/  /charger-projet   # Chargement d'un projet existant
│       ├── generate-readme/ /generate-readme  # Génération README.md projet existant
│       ├── session/         /session          # Sauvegarde de session
│       ├── statut/          /statut           # État courant du projet
│       ├── contrat/         /contrat          # Arborescence du contrat validé
│       └── memoriser/       /memoriser        # Mémorisation erreurs / décisions
├── .gitignore
├── GUIDE.md                                   # Ce fichier
└── README.md                                  # Présentation du repo GitHub
```

---

## Installation depuis GitHub

```bash
git clone https://github.com/[utilisateur]/electron-app-generator.git
cd electron-app-generator
```

### Prérequis

```bash
# Claude Code CLI installé et connecté
claude --version

# Node.js 20 LTS+ (pour exécuter les apps générées)
node --version
npm --version
```

### Démarrage

```bash
# Depuis le dossier electron-app-generator/
claude
```

Claude Code détecte `.claude/CLAUDE.md` automatiquement. `design-system.md` et `layout.md`
sont dans `.claude/` et importés via `@` — chargés à chaque session.

### Activer la mémoire (une seule fois, par machine)

```
/config
→ Memory → Enable auto memory → On
```

Sans cette activation, `/memoriser` formule les notes mais ne les persiste pas entre sessions.

---

## Fichiers ignorés par git (.gitignore)

| Fichier / Dossier             | Raison                                     |
| ----------------------------- | ------------------------------------------ |
| `.claude/settings.local.json` | Permissions et hooks personnels            |
| `.claude/agent-memory/`       | Mémoire auto Claude Code — personnelle     |
| `claude-sessions/`            | Fichiers SESSION propres à chaque projet   |
| `preferences.json`            | Préférences utilisateur des apps générées  |
| `*.db`                        | Données applicatives                       |
| `node_modules/`               | Dépendances locales                        |
| `out/` · `dist/` · `release/` | Builds electron-vite / electron-builder    |

> **Note** : `.claude/settings.json` (sans `.local`) peut être commité pour partager
> des permissions ou hooks communs à tous les utilisateurs du repo.

---

## Effort recommandé par modèle

| Skill                                                                                                                                            | Modèle | Effort recommandé     |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | --------------------- |
| `/electron-app` · `/statut` · `/contrat` · `/session` · `/memoriser`                                                                             | Haiku  | — (tâches mécaniques) |
| `/phase1-cadrage` · `/phase2-analyse` · `/phase3-layout` · `/phase4-contrat` · `/phase5-developpement` · `/charger-projet` · `/generate-readme`  | Sonnet | `medium`              |

`high` : justifié pour la Phase 4 (contrat complexe, canaux IPC) ou le débogage multi-fichiers / main↔renderer.
Changer l'effort en session : `/effort medium` ou `/effort high`.

---

## Démarrer une nouvelle application

```
/electron-app → 1
```

### Phase 1 — Cadrage

Claude pose 4 questions en un seul bloc :

1. Objectif de l'application
2. Base de données (SQLite via better-sqlite3 / PostgreSQL / JSON / CSV / aucune)
3. Préférences persistantes entre sessions (Oui / Non)
4. Internationalisation FR/EN (Oui / Non)

Puis propose 3 couleurs primaires adaptées au contexte + l'option Slate Blue par défaut.
Toute bibliothèque hors stack est validée ici.
Annonce le calibrage (Petit : 3 lots / Moyen-Grand : 4 lots) — figé après cette phase.

### Phase 2 — Analyse des besoins

Fiche structurée : objectif, fonctionnalités retenues, hors périmètre, contraintes techniques.
**→ Validation explicite requise avant Phase 3.**

### Phase 3 — Proposition de layout

Claude propose une structure issue de `layout.md` puis pose les questions de personnalisation
en un seul bloc :

1. Position des onglets (gauche après logo / centrés)
2. Panneau secondaire (Drawer / Modale / Aucun)
3. Largeur du drawer si sélectionné (fixe 320px / fixe personnalisée / dynamique)
   ou taille de la modale si sélectionnée (fixe / dynamique)
4. Disposition interne de la modale si sélectionnée :
   - Header + contenu + footer
   - Header + 2 colonnes + footer
   - Header + contenu (sans footer)
   - Autre → Claude pose 3 questions pour aider à choisir, propose 2 dispositions avec recommandation
5. Emplacement des toasts (haut-droit par défaut, 5 autres positions disponibles)

Produit une synthèse complète du layout validé.
**→ Validation explicite requise avant Phase 4.**

### Phase 4 — Contrat architectural

Arborescence complète + rôle de chaque fichier + tableau des canaux IPC + tableau tokens → règles CSS.
**→ Verrouillé après validation. Tout écart impose : arrêt → déclaration → validation.**

### Phase 5 — Développement par lots

Claude crée les dossiers et écrit les fichiers directement sur le disque — aucune action manuelle requise.
Format d'annonce : `📦 Lot N/[total] — [contenu]`
Enchaînement automatique entre les lots sans confirmation.

**Contenu par taille de projet :**

| Taille               | Lot 1                | Lot 2                                       | Lot 3                                  | Lot 4                                  |
| -------------------- | -------------------- | ------------------------------------------- | -------------------------------------- | -------------------------------------- |
| Petit (3 lots)       | `shared/` + `models/`| `controllers/` + `preload/` + `views/`      | entrées + `styles/` + configs + README | —                                      |
| Moyen/Grand (4 lots) | `shared/` + `models/`| `views/`                                    | `controllers/` + `preload/`            | entrées + `styles/` + configs + README |

**Dernier lot — livrables supplémentaires obligatoires :**

- Instructions d'installation (`npm install`, `npm run dev`, `npm run dist`)
- `README.md` écrit automatiquement à la racine du projet

> **Note** : Claude Code demandera la permission d'exécuter Bash la première fois.
> Accepter pour tous les appels du projet pour ne pas être interrompu à chaque fichier.

---

## Reprendre une session existante

### Sauvegarder en fin de session

```
/session
```

Claude crée automatiquement le dossier `claude-sessions/` (s'il n'existe pas) et écrit
le fichier `SESSION_NomApp_SN.md` dedans.

### Reprendre

```
/electron-app → 2
```

Claude demande le chemin du fichier SESSION, le lit automatiquement et reprend
sans re-poser les questions résolues.

```
ex: C:\projets\mon-app\claude-sessions\SESSION_MonApp_S1.md
```

---

## Travailler sur un projet existant (Phase 5 terminée)

Le `.claude/` doit être présent à la racine du projet. Si ce n'est pas le cas :

```bash
# Copier le .claude/ dans le projet existant (Windows)
xcopy /E /I electron-app-generator\.claude mon-projet\.claude
```

Puis lancer Claude Code depuis la racine du projet :

```bash
cd mon-projet\
claude
```

**Projet avec README.md :**

```
/charger-projet
```

Claude lit `README.md`, confirme la prise en charge et applique toutes les règles.

**Projet sans README.md :**

```
/generate-readme
```

Claude analyse le code source et génère `README.md` automatiquement.

---

## Gestion des anomalies et mémoire

### Résolution d'anomalie

Après chaque correction, Claude produit :

```
Anomalie résolue. Éléments à retirer des tentatives précédentes :
Fichier [nom] : [lignes / blocs / canaux IPC / règles CSS à supprimer]
```

Puis propose : `Veux-tu mémoriser ce point ? /memoriser`

### /memoriser

```
/memoriser
```

Claude demande ce qu'il faut retenir :

- A. Erreur à ne plus reproduire
- B. Décision structurante
- C. Préférence de génération
- D. Autre

Consigne une note datée et catégorisée dans `~/.claude/agent-memory/`.
Disponible dans toutes les sessions suivantes sur ce projet.

> La mémoire est stockée localement sur ta machine — elle n'est pas commitée dans le repo.

---

## Commandes de référence

| Commande                | Modèle | Action                                               |
| ----------------------- | ------ | ---------------------------------------------------- |
| `/electron-app`         | Haiku  | Menu démarrage / reprise                             |
| `/phase1-cadrage`       | Sonnet | Cadrage — 4 questions + couleur primaire             |
| `/phase2-analyse`       | Sonnet | Fiche besoins structurée                             |
| `/phase3-layout`        | Sonnet | Proposition layout + personnalisation                |
| `/phase4-contrat`       | Sonnet | Contrat architectural verrouillé                     |
| `/phase5-developpement` | Sonnet | Livraison par lots — fichiers écrits sur le disque   |
| `/charger-projet`       | Sonnet | Charger un projet existant depuis son README.md      |
| `/generate-readme`      | Sonnet | Générer README.md d'un projet existant               |
| `/session`              | Haiku  | Sauvegarder la session dans `claude-sessions/`       |
| `/statut`               | Haiku  | État courant (phase, lot, décisions, points ouverts) |
| `/contrat`              | Haiku  | Arborescence du contrat architectural validé         |
| `/memoriser`            | Haiku  | Mémoriser une erreur, décision ou préférence         |

---

## Structure d'une application générée

```
mon-app/
├── package.json                   # Dépendances ^, scripts dev/build/dist
├── electron.vite.config.ts        # Build main/preload/renderer
├── tsconfig.json · tsconfig.node.json · tsconfig.web.json
├── eslint.config.mjs · .prettierrc
├── electron-builder.yml           # Packaging Windows (si demandé)
├── README.md                      # Généré automatiquement en fin de Phase 5
├── claude-sessions/               # Fichiers SESSION (gitignorés)
├── resources/                     # icon.ico
└── src/
    ├── shared/
    │   ├── config.ts              # Constantes applicatives
    │   ├── types.ts               # DTOs, IpcResult, interface WindowApi
    │   └── ipc-channels.ts        # Noms de canaux IPC centralisés
    ├── main/
    │   ├── index.ts               # Point d'entrée, BrowserWindow, sécurité
    │   ├── models/
    │   │   ├── errors.ts          # Erreurs métier nommées
    │   │   ├── preferences.model.ts
    │   │   └── [entite].model.ts
    │   └── controllers/
    │       ├── index.ts           # registerAllControllers()
    │       └── [entite].controller.ts
    ├── preload/
    │   └── index.ts               # contextBridge — API window.api
    └── renderer/
        ├── index.html             # CSP stricte
        └── src/
            ├── main.tsx · App.tsx
            ├── views/
            │   ├── layout/        # Topbar, Statusbar, Drawer, Modal
            │   ├── ToastManager.tsx
            │   └── [Entite]View.tsx
            ├── hooks/             # useTheme, useToast…
            ├── utils/helpers.ts   # Fonctions pures
            ├── i18n/              # fr.json, en.json (si activée)
            └── styles/
                ├── tokens.css     # :root + [data-theme="dark"] — tous tokens
                └── styles.css     # Règles consommant var(--token)
```

Données d'exécution (`preferences.json`, `*.db`, logs) : dans `%APPDATA%/[NomApp]` (`app.getPath("userData")`), jamais dans le dossier du projet.

---

## Points de vigilance

- `design-system.md` et `layout.md` sont dans `.claude/` — ne pas les déplacer ni modifier.
- Les couleurs d'icônes Font Awesome passent par les tokens CSS (`--icon-*`) — pas de constante de config (différence vs générateur Python).
- Le contrat architectural (Phase 4) est verrouillé. Tout changement structurel impose le protocole de déclaration.
- Les règles de sécurité Electron (`rules/security.md`) sont non négociables — `contextIsolation`, `sandbox`, CSP, validation IPC.
- `better-sqlite3` est un module natif : `electron-builder install-app-deps` après `npm install` (inclus dans les instructions du dernier lot).
- `/charger-projet` et `/generate-readme` doivent être invoqués depuis la racine du projet cible.
- La mémoire (`~/.claude/agent-memory/`) est locale à ta machine — non commitée, non partagée.
- `.claude/settings.local.json` est gitignorée — chaque utilisateur configure ses propres permissions locales.

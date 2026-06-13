# Règles MVC — Electron

## Mapping MVC → processus Electron

| Couche     | Emplacement                  | Contenu                                  |
| ---------- | ---------------------------- | ---------------------------------------- |
| Model      | `src/main/models/`           | Logique métier, accès données            |
| Controller | `src/main/controllers/` + `src/preload/` | Pont IPC main ↔ renderer    |
| View       | `src/renderer/src/views/`    | Composants React, DOM/CSS uniquement     |

## Responsabilités

### Models — `src/main/models/`
- Node.js pur + TypeScript. Classes ou modules par entité.
- Lèvent des erreurs métier nommées (`models/errors.ts`).
- **Interdit** : toute API Electron UI (`BrowserWindow`, `dialog`, `ipcMain`…). Toléré : `app.getPath()` pour les chemins de données.
- **Interdit** : tout import depuis `controllers/`, `preload/` ou `renderer/`.

### Controllers — `src/main/controllers/`
- Un fichier par entité : `[entite].controller.ts`.
- Enregistrent les handlers `ipcMain.handle(channel, …)`.
- Valident chaque entrée IPC (type, bornes, format) avant d'appeler le Model — voir `rules/security.md`.
- Interceptent les erreurs métier et retournent un résultat structuré (voir `rules/errors.md`). **Ne propagent jamais d'exception brute à travers l'IPC.**
- **Interdit** : logique métier, accès données direct, construction d'UI.

### Preload — `src/preload/index.ts`
- Expose une API typée minimale via `contextBridge.exposeInMainWorld("api", …)`.
- Chaque méthode = un `ipcRenderer.invoke(channel, payload)`. Zéro logique.
- Type de l'API déclaré dans `src/shared/types.ts` (interface `WindowApi`) et référencé par le renderer (`window.api`).

### Views — `src/renderer/src/views/`
- Composants React fonctionnels + hooks. Un fichier par entité : `[Entite]View.tsx`.
- Aucune logique métier. Aucun accès Node/Electron — uniquement `window.api`.
- Affichent les erreurs via `ToastManager` (jamais de gestion d'erreur métier).
- `views/layout/` : composants structurels (Topbar, Statusbar, Drawer, Modal).

## Imports unidirectionnels

```
renderer (views) ──window.api──▶ preload ──ipcRenderer──▶ controllers ──▶ models
                                                              │
shared/ (types, config, ipc-channels) ◀───────────────────────┴── importable par toutes les couches
```

- `shared/` ne contient que des types, constantes et noms de canaux — zéro logique, zéro dépendance.
- Les noms de canaux IPC sont centralisés dans `src/shared/ipc-channels.ts` — zéro chaîne de canal en dur ailleurs.
- Une entité = un model + un controller + une view. Constantes partagées dans `src/shared/config.ts`.

## Arborescence type générée

```
mon-app/
├── package.json
├── electron.vite.config.ts
├── tsconfig.json · tsconfig.node.json · tsconfig.web.json
├── eslint.config.mjs · .prettierrc
├── electron-builder.yml
├── README.md
├── resources/                      # icône .ico, assets packaging
├── scripts/
│   └── ensure-electron.cjs         # postinstall — fiabilisation binaire Electron
├── src/
│   ├── shared/
│   │   ├── config.ts               # constantes applicatives
│   │   ├── types.ts                # DTOs + interface WindowApi
│   │   └── ipc-channels.ts         # noms de canaux centralisés
│   ├── main/
│   │   ├── index.ts                # entrée main, BrowserWindow, sécurité
│   │   ├── models/
│   │   │   ├── errors.ts           # erreurs métier nommées
│   │   │   ├── preferences.model.ts
│   │   │   └── [entite].model.ts
│   │   └── controllers/
│   │       ├── index.ts            # registerAllControllers()
│   │       └── [entite].controller.ts
│   ├── preload/
│   │   └── index.ts                # contextBridge
│   └── renderer/
│       ├── index.html              # CSP meta incluse
│       └── src/
│           ├── main.tsx            # entrée React
│           ├── App.tsx             # shell : topbar, contenu, statusbar
│           ├── views/
│           │   ├── layout/         # Topbar.tsx, Statusbar.tsx, Drawer.tsx, Modal.tsx
│           │   ├── ToastManager.tsx
│           │   └── [Entite]View.tsx
│           ├── hooks/              # hooks partagés (useTheme, useToast…)
│           ├── utils/helpers.ts    # fonctions pures (formatage, validation)
│           ├── i18n/               # index.ts, fr.json, en.json
│           └── styles/
│               ├── tokens.css      # tous les tokens, :root + [data-theme="dark"]
│               └── styles.css      # règles consommant var(--token)
```

`utils/helpers.ts` : fonctions pures uniquement (formatage dates/nombres, validation). Interdit : logique métier, accès données, imports Electron/React.

## Livraison par lots

**Petit projet (3 lots) :**

| Lot | Contenu                                                                                            |
| --- | -------------------------------------------------------------------------------------------------- |
| 1   | `src/shared/` + `src/main/models/`                                                                 |
| 2   | `src/main/controllers/` + `src/preload/` + `src/renderer/src/views/` + `hooks/`                    |
| 3   | `src/main/index.ts` + entrées renderer + `utils/` + `styles/` + `i18n/` + `scripts/` + configs racine + `package.json` + README + instructions |

**Moyen / Grand projet (4 lots) :**

| Lot | Contenu                                                                                            |
| --- | -------------------------------------------------------------------------------------------------- |
| 1   | `src/shared/` + `src/main/models/`                                                                 |
| 2   | `src/renderer/src/views/` + `hooks/`                                                               |
| 3   | `src/main/controllers/` + `src/preload/`                                                           |
| 4   | `src/main/index.ts` + entrées renderer + `utils/` + `styles/` + `i18n/` + `scripts/` + configs racine + `package.json` + README + instructions |

### Format de livraison
- Annonce : `📦 Lot N/[total] — [contenu]`
- Fichiers écrits directement sur le disque, blocs complets et autonomes.
- Enchaînement automatique entre les lots sans confirmation.
- Dernier lot : instructions d'installation (`npm install`, `npm run dev`, `npm run typecheck`, `npm run build`, `npm run dist`) + note `electron-builder install-app-deps` si better-sqlite3 + `README.md` à la racine.

## Vérification d'intégrité (silencieuse — signalée uniquement si écart)

**Chaque lot :**
1. TypeScript compile (`tsc --noEmit` mental ou réel si environnement dispo).
2. Imports : tous utilisés, aucun manquant, sens unidirectionnel respecté.
3. Responsabilités MVC respectées (zéro logique métier en view/controller, zéro UI en model).
4. Zéro `// TODO`, zéro implémentation vide injustifiée, zéro `any` injustifié.
4b. Error Boundary intégré dans `App.tsx` — handler `process.on("uncaughtException")` présent dans `src/main/index.ts` (voir `rules/errors.md`).
5. Node 22+ · Electron stable (≥ 42) · zéro API dépréciée (`remote`).
6. Conformité `design-system.md` et `layout.md`.
7. Règles `rules/security.md` respectées.

**Dernier lot uniquement — cross-fichiers :**
8. Tous imports inter-couches résolus, canaux IPC cohérents (déclaration `ipc-channels.ts` ↔ handlers ↔ preload ↔ appels renderer).
9. Interface `WindowApi` alignée avec le preload et les usages renderer.
10. Contrat architectural respecté.
11. Zéro valeur visuelle en dur dans TS/TSX, zéro `style={}` inline.

## Ajustements post-livraison

Demandés par l'utilisateur après exécution. Correction isolée sur le fichier concerné + ses dépendances directes. Livraison du fichier complet corrigé.

## Résolution d'anomalie — protocole nettoyage

Quand une anomalie nécessite plusieurs tentatives avant d'être résolue, dès que la solution définitive est identifiée et livrée, produire obligatoirement :

```
Anomalie résolue. Éléments à retirer des tentatives précédentes :

Fichier [nom] :
- [ligne / bloc / import / canal IPC / className / règle CSS à supprimer]
- ...
```

- Lister uniquement les éléments ajoutés lors des tentatives infructueuses qui ne sont plus nécessaires.
- Couvrir tous les fichiers impactés : TS/TSX, CSS, shared, configs.
- Livrer les fichiers nettoyés complets si l'utilisateur confirme.
- Puis proposer : "Veux-tu mémoriser ce point ? `/memoriser`"

## Suppressions

Suppression totale dans tous les fichiers : code, imports, canaux IPC (déclaration + handler + preload + appels), types, classNames, règles CSS, clés i18n. Interdit : code commenté, implémentations vides, résidus. Livraison des fichiers modifiés complets.

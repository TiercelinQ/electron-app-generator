---
name: generate-readme
description: Analyser le code source d'un projet Electron existant et générer automatiquement son README.md (objectif, stack, arborescence, canaux IPC, conventions, installation). Invoquer depuis la racine du projet cible.
---

# /generate-readme — Génération du README.md

Pré-requis : invoqué depuis la racine du projet cible.

1. Analyser : `package.json`, `src/shared/` (config, ipc-channels, types), `src/main/models/`, `src/main/controllers/`, `src/preload/`, `src/renderer/src/views/`, `styles/`.
2. Générer `README.md` à la racine :

```markdown
# [NOM_APP]

[Objectif déduit du code — 2 phrases max]

## Stack
[tableau : Electron, React, TypeScript, DB, i18n, packaging]

## Arborescence
[arborescence réelle avec rôle de chaque fichier]

## Canaux IPC
[tableau canal → controller → model → usage renderer]

## Conventions
[MVC, tokens CSS, toasts, sécurité — renvoi aux règles]

## Installation
npm install
npm run dev
```

3. Écrire le fichier sur le disque, confirmer en une ligne.
4. Si des informations sont indéterminables depuis le code : poser les questions groupées en un seul bloc avant d'écrire.

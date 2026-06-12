---
name: charger-projet
description: Charger un projet Electron existant (Phase 5 terminée) depuis son README.md — prise en charge des règles du générateur sur un code déjà livré. Invoquer depuis la racine du projet cible.
---

# /charger-projet — Chargement d'un projet existant

Pré-requis : invoqué depuis la racine du projet cible, `.claude/` présent.

1. Lire `README.md` à la racine. S'il est absent : proposer `/generate-readme` et s'arrêter.
2. Lire `package.json` + parcourir `src/` pour confirmer la structure (shared / main / preload / renderer).
3. Confirmer la prise en charge :

```
Projet chargé : [NOM_APP] v[VERSION]
Stack : Electron [v] · React [v] · TypeScript
Entités détectées : [liste]
Canaux IPC : [nombre]
Règles du générateur appliquées.
```

4. Appliquer toutes les règles (`CLAUDE.md`, `rules/`, `design-system.md`, `layout.md`) à toute modification ultérieure.
5. Tout écart structurel détecté entre le code et les règles : le signaler, ne pas corriger sans demande.

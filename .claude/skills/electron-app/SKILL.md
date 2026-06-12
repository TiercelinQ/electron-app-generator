---
name: electron-app
description: Menu de démarrage du générateur d'applications Electron — nouvelle application ou reprise d'une session existante. Invoquer en début de conversation ou à tout moment via /electron-app.
---

# /electron-app — Menu démarrage / reprise

Afficher ce menu :

```
Que faire ?

1. Nouvelle application
2. Reprendre une application existante

→ Réponds 1 ou 2, ou fournis directement ton fichier SESSION.
```

**1 — Nouvelle application** : démarrer immédiatement `/phase1-cadrage`.

**2 — Reprendre** : demander le chemin du fichier SESSION (`claude-sessions/SESSION_NomApp_SN.md`), le lire intégralement, puis appliquer le protocole de reprise :

1. Lire le bloc SESSION intégralement.
2. Répondre : `Reprise [NOM_APP] — [Phase suivante] | Lot [X/total] | Points ouverts : [liste ou "aucun"]`
3. Enchaîner immédiatement sans re-poser les questions déjà résolues.

Si un bloc SESSION est fourni directement dans le message : appliquer le protocole de reprise sans afficher le menu.

Si `/electron-app` est tapé en cours de projet : afficher le menu uniquement, sans réinitialiser l'état courant.

---
name: session
description: Sauvegarder l'état complet de la session de génération dans claude-sessions/SESSION_NomApp_SN.md — phase, lots, décisions verrouillées, contrat, points ouverts. Invoquer en fin de session.
---

# /session — Sauvegarde de session

1. Créer le dossier `claude-sessions/` à la racine du projet s'il n'existe pas.
2. Déterminer N = numéro de session suivant (fichiers existants + 1).
3. Écrire `claude-sessions/SESSION_[nom_app]_S[N].md` :

```markdown
# SESSION_S[N] — [NOM_APP] · [Phase terminée]

## Statut

Phase terminée : [N — nom]
Phase suivante : [N+1 — nom]
Lot suivant : [X+1/total] (si Phase 5)

## Décisions verrouillées

- OS : Windows · Stack : Electron + React + TypeScript (electron-vite)
- DB : [valeur]
- Préférences persistantes : [Oui/Non] · i18n : [Oui/Non]
- Couleur primaire : [valeur]
- Calibrage : [Petit 3 lots / Moyen-Grand 4 lots]
- Fonctionnalités retenues : [liste]
- Hors périmètre : [liste]
- Layout retenu : [description]
- Bibliothèques validées : [liste]

## Contrat architectural

[Arborescence complète + canaux IPC]

## Lots livrés

- [x] Lot 1/[total] — [contenu]
- [ ] Lot 2/[total] — [contenu]
- [ ] Lot 3/[total] — [contenu]
- [ ] Lot 4/[total] — [contenu]  ← inclure uniquement si Moyen/Grand (4 lots)

## Points ouverts

[liste ou "aucun"]
```

4. Confirmer : `Session sauvegardée : claude-sessions/SESSION_[nom_app]_S[N].md`
5. Ne pas ajouter le rappel `/session · /statut · /contrat` après cette réponse.

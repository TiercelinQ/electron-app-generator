---
name: session
description: Save the full state of the generation session into claude-sessions/SESSION_AppName_SN.md — phase, batches, locked decisions, open points, referencing the specs. Invoke at the end of a session.
model: haiku
---

# /session — Session save

## Role
Session archivist.

## Goal
Persist enough state to resume the project exactly where it stopped.

## Deliverable
`claude-sessions/SESSION_[app_name]_S[N].md` (French).

---

1. Create the `claude-sessions/` folder at the project root if it does not exist.
2. Determine N = next session number (existing files + 1).
3. Write `claude-sessions/SESSION_[app_name]_S[N].md` (in French):

```markdown
# SESSION_S[N] — [APP_NAME] · [Phase terminée]

## Statut

Phase terminée : [N — nom]
Phase suivante : [N+1 — nom]
Lot suivant : [X+1/total] (si Phase 5)

## Décisions verrouillées

- OS : Windows · Stack : Electron + React + TypeScript (electron-vite)
- DB : [valeur]
- Préférences persistantes : [Oui/Non] · i18n : [Oui/Non] · Icône : [fournie/défaut]
- Couleur primaire : [valeur]
- Calibrage : [Petit 3 lots / Moyen-Grand 4 lots]
- Fonctionnalités retenues : [liste]
- Hors périmètre : [liste]
- Layout retenu : [description]
- Bibliothèques validées : [liste]

## Specs

Référence : docs/specs/01-cadrage.md · 02-analyse.md · 03-layout.md · 04-contrat.md
(le contrat verrouillé dans 04-contrat.md fait foi — ne pas le dupliquer ici)

## Lots livrés

- [x] Lot 1/[total] — [contenu]
- [ ] Lot 2/[total] — [contenu]
- [ ] Lot 3/[total] — [contenu]
- [ ] Lot 4/[total] — [contenu]  ← inclure uniquement si Moyen/Grand (4 lots)

## Points ouverts

[liste ou "aucun"]
```

> If `docs/specs/04-contrat.md` exists, reference it instead of duplicating the full tree + IPC channels. Only summarize the locked decisions here.

4. Confirm: `Session sauvegardée : claude-sessions/SESSION_[app_name]_S[N].md`
5. Do not append the `/session · /statut · /contrat` reminder after this reply.

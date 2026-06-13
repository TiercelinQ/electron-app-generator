---
name: phase4-contrat
description: Phase 4 du cycle de génération d'application Electron — contrat architectural complet (arborescence, rôle de chaque fichier, canaux IPC, tableau tokens → CSS), verrouillé après validation.
---

# /phase4-contrat — Contrat architectural

Présenter :

1. **Arborescence complète** du projet (modèle : `rules/mvc.md`) avec le rôle de chaque fichier.
2. **Tableau des canaux IPC** (convention de nommage `entite:action`, centralisée dans `ipc-channels.ts`) :

| Canal | Controller | Méthode model | `window.api` | View consommatrice |
| ----- | ---------- | ------------- | ------------ | ------------------ |
| `entite:list` | `entite.controller.ts` | `EntiteModel.list()` | `api.listEntites()` | `EntiteView` |
| `entite:save` | `entite.controller.ts` | `EntiteModel.save(data)` | `api.saveEntite(data)` | `EntiteView` |
| `pref:get` | `preferences.controller.ts` | `PreferencesModel.get()` | `api.getPreferences()` | `App.tsx` |
| `pref:set` | `preferences.controller.ts` | `PreferencesModel.set(key, val)` | `api.setPreference(key, val)` | `Topbar.tsx` |

3. **Tableau tokens → règles CSS prévues** (sélecteurs de `styles.css` et tokens consommés).

**→ Validation requise. Ce contrat est verrouillé.**

Tout écart (fusion, scission, renommage, ajout, suppression de fichier, canal IPC ou bibliothèque) impose :

1. Arrêt.
2. Déclaration de l'écart + justification.
3. Validation avant reprise.

→ Enchaîner sur `/phase5-developpement` après validation.

---
name: phase5-developpement
description: Phase 5 du cycle de génération d'application Electron — développement et livraison par lots, fichiers écrits directement sur le disque, vérifications d'intégrité, README final.
---

# /phase5-developpement — Développement par lots

## Règles de code

Appliquer intégralement : `rules/mvc.md` · `rules/css.md` · `rules/errors.md` · `rules/config.md` · `rules/security.md` · `design-system.md` · `layout.md`.

Rappels critiques :
- ESLint clean · Prettier · TypeScript strict · TSDoc sur classes et API publiques.
- Gestion d'erreurs sur toutes les opérations critiques.
- Zéro valeur visuelle en dur dans TS/TSX — tout dans `tokens.css` / `styles.css`.
- Chaque élément stylé a un `className` correspondant à une règle CSS.
- Aucune bibliothèque non validée en Phase 1.
- Sécurité Electron : `rules/security.md` à 100%.

## Livraison

- Créer les dossiers et écrire les fichiers **directement sur le disque** — aucune action manuelle requise.
- Annonce : `📦 Lot N/[total] — [contenu]`
- Enchaînement automatique entre les lots sans confirmation.
- Découpage des lots : tableaux de `rules/mvc.md` (3 lots Petit / 4 lots Moyen-Grand, figé en Phase 1).

## Vérification d'intégrité

Silencieuse — signalée uniquement si écart. Liste complète : `rules/mvc.md §Vérification d'intégrité`. Les vérifications cross-fichiers (canaux IPC bout-en-bout, `WindowApi`, contrat) s'exécutent au dernier lot.

## Dernier lot — livrables supplémentaires obligatoires

- `scripts/ensure-electron.cjs` écrit à la racine du projet (voir `rules/config.md §Postinstall`).
- Instructions d'installation et d'exécution :
  ```
  npm install
  npm run dev        # développement
  npm run typecheck  # vérification TypeScript
  npm run build      # build sans packaging
  npm run dist       # packaging Windows (si demandé)
  ```
  (+ note `electron-builder install-app-deps` si better-sqlite3.)
- `README.md` écrit automatiquement à la racine du projet : objectif, stack, arborescence, canaux IPC, conventions, installation.

## Ajustements post-livraison

Correction isolée sur le fichier concerné + dépendances directes. Livraison du fichier complet corrigé.
Après résolution d'anomalie : bilan de nettoyage (`rules/mvc.md`) puis proposer `Veux-tu mémoriser ce point ? /memoriser`.


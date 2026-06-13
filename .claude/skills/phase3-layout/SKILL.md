---
name: phase3-layout
description: Phase 3 du cycle de génération d'application Electron — proposition de layout basée sur layout.md, questions de personnalisation groupées, synthèse validée avant la Phase 4.
---

# /phase3-layout — Proposition de layout

## 1. Proposition

Sur la base de la description du projet, proposer un layout adapté parmi les structures définies dans `layout.md` :

1. Décrire la structure retenue (onglets, drawer optionnel, composants récurrents).
2. Justifier le choix en fonction des fonctionnalités.
3. Lister les onglets de navigation et leur contenu.

## 2. Personnalisation — questions groupées en un seul bloc

```
Personnalisation du layout :

1. Position des onglets : gauche après logo / centrés ?
2. Panneau secondaire : Drawer / Modale / Aucun ?
3. [Si Drawer] Largeur : fixe 320px / fixe personnalisée / dynamique ?
   [Si Modale] Taille : fixe / dynamique ?
4. [Si Modale] Disposition interne :
   - Header + contenu + footer
   - Header + 2 colonnes + footer
   - Header + contenu (sans footer)
   - Autre
5. Les toasts sont positionnés en haut-droit — seule position spécifiée par `layout.md §5`.
```

Si « Autre » en 4 : poser 3 questions pour aider à choisir, puis proposer 2 dispositions avec recommandation.

## 3. Synthèse

Produire une synthèse complète du layout validé (structure, onglets, panneau, toasts, écarts éventuels vs `layout.md` par défaut).

**→ Validation explicite requise avant Phase 4.**

# Layout Système — v2.0 (Electron)

> Référence contraignante pour toutes les applications Node.js/Electron/React.
> Construit sur `design-system.md v1.0 (Electron)`. Les deux fichiers sont indissociables.

---

## 1. STRUCTURE GLOBALE

```
┌─────────────────────────────────────────────────────┐
│              TOPBAR (48px)                          │
│  [ Logo / Nom ]  [ Onglets nav ]  [ Thème ]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│            CONTENU PRINCIPAL                        │
│            (zone scrollable)                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                STATUSBAR (28px)                     │
└─────────────────────────────────────────────────────┘
```

Squelette HTML imposé (composant `App.tsx`) :

```
<div id="app-shell">          grid rows: var(--topbar-height) 1fr var(--statusbar-height)
  <header id="topbar">
  <main id="main-content">
  <footer id="statusbar">
  <div id="toast-container">  superposé (position: fixed)
  <aside id="drawer">         superposé (optionnel)
</div>
```

**Drawer droit** (optionnel, par-dessus le contenu) :

```
┌─────────────────────────────────────────────────────┐
│                     TOPBAR                          │
├───────────────────────────────┬─────────────────────┤
│                               │                     │
│       CONTENU PRINCIPAL       │  DRAWER (320px)     │
│       (réduit)                │  coulissant         │
│                               │                     │
├───────────────────────────────┴─────────────────────┤
│                   STATUSBAR                         │
└─────────────────────────────────────────────────────┘
```

**Toast** (superposé, coin haut-droit) :

```
┌─────────────────────────────────────────────────────┐
│                     TOPBAR              [ Toast 1 ] │
├─────────────────────────────────────────[ Toast 2 ]─┤
│                                                     │
│            CONTENU PRINCIPAL                        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                   STATUSBAR                         │
└─────────────────────────────────────────────────────┘
```

---

## 2. FENÊTRE (BrowserWindow)

| Token / option      | Valeur                                                                  |
| ------------------- | ----------------------------------------------------------------------- |
| `minWidth`          | 1024                                                                    |
| `minHeight`         | 768                                                                     |
| état au lancement   | restauré (position + taille) via préférences                            |
| thème au lancement  | suit le thème OS (`nativeTheme.shouldUseDarkColors`)                    |
| thème par défaut OS | clair                                                                   |
| `show`              | `false` puis `ready-to-show` (zéro flash blanc)                         |
| `backgroundColor`   | `--bg` du thème courant (anti-flash)                                    |
| `autoHideMenuBar`   | `true` — pas de menu natif Windows                                      |
| `webPreferences`    | verrouillées — voir `rules/security.md`                                 |
| `icon`              | `resources/icon.ico` (fournie par l'utilisateur, sinon défaut Electron) |

---

## 3. TOPBAR

| Token              | Valeur                   |
| ------------------ | ------------------------ |
| hauteur            | `--topbar-height` = 48px |
| fond mode clair    | `--bg` = #FFFFFF         |
| fond mode sombre   | `--bg` = #111827         |
| bordure bas        | 1px `--border`           |
| padding horizontal | `--spacing-4` = 16px     |

### Zones de la topbar (gauche → droite)

```
[ Logo / Nom app ]  [ Onglets navigation ]  ···  [ Thème ]
```

| Zone   | Contenu                         | Largeur     |
| ------ | ------------------------------- | ----------- |
| Gauche | Logo SVG 24px + nom application | fixe        |
| Centre | Onglets de navigation (`<nav>`) | flexible    |
| Droite | Sélecteur thème clair/sombre    | fixe — 40px |

### Logo / Nom application

- Icône SVG `--icon-lg` (24px) + label `--weight-semibold` `--font-base` (16px).
- Couleur : `--text`.
- Non cliquable.

### Onglets de navigation (`<nav id="topbar-tabs">`)

- Boutons `<button class="tab">` — jamais de `<a href>` (pas de navigation réelle, app monopage).
- Intégrés dans la topbar, alignés centre.
- Maximum 5 onglets visibles. Au-delà → menu déroulant `···`.
- Onglet actif (`.is-active`) : texte `--primary`, bordure bas 2px `--primary`.
- Onglet inactif : texte `--text-subtle`, fond transparent.
- Hover : fond `--bg-muted`, transition `--transition-default`.
- Police : `--weight-medium` `--font-sm` (14px).
- Hauteur onglet : `--topbar-height` = 48px (pleine hauteur topbar).
- Padding horizontal par onglet : `--spacing-4` = 16px.
- Le contenu actif est rendu par React (state `activeTab`) — un seul onglet monté à la fois.

### Sélecteur de thème

- Icône seule (fa-sun / fa-moon), taille `--icon-lg` = 24px.
- `title` obligatoire : "Passer en mode sombre" / "Passer en mode clair".
- Toggle instantané — `data-theme` basculé sur `<html>` + persisté en préférences via IPC.

---

## 4. ZONE DE CONTENU PRINCIPAL

| Token               | Valeur                           |
| ------------------- | -------------------------------- |
| fond mode clair     | `--bg` = #FFFFFF                 |
| fond mode sombre    | `--bg` = #111827                 |
| padding intérieur   | `--spacing-6` = 24px             |
| scroll              | vertical — `overflow-y: auto`    |
| largeur max contenu | `--content-xl` = 1024px (centré) |

### En-tête de section

```
[ Titre de la section ]   [ Sous-titre / description courte ]
```

- Titre : `--weight-bold` `--font-2xl` (24px), couleur `--text`.
- Sous-titre : `--weight-normal` `--font-sm` (14px), couleur `--text-subtle`.
- Margin bas : `--spacing-6` = 24px avant le contenu.

---

## 5. TOAST

Remplace intégralement le bandeau inline. Aucun bandeau inline dans les applications.
Composant : `views/ToastManager.tsx` — file d'attente en state React, conteneur `#toast-container` en `position: fixed`.

| Token                   | Valeur                                                   |
| ----------------------- | -------------------------------------------------------- |
| position                | Coin haut-droit, superposé au contenu                    |
| largeur                 | 320px                                                    |
| margin depuis le bord   | `--spacing-4` = 16px                                     |
| margin depuis la topbar | `--spacing-4` = 16px                                     |
| espacement entre toasts | `--spacing-2` = 8px                                      |
| empilement              | Vertical, file d'attente, sans chevauchement             |
| animation entrée        | Glissement depuis la droite, `--transition-slow` = 250ms |
| animation sortie        | Fondu + glissement droite, `--transition-slow` = 250ms   |

### Durées d'affichage

| Type      | Durée      | Fermeture manuelle  |
| --------- | ---------- | ------------------- |
| `success` | 4s         | Non                 |
| `info`    | 4s         | Non                 |
| `warning` | 6s         | Oui (×)             |
| `danger`  | persistant | Oui (×) obligatoire |

### Anatomie du toast

```
┌────────────────────────────────────┐
│ [icône]  Message principal     [×] │
│          Description optionnelle   │
└────────────────────────────────────┘
```

| Token              | Valeur                                           |
| ------------------ | ------------------------------------------------ |
| padding            | `--spacing-3` vertical, `--spacing-4` horizontal |
| bordure gauche     | 4px couleur sémantique                           |
| fond               | fond sémantique (`--*-50`)                       |
| police message     | `--weight-medium` `--font-sm` (14px)             |
| police description | `--weight-normal` `--font-xs`, `--text-subtle`   |
| icône              | `--icon-md` = 20px                               |

| Type      | Fond           | Bordure         | Icône (Font Awesome)      |
| --------- | -------------- | --------------- | ------------------------- |
| `success` | `--success-50` | `--success-600` | `fa-circle-check`         |
| `warning` | `--warning-50` | `--warning-600` | `fa-triangle-exclamation` |
| `danger`  | `--danger-50`  | `--danger-600`  | `fa-circle-exclamation`   |
| `info`    | `--info-50`    | `--info-600`    | `fa-circle-info`          |

---

## 6. DRAWER DROIT

| Token            | Valeur                                                                             |
| ---------------- | ---------------------------------------------------------------------------------- |
| largeur          | `--drawer-width` = 320px                                                           |
| animation        | glissement depuis la droite, `--transition-slow` = 250ms (`transform: translateX`) |
| fond mode clair  | `--bg-elevated` = #FFFFFF                                                          |
| fond mode sombre | `--bg-elevated` = #374151                                                          |
| bordure gauche   | 1px `--border`                                                                     |
| padding          | `--spacing-6` = 24px                                                               |
| overlay fond     | `--text` opacité 40%                                                               |

- Ouvert par action explicite uniquement. Jamais automatiquement.
- Fermeture : clic overlay, touche Échap, ou bouton × dans le drawer.
- En-tête drawer : titre `--weight-semibold` `--font-lg` (18px) + bouton × aligné à droite.
- Contenu drawer : scrollable verticalement si dépassement.

---

## 7. STATUSBAR

| Token              | Valeur                        |
| ------------------ | ----------------------------- |
| hauteur            | `--statusbar-height` = 28px   |
| fond mode clair    | `--bg-muted` = #F3F4F6        |
| fond mode sombre   | `--bg-muted` = #1F2937        |
| bordure haut       | 1px `--border`                |
| padding horizontal | `--spacing-4` = 16px          |
| police             | `--weight-normal` `--font-xs` |
| couleur texte      | `--text-muted`                |

### Zones statusbar (gauche → droite)

```
[ Message statut ]  ···  [ Progression ]  [ Info contextuelle ]
```

| Zone   | Contenu                                                                   |
| ------ | ------------------------------------------------------------------------- |
| Gauche | Message statut courant ("Prêt", "Chargement…", "3 éléments sélectionnés") |
| Centre | `<progress>` compact (8px) — visible uniquement si opération en cours     |
| Droite | Info contextuelle fixe (nb enregistrements, version, connexion DB…)       |

---

## 8. COMPOSANTS RÉCURRENTS

### Tableau de données (`<table class="data-table">`)

- En-tête : fond `--bg-subtle`, `--weight-semibold` `--font-sm`, `--text-subtle`.
- Bordure en-tête bas : 2px `--border-strong`.
- Ligne : hauteur dynamique (padding vertical `--spacing-2` = 8px), bordure bas 1px `--border-subtle`.
- Colonnes : largeur dynamique (`table-layout: auto`). Exception : colonne actions — largeur fixe selon contenu.
- Ligne sélectionnée (`.is-selected`) : fond `--primary-bg`.
- Ligne hover : fond `--bg-muted`.
- Alternance de lignes : désactivée (flat design).
- Pagination sous le tableau si > 50 lignes.

### Formulaire de saisie

- Labels au-dessus des champs (`<label>` lié par `htmlFor`), `--weight-medium` `--font-sm`, `--text`.
- Champs : `width: 100%` dans leur conteneur, hauteur dynamique (padding vertical `--spacing-2` = 8px).
- Espacement entre champs : `--spacing-4` = 16px.
- Champ en erreur (`.has-error`) : bordure 2px `--danger-600` + message `--danger-600` sous le champ, `--font-xs`.
- Actions formulaire : alignées à droite — Annuler (`.btn-secondary`) + Valider (`.btn-primary`), largeur dynamique selon label.
- Soumission via `onSubmit` + `preventDefault` — jamais de navigation.

### Arborescence (`<ul class="tree">`)

- Indentation par niveau : `--spacing-4` = 16px.
- Icône expand/collapse : chevron Font Awesome, `--icon-sm` = 16px, `--text-muted`.
- Item hauteur : dynamique (padding vertical `--spacing-1` = 4px).
- Item sélectionné (`.is-selected`) : fond `--primary-bg`.

### Graphiques / Visualisation

- Fond : transparent (hérite du contenu principal).
- Palette : `--chart-primary`, `--chart-success`, `--chart-warning`, `--chart-danger`, `--chart-info`.
- Légende : `--weight-normal` `--font-sm`, `--text-subtle`.
- Aucune ombre (flat design).
- Bibliothèque de graphiques : à valider en Phase 1 (aucune par défaut).

### Modale

```
┌─────────────────────────────────────┐
│  Titre de la modale             [×] │
├─────────────────────────────────────┤
│                                     │
│  Contenu (formulaire, texte…)       │
│                                     │
├─────────────────────────────────────┤
│              [ Annuler ] [ Valider ]│
└─────────────────────────────────────┘
```

Composant React contrôlé (state `isOpen`) — `<div class="modal-overlay"><div class="modal">`.

| Token            | Valeur                             |
| ---------------- | ---------------------------------- |
| largeur          | dynamique selon contenu, min 480px |
| fond mode clair  | `--bg` = #FFFFFF                   |
| fond mode sombre | `--bg` = #111827                   |
| bordure          | 1px `--border`                     |
| padding          | `--spacing-6` = 24px               |
| overlay fond     | `--text` opacité 40%               |

- Ouverte par action explicite uniquement.
- Fermeture : bouton ×, Annuler, touche Échap, ou clic overlay.
- En-tête : titre `--weight-semibold` `--font-lg` + bouton × à droite, bordure bas 1px `--border-subtle`.
- Pied : actions à droite — Annuler (secondaire) + Valider (primaire), bordure haut 1px `--border-subtle`.
- Contenu : scrollable verticalement si dépassement.
- Zéro `alert()` / `confirm()` / `dialog.showMessageBox` — toujours cette modale stylée.

### Pagination

Affichée sous un tableau contenant plus de 50 lignes.

```
[ ← ]  [ 1 ]  [ 2 ]  [ 3 ]  ···  [ 12 ]  [ → ]
                  Page 2 sur 12
```

| Token                   | Valeur                                                   |
| ----------------------- | -------------------------------------------------------- |
| position                | sous le tableau, alignée à droite                        |
| espacement avec tableau | `--spacing-4` = 16px                                     |
| bouton page             | dynamique selon numéro, padding `--spacing-2` horizontal |
| bouton actif            | fond `--primary-bg`, texte `--primary`                   |
| bouton inactif          | transparent, texte `--text-subtle`                       |
| bouton hover            | fond `--bg-muted`                                        |
| boutons ← →             | icônes `--icon-sm`, désactivés en première/dernière page |
| label page              | `--weight-normal` `--font-xs`, `--text-muted`, centré    |
| pages max visibles      | 5 numéros — ellipse `···` au-delà                        |

---

## 9. NAVIGATION CLAVIER GLOBALE

| Raccourci           | Action                                 |
| ------------------- | -------------------------------------- |
| `Tab` / `Shift+Tab` | Navigation entre éléments interactifs  |
| `Enter` / `Espace`  | Activation bouton / item focusé        |
| `Échap`             | Ferme drawer / modale / dropdown actif |
| `Alt+1…9`           | Navigation directe vers onglet N       |
| `Ctrl+,`            | Ouvre Paramètres                       |

Implémentation : listeners `keydown` dans le renderer. Les raccourcis globaux ne passent pas par `globalShortcut` (réservé aux raccourcis hors focus, non requis ici).

---

## 10. PRÉFÉRENCES PERSISTÉES

Fichier `preferences.json` dans `app.getPath("userData")` — lu/écrit **uniquement par le main process** (model `preferences.model.ts`), exposé au renderer via IPC.

| Préférence       | Valeur par défaut |
| ---------------- | ----------------- |
| thème            | système OS        |
| fenêtre taille   | 1280×800          |
| fenêtre position | centrée           |
| drawer état      | fermé             |

---

## 11. RÉFÉRENCE CROISÉE DESIGN SYSTEM

Ce fichier ne redéfinit pas les tokens — il les consomme. Toute valeur visuelle est tracée vers `design-system.md v1.0 (Electron)`.

| Besoin                     | Token                                              |
| -------------------------- | -------------------------------------------------- |
| Fond principal             | `--bg`                                             |
| Fond zones secondaires     | `--bg-subtle`                                      |
| Fond drawer                | `--bg-elevated`                                    |
| Texte principal            | `--text`                                           |
| Texte secondaire           | `--text-subtle`                                    |
| Bordures                   | `--border` / `--border-subtle` / `--border-strong` |
| Couleur active / sélection | `--primary` / `--primary-bg`                       |
| Focus                      | `--focus-ring` 2px offset 2px                      |
| Transitions panels         | `--transition-slow` = 250ms                        |
| Transitions états          | `--transition-default` = 150ms                     |
| Forme                      | `--radius` = 0px (flat design)                     |
| Ombres                     | aucune (flat design)                               |

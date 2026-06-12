# Règles CSS — tokens, thèmes, flat design

## Fichiers

| Fichier                                 | Rôle                                                            |
| --------------------------------------- | --------------------------------------------------------------- |
| `src/renderer/src/styles/tokens.css`    | Tous les tokens — `:root` (clair) + `[data-theme="dark"]`       |
| `src/renderer/src/styles/styles.css`    | Toutes les règles de composants — consomme uniquement `var(--token)` |

Importés une seule fois dans `main.tsx`, dans cet ordre : `tokens.css` puis `styles.css` puis Font Awesome.

## Règles absolues

1. **Zéro valeur visuelle en dur dans TS/TSX** — zéro `style={}` inline, zéro couleur/taille/durée littérale dans le code. Exception unique : valeurs calculées à l'exécution impossibles en CSS (ex. position d'un élément suivant la souris) — à justifier en commentaire.
2. **`styles.css` ne contient aucune valeur littérale** — uniquement `var(--token)`. Toute nouvelle valeur passe d'abord par un token dans `tokens.css`.
3. **Chaque règle porte un commentaire** indiquant le(s) token(s) source du design system.
4. **Mode sombre** : un seul bloc `[data-theme="dark"]` dans `tokens.css` redéfinissant tous les tokens thémés. `styles.css` ne contient **aucun** sélecteur `[data-theme]`, aucun `@media (prefers-color-scheme)`.
5. **Flat design strict** : `border-radius: 0` partout, `box-shadow` interdit, dégradés interdits, alternance de lignes interdite.
6. **Conventions de nommage** : classes kebab-case (`.btn-primary`, `.data-table`), états préfixés `is-`/`has-` (`.is-active`, `.has-error`). `id` réservé aux ancres uniques du shell (`#topbar`, `#main-content`, `#statusbar`, `#toast-container`, `#drawer`, `#app-shell`).
7. Zéro framework CSS (Tailwind, Bootstrap…), zéro CSS-in-JS, zéro CSS Modules — CSS plat centralisé uniquement.

## Bascule de thème

```ts
// hooks/useTheme.ts — principe
document.documentElement.dataset.theme = theme; // "light" → attribut absent ou "light", "dark"
await window.api.savePreference("theme", theme);
```

- Thème initial : préférence persistée, sinon thème OS (transmis par le main via IPC à l'init).
- Les icônes Font Awesome suivent automatiquement (couleurs par tokens) — aucune action.

## Organisation interne de `tokens.css`

```css
/* ============================================================
   tokens.css — [NOM_APP] v[VERSION]
   Référence : design-system.md v1.0 (Electron)
   ============================================================ */

:root {
  /* --- TYPOGRAPHIE --- */
  /* --- COULEURS — mode clair --- */
  /* --- PRIMAIRE (projet : [couleur choisie Phase 1]) --- */
  /* --- SÉMANTIQUES --- */
  /* --- ICÔNES --- */
  /* --- ESPACEMENTS --- */
  /* --- TAILLES FIXES --- */
  /* --- TRANSITIONS --- */
}

[data-theme="dark"] {
  /* --- COULEURS — mode sombre (redéfinition complète des tokens thémés) --- */
}
```

## Organisation interne de `styles.css`

```css
/* ============================================================
   styles.css — [NOM_APP] v[VERSION]
   Référence : design-system.md v1.0 (Electron) · layout.md v2.0
   ============================================================ */

/* --- BASE ----------------------------------------------- */
/* token : bg / text / font-family */
body { ... }

/* --- SHELL ----------------------------------------------- */
#app-shell { ... }

/* --- TOPBAR ----------------------------------------------- */
/* token : bg / border / topbar-height */
#topbar { ... }

/* --- ONGLETS ----------------------------------------------- */
.tab { ... }
.tab:hover { ... }
.tab.is-active { ... }

/* --- CONTENU PRINCIPAL -------------------------------------- */
#main-content { ... }

/* --- TOAST --------------------------------------------------- */
.toast { ... }
.toast-success { ... }
.toast-danger { ... }

/* --- DRAWER -------------------------------------------------- */
/* --- MODALE -------------------------------------------------- */

/* --- COMPOSANTS ----------------------------------------------- */
/* Boutons */
.btn { ... }
.btn-primary { ... }
.btn-secondary { ... }
.btn-danger { ... }
.btn-ghost { ... }

/* Champs de saisie */
.field input, .field select { ... }

/* Tableaux */
.data-table { ... }
.data-table thead th { ... }

/* Pagination */

/* --- STATUSBAR ------------------------------------------------ */
#statusbar { ... }

/* --- FOCUS ------------------------------------------------------ */
:focus-visible { ... }
```

## Couleur primaire par projet

Si une couleur a été choisie en Phase 1 (≠ Slate Blue) : seules les 4 valeurs `--primary-50/400/600/900` changent dans `tokens.css` du projet. Le `design-system.md` global reste inchangé.

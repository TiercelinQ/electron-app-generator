# Design System — v1.0 (Electron)

> Référence contraignante pour toutes les applications Node.js/Electron/React.
> Usage : applications desktop Windows, usage personnel et professionnel.
> Indissociable de `layout.md`.
> Tous les tokens sont des **CSS custom properties** déclarées dans `src/renderer/src/styles/tokens.css`.

---

## 1. TYPOGRAPHIE

| Token              | Valeur   | Usage                         |
| ------------------ | -------- | ----------------------------- |
| `--font-family`    | Segoe UI | Toutes les applications       |
| `--font-xs`        | 12px     | Statusbar, labels secondaires |
| `--font-sm`        | 14px     | Labels, sous-titres, corps    |
| `--font-base`      | 16px     | Texte principal, navigation   |
| `--font-lg`        | 18px     | Titres de section secondaires |
| `--font-xl`        | 20px     | Titres intermédiaires         |
| `--font-2xl`       | 24px     | Titres de section principaux  |
| `--weight-normal`  | 400      | Corps, descriptions           |
| `--weight-medium`  | 500      | Labels, items navigation      |
| `--weight-semibold`| 600      | Titres, en-têtes              |
| `--weight-bold`    | 700      | Titres principaux             |

```css
/* tokens.css */
:root {
  --font-family: "Segoe UI", system-ui, sans-serif;
}
```

---

## 2. COULEURS

### Mode clair (`:root`)

| Token             | Valeur  | Usage                          |
| ----------------- | ------- | ------------------------------ |
| `--bg`            | #FFFFFF | Fond principal, topbar         |
| `--bg-subtle`     | #F9FAFB | Fond topbar, zones secondaires |
| `--bg-muted`      | #F3F4F6 | Statusbar, hover, alternance   |
| `--bg-elevated`   | #FFFFFF | Drawer, modales                |
| `--text`          | #111827 | Texte principal                |
| `--text-subtle`   | #6B7280 | Texte secondaire, sous-titres  |
| `--text-muted`    | #9CA3AF | Texte désactivé, statusbar     |
| `--border`        | #E5E7EB | Bordures standard              |
| `--border-subtle` | #F3F4F6 | Séparateurs discrets           |
| `--border-strong` | #D1D5DB | En-têtes tableau               |

### Mode sombre (`[data-theme="dark"]`)

| Token             | Valeur  | Usage                  |
| ----------------- | ------- | ---------------------- |
| `--bg`            | #111827 | Fond principal, topbar |
| `--bg-subtle`     | #1F2937 | Zones secondaires      |
| `--bg-muted`      | #1F2937 | Statusbar, hover       |
| `--bg-elevated`   | #374151 | Drawer, modales        |
| `--text`          | #F9FAFB | Texte principal        |
| `--text-subtle`   | #9CA3AF | Texte secondaire       |
| `--text-muted`    | #6B7280 | Texte désactivé        |
| `--border`        | #374151 | Bordures standard      |
| `--border-subtle` | #1F2937 | Séparateurs discrets   |
| `--border-strong` | #4B5563 | En-têtes tableau       |

### Couleur primaire — Slate Blue

| Token           | Clair   | Sombre  |
| --------------- | ------- | ------- |
| `--primary-50`  | #EEF2FF | —       |
| `--primary-400` | —       | #818CF8 |
| `--primary-600` | #4F46E5 | —       |
| `--primary-900` | —       | #312E81 |

> Modification : remplacer ces 4 valeurs dans `tokens.css` suffit à changer la couleur primaire sur toute l'application.

Implémentation : deux tokens d'usage dérivés, redéfinis par thème — c'est eux que `styles.css` consomme.

```css
:root                { --primary: var(--primary-600); --primary-bg: var(--primary-50); }
[data-theme="dark"]  { --primary: var(--primary-400); --primary-bg: var(--primary-900); }
```

### Couleurs sémantiques

| Token             | Clair   | Sombre  | Usage                  |
| ----------------- | ------- | ------- | ---------------------- |
| `--success-50`    | #F0FDF4 | —       | Fond toast succès      |
| `--success-600`   | #16A34A | #4ADE80 | Bordure, icône succès  |
| `--warning-50`    | #FFFBEB | —       | Fond toast warning     |
| `--warning-600`   | #D97706 | #FCD34D | Bordure, icône warning |
| `--danger-50`     | #FFF1F2 | —       | Fond toast danger      |
| `--danger-600`    | #DC2626 | #F87171 | Bordure, icône danger  |
| `--info-50`       | #EFF6FF | —       | Fond toast info        |
| `--info-600`      | #2563EB | #60A5FA | Bordure, icône info    |

### Palette graphiques / visualisation

| Token             | Valeur                   |
| ----------------- | ------------------------ |
| `--chart-primary` | `var(--primary)`         |
| `--chart-success` | `var(--success-600)`     |
| `--chart-warning` | `var(--warning-600)`     |
| `--chart-danger`  | `var(--danger-600)`      |
| `--chart-info`    | `var(--info-600)`        |

> Les tokens `--chart-*` consomment les couleurs sémantiques via `var()` — ils suivent automatiquement le thème sombre sans redéfinition.

---

## 3. ESPACEMENTS

| Token         | Valeur | Usage                          |
| ------------- | ------ | ------------------------------ |
| `--spacing-1` | 4px    | Micro-espacement               |
| `--spacing-2` | 8px    | Padding interne compact        |
| `--spacing-3` | 12px   | Padding standard               |
| `--spacing-4` | 16px   | Espacement entre éléments      |
| `--spacing-5` | 20px   | Espacement intermédiaire       |
| `--spacing-6` | 24px   | Padding contenu principal      |
| `--spacing-7` | 28px   | Espacement intermédiaire large |
| `--spacing-8` | 32px   | Séparations majeures           |

---

## 4. TAILLES COMPOSANTS

### Tailles fixes (ancrages visuels globaux)

| Token                 | Valeur | Usage                      |
| --------------------- | ------ | -------------------------- |
| `--topbar-height`     | 48px   | Hauteur topbar             |
| `--statusbar-height`  | 28px   | Hauteur statusbar          |
| `--drawer-width`      | 320px  | Largeur drawer droit       |
| `--content-xl`        | 1024px | Largeur max contenu centré |
| `--icon-sm`           | 16px   | Icône petite               |
| `--icon-md`           | 20px   | Icône standard             |
| `--icon-lg`           | 24px   | Icône navigation / topbar  |

### Tailles dynamiques — principe général

**Règle** : aucun composant n'a de hauteur ou largeur fixe sauf exception documentée ci-dessus. Les dimensions résultent du contenu + padding. Zéro `width`/`height` figés en CSS hors tokens fixes.

| Composant         | Largeur                                  | Hauteur                    | Exception                                     |
| ----------------- | ---------------------------------------- | -------------------------- | --------------------------------------------- |
| Bouton            | contenu + padding horizontal             | contenu + padding vertical | groupe aligné : uniformisée sur le plus large |
| Champ de saisie   | étire dans son conteneur (`width: 100%`) | contenu + padding vertical | —                                             |
| Colonne tableau   | contenu (`table-layout: auto`)           | —                          | colonne actions : fixe                        |
| Onglet topbar     | label + padding horizontal               | `--topbar-height`          | —                                             |
| Label             | contenu, wrap si contrainte              | contenu                    | —                                             |
| Menu déroulant    | item le plus long                        | contenu                    | —                                             |
| Dialogue / modale | contenu                                  | contenu                    | `min-width` conseillée par contexte           |
| Item arborescence | contenu + indentation                    | padding vertical           | —                                             |
| Toast             | —                                        | contenu multi-ligne        | largeur fixe 320px                            |

---

## 5. FORME & OMBRES

| Token      | Valeur                      |
| ---------- | --------------------------- |
| `--radius` | 0px — flat design strict    |
| ombres     | aucune — flat design strict |

`box-shadow` interdit. `border-radius: 0` partout.

---

## 6. TRANSITIONS

| Token                  | Valeur     | Usage                   |
| ---------------------- | ---------- | ----------------------- |
| `--transition-default` | 150ms ease | États hover, focus      |
| `--transition-slow`    | 250ms ease | Panels, drawer, onglets |

---

## 7. FOCUS

| Token          | Valeur                                      |
| -------------- | ------------------------------------------- |
| `--focus-ring` | 2px solid `var(--primary)`, offset 2px      |

```css
:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
```

---

## 8. ÉTATS DES COMPOSANTS INTERACTIFS

Applicable à tous les boutons, onglets, items cliquables :

| État                   | Règle                                                                 |
| ---------------------- | --------------------------------------------------------------------- |
| `default`              | Style de base défini par le composant                                  |
| `:hover`               | Fond `--bg-muted`, transition `--transition-default`                   |
| `active` / sélectionné | Fond `--primary-bg`, texte `--primary` (classe `.is-active`)           |
| `disabled`             | Opacité 40%, `pointer-events: none` (attribut `disabled` ou `.is-disabled`) |
| `:focus-visible`       | `--focus-ring` visible                                                 |

---

## 9. BOUTONS

| Variante   | Classe           | Fond           | Texte           | Bordure             |
| ---------- | ---------------- | -------------- | --------------- | ------------------- |
| Primaire   | `.btn-primary`   | `--primary`    | #FFFFFF         | aucune              |
| Secondaire | `.btn-secondary` | transparent    | `--text`        | 1px `--border`      |
| Danger     | `.btn-danger`    | `--danger-600` | #FFFFFF         | aucune              |
| Ghost      | `.btn-ghost`     | transparent    | `--text-subtle` | aucune              |

**Dimensionnement dynamique** — la taille résulte du contenu + padding :

| Taille                  | Padding vertical     | Padding horizontal   | Police                          |
| ----------------------- | -------------------- | -------------------- | ------------------------------- |
| `.btn-sm`               | `--spacing-1` (4px)  | `--spacing-3` (12px) | `--weight-medium` `--font-xs`   |
| `.btn-md` (défaut)      | `--spacing-2` (8px)  | `--spacing-4` (16px) | `--weight-medium` `--font-sm`   |
| `.btn-lg`               | `--spacing-3` (12px) | `--spacing-6` (24px) | `--weight-medium` `--font-base` |

**Groupe de boutons alignés** : conteneur `.btn-group` — largeur uniformisée sur le bouton le plus large (`min-width` commune ou grid `auto-fit` à colonnes égales).

---

## 10. ICÔNES — Font Awesome Free

Bibliothèque : `@fortawesome/fontawesome-free` (npm, embarquée localement — **zéro CDN**, CSP oblige).
Import unique dans le renderer : `import "@fortawesome/fontawesome-free/css/all.min.css"`.

**Différence vs qtawesome** : les icônes sont des éléments `<i>` stylés par CSS — leurs couleurs passent par des tokens, **pas** par une constante de config. L'exception `config.py` du générateur Python n'existe pas ici.

| Token            | Clair (`:root`)        | Sombre (`[data-theme="dark"]`) |
| ---------------- | ---------------------- | ------------------------------ |
| `--icon-default` | #6B7280 (text-subtle)  | #9CA3AF                        |
| `--icon-active`  | #4F46E5 (primary-600)  | #818CF8                        |
| `--icon-danger`  | #DC2626 (danger-600)   | #F87171                        |
| `--icon-success` | #16A34A (success-600)  | #4ADE80                        |
| `--icon-muted`   | #9CA3AF (text-muted)   | #6B7280                        |

**Tailles** : `font-size` via tokens `--icon-sm` (16px), `--icon-md` (20px), `--icon-lg` (24px).

```tsx
// Utilisation dans une view (React)
<i className="fa-solid fa-house icon icon-md icon-default" aria-hidden="true" />
```

```css
/* styles.css — token : icon-* */
.icon-default { color: var(--icon-default); }
.icon-md      { font-size: var(--icon-md); }
```

**Changement de thème** : aucune action — les variables CSS basculent avec `data-theme`, les icônes suivent instantanément.

---

## 11. RÈGLES D'APPLICATION CSS

1. **Zéro valeur visuelle en dur dans TS/TSX.** Toute couleur, taille, police est dans `tokens.css` / `styles.css`. Zéro `style={}` inline.
2. **Chaque élément stylé a un `className`** correspondant à une règle CSS nommée (`id` réservé aux ancres uniques : `#topbar`, `#statusbar`).
3. **Le mode sombre est géré par `data-theme="dark"` sur `<html>`** — tous les tokens redéfinis dans **un seul bloc** `[data-theme="dark"]` de `tokens.css`. `styles.css` ne contient aucun sélecteur de thème.
4. **`styles.css` ne contient aucune valeur littérale** de couleur, taille ou durée — uniquement `var(--token)`. Toute règle porte un commentaire indiquant le token source.

```css
/* styles.css — token : bg / text */
body {
  background-color: var(--bg);
  color: var(--text);
}
```

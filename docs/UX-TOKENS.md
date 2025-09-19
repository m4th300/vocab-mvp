# Tokens UI & Thèmes (Tailwind v4-ready)

## Principes
- **Spacing** base 8px : 2, 4, 8, 16, 24, 32…
- **Radius** : `rounded-2xl` par défaut pour cards/modales.
- **Ombres** : `shadow-lg` / `shadow-xl` douces.
- **Palette** : fond blanc/noir, texte `#0F172A` (slate-900) / `#E5E7EB` (slate-200), accents discrets.
- **Dossier colors (6 soft)** : `#94A3B8`, `#A78BFA`, `#60A5FA`, `#34D399`, `#FBBF24`, `#F87171`.

## Thèmes via CSS variables
- Thème clair : `:root { --bg: #ffffff; --fg: #0F172A; --muted: #475569; --border: #E2E8F0; --accent: #6366F1; }`
- Thème sombre : `[data-theme="dark"] { --bg: #0B1220; --fg: #E5E7EB; --muted: #94A3B8; --border: #1F2937; --accent: #818CF8; }`

> Ces variables seront **reliées** aux classes Tailwind v4 (via utilitaires et `@import "tailwindcss"`).  
> Les composants liront les tokens via classes Tailwind + CSS vars (Lot 2).

## Tailwind v4 — rappels
- Import unique dans `tailwind.css` : `@import "tailwindcss";`
- Utilisation de CSS vars dans utilitaires (ex: `bg-[var(--bg)]`, `text-[var(--fg)]`, `border-[var(--border)]`)
- Config minimale : pas de `content[]`. Config étendue uniquement si besoin (Lot 1/2).

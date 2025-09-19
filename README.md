# Vocab Cards — MVP (Vite + React + TypeScript + Tailwind v4)

## À propos
> Licence : MIT • Stack : Vite + React + TypeScript + Tailwind v4 • Persistance : IndexedDB (idb)

## Objectif
Construire un MVP propre, extensible et élégant d’une webapp de fiches de vocabulaire (recto/verso) avec quiz :
- CRUD cartes + dossiers hiérarchiques
- Quiz (QCM, inversé, saisie + tolérance)
- UX clavier prioritaire, light/dark, micro-animations
- Persistance locale (IndexedDB via `idb`), extension future SRS (SM-2), gamification, analytics

## Protocole de livraison (🔒 impératif)
Livraison **par lots séquentiels de 7–8 items**, point d’arrêt à la fin de chaque lot.  
Je ne passerai au lot suivant **que** sur validation explicite “Oui”.
- Chaque lot maintient un état **intégrable et cohérent**.
- Si un fichier existe déjà, version complète (pas de diff).
- Jamais de livraison “fichier par fichier”.

## Stack & contraintes
- Vite, React, TypeScript (strict)
- Tailwind **v4** (syntaxe v4, tokens CSS natifs, plus de `content[]`)
- framer-motion, Zustand, `idb`
- ESLint + Prettier (Lot 1)
- Architecture **feature-first**

### 🧶 Tailwind v4 (notes importantes)
- Import CSS natif : `@import "tailwindcss";`
- Thèmes via variables CSS et data-attributes (`[data-theme="dark"]`)
- Utilisation des tokens CSS (variables) mappées à Tailwind
- Les classes et exemples fournis respecteront **strictement** Tailwind v4.

## Prérequis
- Node.js ≥ 20.x (recommandé 22.x LTS), npm ≥ 10
- Git
- Éditeur avec ESLint/Prettier (VS Code recommandé)

## Roadmap (lots)
- Lot 0 — Préflight (vous êtes ici)
- Lot 1 — Bootstrap (Vite/TS/Tailwind v4/ESLint/Prettier, providers, arborescence)
- Lot 2 — Design System (thèmes, tokens, UI primitives : Button, Input, Dialog, Toast)
- Lot 3 — Données & Persistance (models, db wrapper IndexedDB, repos, seed)
- Lot 4 — CRUD & Navigation (sidebar dossiers, liste cartes, modales, recherche)
- Lot 5 — Quiz (launcher, QCM, inversé, saisie + tolérance, adaptativité simple)
- Lot 6 — Dashboard (KPIs, “Aujourd’hui”, hooks SRS placeholders)
- Lot 7 — QA & Polish (raccourcis, micro-anim, README final, import/export JSON)

## Démarrage (sera effectif au Lot 1)
```bash
npm i
npm run dev

## Licence

Ce projet est sous licence **MIT**.  
© 2025 Mathéo. Voir le fichier `LICENSE` pour le texte complet.

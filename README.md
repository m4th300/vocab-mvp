# Vocab Cards — MVP

MVP d’une webapp de **fiches vocabulaire** (recto/verso) avec **quiz**.
Stack : **Vite + React + TypeScript + Tailwind v4 + Zustand + idb + framer-motion**.

## Installation

```bash
npm i
npm run dev
# build produit
npm run build && npm run preview
Scripts
dev : lancement serveur Vite

build : build prod

preview : prévisualisation du build

typecheck : tsc --noEmit

lint : ESLint

format : Prettier

Fonctionnalités MVP
Dossiers (couleur soft), Cartes (term/definition), recherche.

Quiz : QCM, QCM inversé, Saisie (+ tolérance Damerau–Levenshtein, mode Hardcore).

Adaptativité simple (cartes “faibles” reviennent plus).

Dashboard : KPI (Total, 7j, Sessions aujourd’hui), section “Aujourd’hui”.

Persistance locale : IndexedDB (idb), Import/Export JSON.

Raccourcis :

Global quiz : 1..4 (QCM), Enter (valider), Esc (quitter)

Liste cartes : N (nouvelle), E (éditer 1ʳᵉ), Del (supprimer 1ʳᵉ)

Modales : Esc (fermer)

Architecture (feature-first)
bash
Copier le code
src/
  app/               # Shell, routes, providers
  core/
    models/         # types
    storage/        # idb + repo + backup
    logic/quiz/     # generateOptions, tolerance, adaptivity, due
    analytics/      # track() (no-op)
    utils/          # id, string, keyboard...
  features/
    folders/        # sidebar + modal
    cards/          # list + item + modal
    quiz/           # launcher + modes + components
    dashboard/      # KPI + Aujourd’hui
  ui/               # design system léger
Import/Export
Exporter JSON : Topbar → “Exporter JSON”.

Importer JSON : Topbar → “Importer JSON” (merge idempotent par id).

Roadmap (Étape 2 & 3)
SRS SM-2 complet (champs dueDate, easiness, interval).

Gamification : XP, niveaux, succès.

Analytics : véritable provider + envoi d’événements.

Calendrier : vue due/heatmap.

Mobile polish + accessibilité approfondie.

yaml
Copier le code

---

## 5) Checklist d’acceptation
- [ ] Boutons **Importer JSON** / **Exporter JSON** visibles en topbar, exporte un fichier et importe correctement (merge idempotent).
- [ ] Après import/export, la **sidebar** et les **KPI** se rafraîchissent (grâce à `db:changed`).
- [ ] Sur **/cards**, les raccourcis **N / E / Del** fonctionnent (et sont ignorés si le focus est dans un input).
- [ ] En QCM, les options ont une **micro-animation** douce au survol/clic.
- [ ] README à jour (setup, scripts, raccourcis, roadmap).
- [ ] `npm run dev` (et `npm run build`) OK.

---

## 6) Point d’arrêt
Lot 7 livré ✅  
Tu veux qu’on enchaîne avec un **Lot 8 (facultatif)** pour quelques finitions (ex. tags optionnels, petite pagination, améliorations d’accessibilité), ou on s’arrête ici pour ce MVP ?





Demander à ChatGPT

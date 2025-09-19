# Accessibilité (AA)

- **Contrastes** : respecter WCAG AA (texte, icônes, contrôles).
- **Focus visible** : anneaux de focus toujours visibles au clavier, non masqués en dark.
- **Modales** : trap focus, `aria-modal="true"`, `role="dialog"`, fermeture via `Esc`, focus retour au déclencheur.
- **Toasts** : non bloquants, durée raisonnable, `aria-live="polite"`.
- **Labels/Inputs** : `label` associé, `aria-describedby` pour messages d’erreur.
- **Clavier** : tous les flux critiques (CRUD, quiz) accessibles sans souris.
- **Animations** : respecter `prefers-reduced-motion`.

# Architecture — feature-first

## Structure cible (résumé)
src/
  app/
    main.tsx
    App.tsx
    routes.tsx
    providers/
      ThemeProvider.tsx
      StoreProvider.tsx
  core/
    utils/
      id.ts
      string.ts
      keyboard.ts
    storage/
      db.ts
      repo/
        cardsRepo.ts
        foldersRepo.ts
    models/
      card.ts
      folder.ts
      tag.ts
    logic/
      quiz/
        generateOptions.ts
        tolerance.ts
        adaptivity.ts
  features/
    dashboard/
      DashboardPage.tsx
    folders/
      SidebarFolders.tsx
      FolderFormModal.tsx
    cards/
      CardsList.tsx
      CardFormModal.tsx
      CardItem.tsx
    quiz/
      QuizLauncher.tsx
      QuizQCM.tsx
      QuizReverseQCM.tsx
      QuizTyping.tsx
      QuizResult.tsx
      components/
        OptionButton.tsx
        ProgressBar.tsx
        FeedbackToast.tsx
        FlipCard.tsx
  ui/
    Button.tsx
    Input.tsx
    Select.tsx
    Dialog.tsx
    Toast.tsx
    Toggle.tsx
    Badge.tsx
    Tooltip.tsx
    ColorDot.tsx
  styles/
    globals.css
    tailwind.css
  store/
    useCardsStore.ts
    useFoldersStore.ts
    useSettingsStore.ts
  assets/
    logo.svg
    icons/*

## Conventions
- **Nommage** : PascalCase pour composants, camelCase pour fonctions/vars, SCREAMING_SNAKE pour const env.
- **Imports** : relatifs courts, alias `@/*` (Lot 1 tsconfig).
- **Types** : interfaces dans `core/models/*`, utilitaires purs dans `core/utils/*`.
- **Repos** : toute I/O locale (IndexedDB/LocalStorage) passe par `core/storage/repo/*`.
- **Stores** : Zustand dans `store/*` (UI/Settings/Cards/Folders).
- **UI** : primitives neutres dans `ui/*`, réutilisables feature-agnostiques.
- **Animations** : framer-motion encapsulé dans composants (ex: `FlipCard`), pas d’effet gratuit.

## Qualité
- TypeScript strict, ESLint + Prettier (Lot 1)
- Tests à venir (hors MVP).

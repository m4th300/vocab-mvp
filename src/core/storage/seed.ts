import { createFolder, FOLDER_COLORS, listFolders } from '@/core/storage/repo/foldersRepo';
import { createCard } from '@/core/storage/repo/cardsRepo';

export async function loadDemoSeed() {
  // évite de dupliquer si déjà présents
  const existing = await listFolders();
  if (existing.length > 0) return { created: false };

  const [basics, verbs, travel] = await Promise.all([
    createFolder({ name: 'Basics', color: FOLDER_COLORS[2] }),
    createFolder({ name: 'Verbs', color: FOLDER_COLORS[3] }),
    createFolder({ name: 'Travel', color: FOLDER_COLORS[1] })
  ]);

  const cards: Array<[string, string, string]> = [
    ['apple', 'pomme', basics.id],
    ['book', 'livre', basics.id],
    ['house', 'maison', basics.id],
    ['water', 'eau', basics.id],
    ['to be', 'être', verbs.id],
    ['to have', 'avoir', verbs.id],
    ['to go', 'aller', verbs.id],
    ['to see', 'voir', verbs.id],
    ['airport', 'aéroport', travel.id],
    ['ticket', 'billet', travel.id],
    ['luggage', 'bagage', travel.id],
    ['train', 'train', travel.id]
  ];

  await Promise.all(
    cards.map(([term, def, folderId]) =>
      createCard({ term, definition: def, folderId })
    )
  );

  return { created: true };
}

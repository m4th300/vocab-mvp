import { createFolder, FOLDER_COLORS, listFolders } from '@/core/storage/repo/foldersRepo';
import { createCard, listCards } from '@/core/storage/repo/cardsRepo';

type SeedReport = {
  created: boolean;
  foldersCreated: number;
  cardsCreated: number;
  message: string;
};

export async function loadDemoSeed(): Promise<SeedReport> {
  // On travaille par noms de dossiers (idempotence)
  const wantedFolders = [
    { name: 'Basics', color: FOLDER_COLORS[2] },
    { name: 'Verbs', color: FOLDER_COLORS[3] },
    { name: 'Travel', color: FOLDER_COLORS[1] }
  ] as const;

  const existingFolders = await listFolders();
  const byName = new Map(existingFolders.map(f => [f.name.toLowerCase(), f]));
  let foldersCreated = 0;

  // Crée uniquement les dossiers manquants
  for (const wf of wantedFolders) {
    if (!byName.has(wf.name.toLowerCase())) {
      const nf = await createFolder({ name: wf.name, color: wf.color });
      byName.set(nf.name.toLowerCase(), nf);
      foldersCreated++;
    }
  }

  // Table des cartes à semer (term, def, folderName)
  const seedCards: Array<[string, string, string]> = [
    ['apple', 'pomme', 'Basics'],
    ['book', 'livre', 'Basics'],
    ['house', 'maison', 'Basics'],
    ['water', 'eau', 'Basics'],
    ['to be', 'être', 'Verbs'],
    ['to have', 'avoir', 'Verbs'],
    ['to go', 'aller', 'Verbs'],
    ['to see', 'voir', 'Verbs'],
    ['airport', 'aéroport', 'Travel'],
    ['ticket', 'billet', 'Travel'],
    ['luggage', 'bagage', 'Travel'],
    ['train', 'train', 'Travel']
  ];

  // On charge toutes les cartes existantes une fois (tous dossiers)
  const existingCards = await listCards({});
  const cardKey = (term: string, folderId: string) =>
    `${term.toLowerCase()}__${folderId}`;

  const existingSet = new Set(
    existingCards.map(c => cardKey(c.term, c.folderId))
  );

  let cardsCreated = 0;

  for (const [term, def, folderName] of seedCards) {
    const folder = byName.get(folderName.toLowerCase());
    if (!folder) continue;
    const key = cardKey(term, folder.id);
    if (!existingSet.has(key)) {
      await createCard({ term, definition: def, folderId: folder.id });
      existingSet.add(key);
      cardsCreated++;
    }
  }

  const created = foldersCreated + cardsCreated > 0;
  const message = created
    ? `Ajoutés : ${foldersCreated} dossier(s), ${cardsCreated} carte(s).`
    : 'Rien à ajouter (données déjà présentes).';

  return { created, foldersCreated, cardsCreated, message };
}

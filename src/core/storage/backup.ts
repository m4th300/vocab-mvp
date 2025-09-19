import { withStore } from '@/core/storage/db';
import { dbChanged } from '@/core/storage/events';
import type { Card } from '@/core/models/card';
import type { Folder } from '@/core/models/folder';

type ExportShape = {
  version: 1;
  exportedAt: string;
  folders: Folder[];
  cards: Card[];
};

export async function exportData(): Promise<ExportShape> {
  const [folders, cards] = await Promise.all([
    withStore('folders', 'readonly', (s) => s.getAll() as Promise<Folder[]>),
    withStore('cards', 'readonly', (s) => s.getAll() as Promise<Card[]>),
  ]);
  return {
    version: 1 as const,
    exportedAt: new Date().toISOString(),
    folders,
    cards,
  };
}

export async function importData(json: string): Promise<{ folders: number; cards: number }> {
  const data = JSON.parse(json) as Partial<ExportShape>;
  if (data.version !== 1 || !Array.isArray(data.folders) || !Array.isArray(data.cards)) {
    throw new Error('Fichier d’export invalide.');
  }

  let fCount = 0;
  let cCount = 0;

  // upsert dossiers par id
  await withStore('folders', 'readwrite', async (s) => {
    for (const f of data.folders!) {
      await s.put(f as Folder);
      fCount++;
    }
  });

  // upsert cartes par id
  await withStore('cards', 'readwrite', async (s) => {
    for (const c of data.cards!) {
      await s.put(c as Card);
      cCount++;
    }
  });

  dbChanged();
  return { folders: fCount, cards: cCount };
}

/** Déclenche un téléchargement du JSON dans le navigateur */
export async function downloadExport(filename = 'vocab-backup.json') {
  const payload = await exportData();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

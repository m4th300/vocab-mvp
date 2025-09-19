import type { Folder, FolderId } from '@/core/models/folder';
import { newId } from '@/core/utils/id';
import { getDB, withStore } from '@/core/storage/db';

export const FOLDER_COLORS = [
  '#94A3B8', // slate-400
  '#A78BFA', // violet-400
  '#60A5FA', // blue-400
  '#34D399', // emerald-400
  '#FBBF24', // amber-400
  '#F87171'  // red-400
];

export async function createFolder(input: { name: string; color?: string; parentId?: FolderId; }): Promise<Folder> {
  const folder: Folder = {
    id: newId('fld_'),
    name: input.name.trim(),
    color: input.color ?? FOLDER_COLORS[0],
    parentId: input.parentId
  };
  await withStore('folders', 'readwrite', async (s) => {
    await s.put(folder);
    return;
  });
  return folder;
}

export async function updateFolder(id: FolderId, patch: Partial<Omit<Folder, 'id'>>): Promise<Folder | null> {
  const existing = await getFolder(id);
  if (!existing) return null;
  const updated: Folder = { ...existing, ...patch };
  await withStore('folders', 'readwrite', async (s) => {
    await s.put(updated);
    return;
  });
  return updated;
}

export async function deleteFolder(id: FolderId): Promise<void> {
  await withStore('folders', 'readwrite', async (s) => {
    await s.delete(id);
    return;
  });
}

export async function getFolder(id: FolderId): Promise<Folder | null> {
  return withStore('folders', 'readonly', async (s) => {
    const v = await s.get(id);
    return (v as Folder) ?? null;
  });
}

export async function listFolders(parentId?: FolderId): Promise<Folder[]> {
  if (parentId === undefined) {
    return withStore('folders', 'readonly', async (s) => {
      const all = (await s.getAll()) as Folder[];
      return all.sort((a, b) => a.name.localeCompare(b.name));
    });
  }
  const db = await getDB();
  const tx = db.transaction('folders', 'readonly');
  const idx = tx.store.index('by_parent');
  const list = (await idx.getAll(parentId)) as Folder[];
  await tx.done;
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export async function countFolders(): Promise<number> {
  return withStore('folders', 'readonly', async (s) => s.count());
}

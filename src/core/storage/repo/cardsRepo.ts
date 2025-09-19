import type { Card, CardId } from '@/core/models/card';
import { newId, nowIso } from '@/core/utils/id';
import { normalizeText } from '@/core/utils/string';
import { getDB, withStore } from '@/core/storage/db';
import { dbChanged } from '@/core/storage/events';

export async function createCard(input: {
  term: string;
  definition: string;
  folderId: string;
  tagIds?: string[];
}): Promise<Card> {
  const now = nowIso();
  const card: Card = {
    id: newId('crd_'),
    term: input.term.trim(),
    definition: input.definition.trim(),
    folderId: input.folderId,
    tagIds: input.tagIds ?? [],
    createdAt: now,
    updatedAt: now,
    stats: { correctStreak: 0 }
  };
  await withStore('cards', 'readwrite', async (s) => { await s.put(card); });
  dbChanged();
  return card;
}

export async function updateCard(
  id: CardId,
  patch: Partial<Omit<Card, 'id' | 'createdAt'>>
): Promise<Card | null> {
  const existing = await getCard(id);
  if (!existing) return null;
  const updated: Card = { ...existing, ...patch, updatedAt: nowIso() };
  await withStore('cards', 'readwrite', async (s) => { await s.put(updated); });
  dbChanged();
  return updated;
}

export async function deleteCard(id: CardId): Promise<void> {
  await withStore('cards', 'readwrite', async (s) => { await s.delete(id); });
  dbChanged();
}

/** ❗ Supprime toutes les cartes d'un dossier et renvoie le nombre supprimé */
export async function deleteCardsByFolder(folderId: string): Promise<number> {
  const db = await getDB();
  const tx = db.transaction('cards', 'readwrite');
  const idx = tx.store.index('by_folder');
  const keys = await idx.getAllKeys(folderId);
  for (const key of keys) {
    await tx.store.delete(key as string);
  }
  await tx.done;
  if (keys.length) dbChanged();
  return keys.length;
}

export async function getCard(id: CardId): Promise<Card | null> {
  return withStore('cards', 'readonly', async (s) => (await s.get(id)) as Card | null);
}

export type ListCardsFilter = { folderId?: string; query?: string };

export async function listCards(filter: ListCardsFilter = {}): Promise<Card[]> {
  const db = await getDB();
  const tx = db.transaction('cards', 'readonly');
  const store = tx.store;

  let cards: Card[];
  if (filter.folderId) {
    const byFolder = store.index('by_folder');
    cards = (await byFolder.getAll(filter.folderId)) as Card[];
  } else {
    cards = (await store.getAll()) as Card[];
  }
  await tx.done;

  if (filter.query && filter.query.trim()) {
    const q = normalizeText(filter.query);
    cards = cards.filter(
      (c) => normalizeText(c.term).includes(q) || normalizeText(c.definition).includes(q)
    );
  }

  return cards.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function countCards(): Promise<number> {
  return withStore('cards', 'readonly', async (s) => s.count());
}

/** KPI: nombre de cartes créées depuis X jours */
export async function countCardsAddedSince(days: number): Promise<number> {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const all = await listCards();
  return all.filter((c) => Date.parse(c.createdAt) >= since).length;
}

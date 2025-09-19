import { create } from 'zustand';
import type { Card } from '@/core/models/card';
import { listCards, createCard, updateCard, deleteCard } from '@/core/storage/repo/cardsRepo';

type CardsState = {
  cards: Card[];
  loading: boolean;
  load: (filter?: { folderId?: string; query?: string }) => Promise<void>;
  create: (input: { term: string; definition: string; folderId: string }) => Promise<Card>;
  edit: (id: string, patch: Partial<Omit<Card,'id'|'createdAt'>>) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useCardsStore = create<CardsState>((set, get) => ({
  cards: [],
  loading: false,
  load: async (filter) => {
    set({ loading: true });
    const all = await listCards(filter);
    set({ cards: all, loading: false });
  },
  create: async (input) => {
    const c = await createCard(input);
    set({ cards: [c, ...get().cards] });
    return c;
  },
  edit: async (id, patch) => {
    const u = await updateCard(id, patch);
    if (!u) return;
    set({ cards: get().cards.map(c => c.id===id ? u : c) });
  },
  remove: async (id) => {
    await deleteCard(id);
    set({ cards: get().cards.filter(c => c.id !== id) });
  }
}));

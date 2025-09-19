import { create } from 'zustand';

type SettingsState = {
  selectedFolderId: string | null;
  searchQuery: string;
  setFolder: (id: string | null) => void;
  setQuery: (q: string) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  selectedFolderId: null,
  searchQuery: '',
  setFolder: (id) => set({ selectedFolderId: id }),
  setQuery: (q) => set({ searchQuery: q })
}));

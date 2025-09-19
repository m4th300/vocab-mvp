import { create } from 'zustand';
import type { Folder } from '@/core/models/folder';
import { listFolders, createFolder, updateFolder, deleteFolder, FOLDER_COLORS } from '@/core/storage/repo/foldersRepo';

type FoldersState = {
  folders: Folder[];
  loading: boolean;
  load: () => Promise<void>;
  create: (input: { name: string; color?: string; parentId?: string }) => Promise<Folder>;
  rename: (id: string, name: string) => Promise<void>;
  recolor: (id: string, color: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  colors: string[];
};

export const useFoldersStore = create<FoldersState>((set, get) => ({
  folders: [],
  loading: false,
  colors: FOLDER_COLORS,
  load: async () => {
    set({ loading: true });
    const all = await listFolders();
    set({ folders: all, loading: false });
  },
  create: async (input) => {
    const f = await createFolder(input);
    set({ folders: [...get().folders, f].sort((a,b)=>a.name.localeCompare(b.name)) });
    return f;
  },
  rename: async (id, name) => {
    const u = await updateFolder(id, { name });
    if (!u) return;
    set({ folders: get().folders.map(f => f.id===id ? u : f).sort((a,b)=>a.name.localeCompare(b.name)) });
  },
  recolor: async (id, color) => {
    const u = await updateFolder(id, { color });
    if (!u) return;
    set({ folders: get().folders.map(f => f.id===id ? u : f) });
  },
  remove: async (id) => {
    await deleteFolder(id);
    set({ folders: get().folders.filter(f => f.id !== id) });
  }
}));

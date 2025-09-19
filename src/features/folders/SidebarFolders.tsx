import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useFoldersStore } from '@/store/useFoldersStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useCardsStore } from '@/store/useCardsStore';
import { Button } from '@/ui/Button';
import { FolderFormModal } from './FolderFormModal';
import { useToast } from '@/ui/Toast';

export default function SidebarFolders() {
  const { folders, load, remove } = useFoldersStore();
  const { selectedFolderId, setFolder } = useSettingsStore();
  const { load: loadCards } = useCardsStore();
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);

  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => { void load(); }, [load]);

  // synchronise query param → store
  useEffect(() => {
    const p = new URLSearchParams(loc.search);
    const fid = p.get('folder') || null;
    setFolder(fid);
  }, [loc.search, setFolder]);

  function goFolder(id: string | null) {
    const p = new URLSearchParams();
    if (id) p.set('folder', id);
    navigate({ pathname: '/cards', search: p.toString() });
  }

  async function onDeleteFolder(id: string) {
    if (!confirm('Supprimer ce dossier et toutes ses cartes ?')) return;
    const deleted = await remove(id);
    // si on était dessus, on revient à "Toutes les cartes"
    if (selectedFolderId === id) goFolder(null);
    // recharge la liste des cartes (au cas où on est sur "Toutes les cartes")
    await loadCards({});
    toast.show({
      title: 'Dossier supprimé',
      description: deleted > 0 ? `+ ${deleted} carte(s) supprimée(s)` : 'Aucune carte dans ce dossier.'
    });
  }

  return (
    <aside className="w-56 border-r border-[var(--border)] hidden md:flex md:flex-col">
      <div className="p-3 flex items-center justify-between">
        <div className="text-sm text-[var(--muted)]">Dossiers</div>
        <Button size="sm" variant="outline" onClick={() => { setEditId(undefined); setOpen(true); }}>+ New</Button>
      </div>

      <nav className="px-3 pb-3 space-y-1 overflow-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block px-3 py-2 rounded-lg ${
              isActive && loc.pathname==='/' ? 'bg-[var(--border)]/40' : 'hover:bg-[var(--border)]/30'
            }`
          }
          end
        >
          Dashboard
        </NavLink>

        <button
          onClick={() => goFolder(null)}
          className={`w-full text-left px-3 py-2 rounded-lg ${loc.pathname.startsWith('/cards') && !selectedFolderId ? 'bg-[var(--border)]/40' : 'hover:bg-[var(--border)]/30'}`}
        >
          Toutes les cartes
        </button>

        <div className="mt-2 border-t border-[var(--border)]/70" />

        {folders.map(f => (
          <div key={f.id} className="group flex items-center gap-2 px-2">
            <button
              onClick={() => goFolder(f.id)}
              className={`flex-1 text-left px-2 py-2 rounded-lg ${selectedFolderId===f.id ? 'bg-[var(--border)]/40' : 'hover:bg-[var(--border)]/30'}`}
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full mr-2 align-middle" style={{ backgroundColor: f.color }} />
              {f.name}
            </button>
            <button className="opacity-60 hover:opacity-100 px-1" title="Renommer" onClick={() => { setEditId(f.id); setOpen(true); }}>✏️</button>
            <button className="opacity-60 hover:opacity-100 px-1" title="Supprimer" onClick={() => onDeleteFolder(f.id)}>🗑️</button>
          </div>
        ))}
      </nav>

      <FolderFormModal open={open} onClose={()=>setOpen(false)} folderId={editId} />
    </aside>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCardsStore } from '@/store/useCardsStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useFoldersStore } from '@/store/useFoldersStore';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { CardFormModal } from './CardFormModal';
import { CardItem } from './CardItem';
import { isFromEditable } from '@/core/utils/keyboard';

export default function CardsList() {
  const [params] = useSearchParams();
  const folderId = params.get('folder');
  const { cards, load, remove } = useCardsStore();
  const { folders } = useFoldersStore();
  const { searchQuery, setQuery } = useSettingsStore();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    void load({ folderId: folderId ?? undefined, query: searchQuery });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId, searchQuery]);

  // Raccourcis N / E / Del (sur la 1ʳᵉ carte en liste par simplicité)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isFromEditable(e)) return;
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setEditingId(null);
        setOpen(true);
      } else if (e.key.toLowerCase() === 'e') {
        if (cards[0]) {
          e.preventDefault();
          setEditingId(cards[0].id);
          setOpen(true);
        }
      } else if (e.key === 'Delete') {
        if (cards[0]) {
          e.preventDefault();
          if (confirm('Supprimer la première carte de la liste ?')) {
            void remove(cards[0].id);
          }
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cards, remove]);

  const folderName = useMemo(() => {
    if (!folderId) return 'Toutes les cartes';
    return folders.find(f => f.id === folderId)?.name ?? 'Cartes';
  }, [folderId, folders]);

  const editing = cards.find(c => c.id === editingId) || null;

  function onNew() {
    setEditingId(null);
    setOpen(true);
  }

  function onEdit(id: string) {
    setEditingId(id);
    setOpen(true);
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{folderName}</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Rechercher…"
            value={searchQuery}
            onChange={(e)=>setQuery(e.target.value)}
          />
          <Button onClick={onNew}>+ Nouvelle carte</Button>
        </div>
      </div>

      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-[var(--muted)]">
            <tr>
              <th className="px-3 py-2 font-medium">Term</th>
              <th className="px-3 py-2 font-medium">Definition</th>
              <th className="px-3 py-2 font-medium">Updated</th>
              <th className="px-3 py-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map(c => (
              <CardItem
                key={c.id}
                card={c}
                onEdit={()=>onEdit(c.id)}
                onDelete={async ()=>{ if (confirm('Supprimer cette carte ?')) await remove(c.id); }}
              />
            ))}
            {cards.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-[var(--muted)]" colSpan={4}>
                  Aucune carte pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CardFormModal
        open={open}
        onClose={()=>setOpen(false)}
        folderId={folderId ?? ''}
        card={editing ? { id: editing.id, term: editing.term, definition: editing.definition } : undefined}
      />
    </div>
  );
}

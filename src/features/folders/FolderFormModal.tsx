import { useEffect, useState } from 'react';
import { Dialog } from '@/ui/Dialog';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { useFoldersStore } from '@/store/useFoldersStore';

type Props = {
  open: boolean;
  onClose: () => void;
  folderId?: string; // si présent = édition
};

export function FolderFormModal({ open, onClose, folderId }: Props) {
  const { folders, create, rename, colors, recolor } = useFoldersStore();
  const editing = folders.find(f => f.id === folderId) || null;

  const [name, setName] = useState('');
  const [color, setColor] = useState(colors[0]);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setColor(editing.color);
    } else {
      setName('');
      setColor(colors[0]);
    }
  }, [editing, colors]);

  async function onSubmit() {
    if (!name.trim()) return;
    if (editing) {
      await rename(editing.id, name.trim());
      if (color !== editing.color) await recolor(editing.id, color);
    } else {
      await create({ name: name.trim(), color });
    }
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editing ? 'Renommer le dossier' : 'Nouveau dossier'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button onClick={onSubmit}>Enregistrer</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Nom" value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Basics" />
        <div>
          <div className="mb-1 text-sm text-[var(--muted)]">Couleur</div>
          <div className="flex flex-wrap gap-2">
            {colors.map(c => (
              <button
                key={c}
                aria-label={`Choisir ${c}`}
                className={`h-7 w-7 rounded-full border ${color===c ? 'ring-2 ring-[var(--ring)]' : ''}`}
                style={{ backgroundColor: c, borderColor: 'var(--border)' }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

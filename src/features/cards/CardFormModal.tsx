import { useEffect, useState } from 'react';
import { Dialog } from '@/ui/Dialog';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { useCardsStore } from '@/store/useCardsStore';

type Props = {
  open: boolean;
  onClose: () => void;
  folderId: string;
  card?: { id: string; term: string; definition: string };
};

export function CardFormModal({ open, onClose, folderId, card }: Props) {
  const { create, edit } = useCardsStore();
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');

  useEffect(() => {
    if (card) {
      setTerm(card.term);
      setDefinition(card.definition);
    } else {
      setTerm('');
      setDefinition('');
    }
  }, [card]);

  async function onSubmit() {
    if (!term.trim() || !definition.trim()) return;
    if (card) {
      await edit(card.id, { term: term.trim(), definition: definition.trim() });
    } else {
      await create({ term: term.trim(), definition: definition.trim(), folderId });
    }
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={card ? 'Modifier la carte' : 'Nouvelle carte'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button onClick={onSubmit}>Enregistrer</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Term (recto)" value={term} onChange={e=>setTerm(e.target.value)} placeholder="apple" />
        <Input label="Definition (verso)" value={definition} onChange={e=>setDefinition(e.target.value)} placeholder="pomme" />
      </div>
    </Dialog>
  );
}

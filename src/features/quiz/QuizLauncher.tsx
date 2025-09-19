import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFoldersStore } from '@/store/useFoldersStore';
import { useCardsStore } from '@/store/useCardsStore';
import { Button } from '@/ui/Button';
import { Toggle } from '@/ui/Toggle';

export default function QuizLauncher() {
  const { folders, load: loadFolders } = useFoldersStore();
  const { cards, load: loadCards } = useCardsStore();
  const [folderId, setFolderId] = useState<string | ''>('');
  const [mode, setMode] = useState<'qcm' | 'reverse' | 'typing'>('qcm');
  const [hardcore, setHardcore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { void loadFolders(); }, [loadFolders]);
  useEffect(() => { void loadCards({ folderId: folderId || undefined }); }, [folderId, loadCards]);

  const count = useMemo(() => cards.length, [cards]);

  function start() {
    const p = new URLSearchParams();
    if (folderId) p.set('folder', folderId);
    if (hardcore) p.set('hardcore', '1');

    const path =
      mode === 'qcm'
        ? '/quiz/run'
        : mode === 'reverse'
        ? '/quiz/run-reverse'
        : '/quiz/run-typing';

    navigate({ pathname: path, search: p.toString() });
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold mb-4">Lancer un quiz</h1>
      <div className="grid gap-6 max-w-xl">
        <div className="card p-4">
          <div className="mb-2 text-sm text-[var(--muted)]">Dossier source</div>
          <select
            className="h-10 w-full rounded-2xl border border-[var(--border)] bg-transparent px-3"
            value={folderId}
            onChange={e=>setFolderId(e.target.value)}
          >
            <option value="">Toutes les cartes</option>
            {folders.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <div className="mt-2 text-sm text-[var(--muted)]">{count} carte(s) sélectionnée(s)</div>
        </div>

        <div className="card p-4">
          <div className="mb-2 text-sm text-[var(--muted)]">Mode</div>
          <div className="flex gap-2">
            <Button variant={mode==='qcm'?'default':'outline'} onClick={()=>setMode('qcm')}>QCM</Button>
            <Button variant={mode==='reverse'?'default':'outline'} onClick={()=>setMode('reverse')}>QCM inversé</Button>
            <Button variant={mode==='typing'?'default':'outline'} onClick={()=>setMode('typing')}>Saisie</Button>
          </div>
          <div className="mt-4">
            <Toggle checked={hardcore} onChange={setHardcore} label="Mode hardcore (réponse exacte uniquement en saisie)" />
          </div>
        </div>

        <div>
          <Button onClick={start} disabled={count === 0}>Start</Button>
        </div>
      </div>
    </div>
  );
}

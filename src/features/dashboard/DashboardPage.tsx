import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/ui/Button';
import { loadDemoSeed } from '@/core/storage/seed';
import { countCards, countCardsAddedSince, listCards } from '@/core/storage/repo/cardsRepo';
import { countFolders } from '@/core/storage/repo/foldersRepo';
import { useToast } from '@/ui/Toast';
import { useFoldersStore } from '@/store/useFoldersStore';
import { dueToday } from '@/core/logic/quiz/due';
import { getSessionsToday } from '@/core/analytics/track';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [cards, setCards] = useState<number>(0);
  const [folders, setFolders] = useState<number>(0);
  const [added7d, setAdded7d] = useState<number>(0);
  const [sessionsToday, setSessionsToday] = useState<number>(0);
  const [duePreview, setDuePreview] = useState<{ count: number; list: Array<{ id: string; term: string; definition: string }> }>({ count: 0, list: [] });

  const toast = useToast();
  const foldersStore = useFoldersStore();
  const navigate = useNavigate();

  async function refreshCounts() {
    const [c, f, a] = await Promise.all([
      countCards(),
      countFolders(),
      countCardsAddedSince(7)
    ]);
    setCards(c);
    setFolders(f);
    setAdded7d(a);
    setSessionsToday(getSessionsToday());
  }

  async function refreshDue() {
    const all = await listCards();
    const d = dueToday(all, 6);
    setDuePreview({ count: d.count, list: d.list.map((x) => ({ id: x.id, term: x.term, definition: x.definition })) });
  }

  useEffect(() => {
    void refreshCounts();
    void refreshDue();

    function onDbChanged() {
      void refreshCounts();
      void refreshDue();
    }
    window.addEventListener('db:changed', onDbChanged as EventListener);
    return () => window.removeEventListener('db:changed', onDbChanged as EventListener);
  }, []);

  async function onSeed() {
    const res = await loadDemoSeed();
    await Promise.all([refreshCounts(), refreshDue(), foldersStore.load()]);
    toast.show({
      title: res.created ? 'Exemples chargés' : 'État inchangé',
      description: res.message
    });
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button variant="outline" onClick={() => navigate('/quiz')}>Lancer un quiz rapide</Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
        <div className="card p-4">
          <div className="text-sm text-[var(--muted)]">Cartes totales</div>
          <div className="text-2xl font-semibold">{cards}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-[var(--muted)]">Cartes ajoutées (7j)</div>
          <div className="text-2xl font-semibold">{added7d}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-[var(--muted)]">Sessions aujourd’hui</div>
          <div className="text-2xl font-semibold">{sessionsToday}</div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="card p-4 md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-[var(--muted)]">Aujourd’hui à réviser (heuristique)</div>
            <div className="text-sm text-[var(--muted)]">{duePreview.count} carte(s)</div>
          </div>
          {duePreview.list.length === 0 ? (
            <div className="text-[var(--muted)]">Rien à réviser pour le moment.</div>
          ) : (
            <ul className="space-y-2">
              {duePreview.list.map((c) => (
                <li key={c.id} className="flex items-center justify-between border border-[var(--border)] rounded-2xl px-3 py-2">
                  <span className="truncate mr-2">{c.term}</span>
                  <span className="text-[var(--muted)] truncate">{c.definition}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-[var(--muted)]">Données d’exemple</div>
            <div className="text-base">Charger 3 dossiers + 12 cartes</div>
          </div>
          <Button onClick={onSeed}>Charger exemples</Button>
        </div>
      </div>
    </div>
  );
}

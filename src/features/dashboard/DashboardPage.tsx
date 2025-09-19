import { useEffect, useState } from 'react';
import { Button } from '@/ui/Button';
import { loadDemoSeed } from '@/core/storage/seed';
import { countCards } from '@/core/storage/repo/cardsRepo';
import { countFolders } from '@/core/storage/repo/foldersRepo';
import { useToast } from '@/ui/Toast';

export default function DashboardPage() {
  const [cards, setCards] = useState<number>(0);
  const [folders, setFolders] = useState<number>(0);
  const toast = useToast();

  async function refreshCounts() {
    const [c, f] = await Promise.all([countCards(), countFolders()]);
    setCards(c);
    setFolders(f);
  }

  useEffect(() => {
    void refreshCounts();
  }, []);

  async function onSeed() {
    const res = await loadDemoSeed();
    await refreshCounts();
    toast.show({
      title: res.created ? 'Exemples chargés' : 'Déjà initialisé',
      description: res.created
        ? '3 dossiers + 12 cartes ajoutés.'
        : 'Des dossiers/cartes existent déjà.'
    });
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
        <div className="card p-4">
          <div className="text-sm text-[var(--muted)]">Cartes totales</div>
          <div className="text-2xl font-semibold">{cards}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-[var(--muted)]">Dossiers</div>
          <div className="text-2xl font-semibold">{folders}</div>
        </div>
        <div className="card p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-[var(--muted)]">Données d’exemple</div>
            <div className="text-base">Charger 3 dossiers + 12 cartes</div>
          </div>
          <Button onClick={onSeed}>Charger exemples</Button>
        </div>
      </div>

      <div className="text-[var(--muted)]">
        MVP prêt. Les tuiles KPI et “Aujourd’hui” arriveront au Lot 6.
      </div>
    </div>
  );
}

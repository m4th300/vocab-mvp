import type { Card } from '@/core/models/card';

/** Retourne 1 bonne réponse + 3 distracteurs (sans doublon) */
export function generateOptions(
  current: Card,
  pool: Card[],
  mode: 'term->def' | 'def->term'
): Array<{ label: string; correct: boolean }> {
  const candidates = pool.filter(c => c.id !== current.id);
  shuffleInPlace(candidates);

  const correctLabel = mode === 'term->def' ? current.definition : current.term;
  const getLabel = (c: Card) => (mode === 'term->def' ? c.definition : c.term);

  const options = new Set<string>();
  const result: Array<{ label: string; correct: boolean }> = [
    { label: correctLabel, correct: true }
  ];
  options.add(correctLabel);

  for (const c of candidates) {
    const label = getLabel(c);
    if (!options.has(label)) {
      result.push({ label, correct: false });
      options.add(label);
      if (result.length === 4) break;
    }
  }

  // si pool trop petit, compléter aléatoirement avec variations simples
  while (result.length < 4) {
    const filler = correctLabel + ' ';
    if (!options.has(filler)) {
      result.push({ label: filler, correct: false });
      options.add(filler);
    }
  }

  return shuffle(result);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

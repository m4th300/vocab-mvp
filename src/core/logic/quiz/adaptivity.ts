import type { Card } from '@/core/models/card';

/**
 * Renvoie un ordre de cartes pour la session :
 * - cartes “faibles” reviennent plus tôt (wrong/almost)
 * - cartes correctes plusieurs fois sont espacées
 */
export function scheduleSession(cards: Card[]): Card[] {
  const pool = [...cards];
  pool.sort((a, b) => score(a) - score(b));
  return pool;
}

function score(c: Card): number {
  const streak = c.stats?.correctStreak ?? 0;
  const last = c.stats?.lastResult ?? 'wrong';
  let s = 0;
  if (last === 'wrong') s -= 2;
  if (last === 'almost') s -= 1;
  s += streak; // plus le streak est élevé, plus on pousse vers la fin
  return s;
}

import type { Card } from '@/core/models/card';

/**
 * Heuristique simple avant SRS :
 * - due si jamais vue
 * - ou vue il y a > 3 jours et streak < 2
 * - ou dernier résultat "wrong" / "almost"
 */
export function dueToday(cards: Card[], limit = 20) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const scored = cards.map((c) => {
    const lastSeen = c.stats?.lastSeenAt ? Date.parse(c.stats.lastSeenAt) : 0;
    const daysSince = lastSeen ? (now - lastSeen) / day : Infinity;
    const streak = c.stats?.correctStreak ?? 0;
    const last = c.stats?.lastResult ?? 'wrong';

    // score : plus petit = plus prioritaire
    let s = 0;
    if (!lastSeen) s -= 3;             // jamais vue : urgent
    if (daysSince > 3 && streak < 2) s -= 2;
    if (last === 'wrong') s -= 2;
    if (last === 'almost') s -= 1;

    return { card: c, score: s, daysSince, streak };
  });

  const list = scored
    .sort((a, b) => a.score - b.score)
    .filter((x) => x.score < 0) // réellement “à revoir”
    .slice(0, limit)
    .map((x) => x.card);

  return { count: list.length, list };
}

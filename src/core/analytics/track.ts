// Abstraction simple pour tracer des événements (no-op extensible)
type EventName = 'quiz_started' | 'quiz_finished';
type Payload = Record<string, unknown>;

export function track(event: EventName, payload?: Payload) {
  try {
    // Console pour debug local
    // eslint-disable-next-line no-console
    console.log('[track]', event, payload ?? {});
    if (event === 'quiz_finished') {
      const k = 'quiz_sessions';
      const arr: Array<{ d: string }> = JSON.parse(localStorage.getItem(k) || '[]');
      arr.push({ d: new Date().toISOString() });
      localStorage.setItem(k, JSON.stringify(arr));
      // émet aussi db:changed pour rafraîchir KPI (réutilisation du canal)
      window.dispatchEvent(new CustomEvent('db:changed'));
    }
  } catch { /* ignore */ }
}

export function getSessionsToday(): number {
  try {
    const k = 'quiz_sessions';
    const arr: Array<{ d: string }> = JSON.parse(localStorage.getItem(k) || '[]');
    const today = new Date().toDateString();
    return arr.filter((s) => new Date(s.d).toDateString() === today).length;
  } catch { return 0; }
}

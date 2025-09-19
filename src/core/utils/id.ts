// Générateur d'IDs courts lisibles (base36)
export function newId(prefix = ''): string {
  const r = Math.random().toString(36).slice(2, 8);
  const t = Date.now().toString(36).slice(-4);
  return `${prefix}${r}${t}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

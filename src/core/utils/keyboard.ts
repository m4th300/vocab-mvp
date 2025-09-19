/** Retourne true si l’événement provient d’un champ éditable (à ignorer pour nos raccourcis) */
export function isFromEditable(e: KeyboardEvent | React.KeyboardEvent): boolean {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName?.toLowerCase();
  const editable = (t as HTMLElement).isContentEditable;
  return editable || tag === 'input' || tag === 'textarea' || tag === 'select';
}

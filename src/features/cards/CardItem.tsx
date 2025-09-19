import type { Card } from '@/core/models/card';
import { Button } from '@/ui/Button';

export function CardItem({
  card,
  onEdit,
  onDelete
}: {
  card: Card;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-[var(--border)]">
      <td className="px-3 py-2">{card.term}</td>
      <td className="px-3 py-2 text-[var(--muted)]">{card.definition}</td>
      <td className="px-3 py-2 whitespace-nowrap text-sm">
        {new Date(card.updatedAt).toLocaleDateString()}
      </td>
      <td className="px-3 py-2 text-right">
        <Button variant="ghost" size="sm" onClick={onEdit}>Éditer</Button>
        <Button variant="outline" size="sm" onClick={onDelete}>Supprimer</Button>
      </td>
    </tr>
  );
}

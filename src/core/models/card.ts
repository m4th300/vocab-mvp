export type CardId = string;

export interface Card {
  id: CardId;
  term: string;        // recto
  definition: string;  // verso
  folderId: string;
  tagIds?: string[];
  createdAt: string;   // ISO
  updatedAt: string;   // ISO
  stats?: {
    correctStreak: number;
    lastSeenAt?: string;
    lastResult?: 'correct' | 'almost' | 'wrong';
  };
}

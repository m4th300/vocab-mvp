export function FeedbackToast({ state }: { state: 'correct' | 'almost' | 'wrong' | null }) {
  if (!state) return null;
  const map: Record<NonNullable<typeof state>, string> = {
    correct: '✅ Correct',
    almost: '🟡 Presque juste',
    wrong: '❌ Incorrect'
  };
  return (
    <div className="text-sm text-[var(--muted)]">{map[state]}</div>
  );
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / Math.max(1, max)) * 100);
  return (
    <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
      <div
        className="h-full bg-[var(--accent)]"
        style={{ width: `${pct}%` }}
        aria-valuenow={value}
        aria-valuemax={max}
        role="progressbar"
      />
    </div>
  );
}

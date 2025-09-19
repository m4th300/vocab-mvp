import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from './lib';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, label, error, id, ...props },
  ref
) {
  const input = (
    <input
      id={id}
      ref={ref}
      className={cn(
        'h-10 w-full rounded-2xl border bg-transparent px-3 text-[var(--fg)]',
        'border-[var(--border)] placeholder:text-[var(--muted)]',
        'focus-visible:outline-2 focus-visible:outline-[var(--ring)]',
        error && 'border-[var(--danger)]',
        className
      )}
      {...props}
    />
  );

  if (!label && !error) return input;

  return (
    <label className="block">
      {label && <div className="mb-1 text-sm text-[var(--muted)]">{label}</div>}
      {input}
      {error && (
        <div className="mt-1 text-xs" style={{ color: 'var(--danger)' }}>
          {error}
        </div>
      )}
    </label>
  );
});

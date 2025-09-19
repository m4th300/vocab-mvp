import { HTMLAttributes } from 'react';
import { cn } from './lib';

type Variant = 'neutral' | 'success' | 'warning' | 'danger';

const styles: Record<Variant, string> = {
  neutral: 'bg-[var(--border)]/60 text-[var(--fg)]',
  success: 'bg-[var(--ok)]/15 text-[var(--ok)]',
  warning: 'bg-[var(--warn)]/15 text-[var(--warn)]',
  danger: 'bg-[var(--danger)]/15 text-[var(--danger)]'
};

export function Badge({
  className,
  variant = 'neutral',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', styles[variant], className)}
      {...props}
    />
  );
}

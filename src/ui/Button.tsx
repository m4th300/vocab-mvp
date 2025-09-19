import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from './lib';

type Variant = 'default' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition-transform active:scale-[0.98] focus-visible:outline-2 whitespace-nowrap';

const variants: Record<Variant, string> = {
  default:
    'bg-[var(--accent)] text-white border-transparent hover:bg-[var(--accent-600)]',
  ghost:
    'bg-transparent text-[var(--fg)] border-transparent hover:bg-[var(--border)]/30',
  outline:
    'bg-transparent text-[var(--fg)] border-[var(--border)] hover:bg-[var(--border)]/30',
  danger:
    'bg-[var(--danger)] text-white border-transparent hover:opacity-90'
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3',
  md: 'h-10 px-4'
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = 'default', size = 'md', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});

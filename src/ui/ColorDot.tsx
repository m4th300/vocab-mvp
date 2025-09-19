import { HTMLAttributes } from 'react';
import { cn } from './lib';

export function ColorDot({
  color,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { color: string }) {
  return (
    <span
      className={cn('inline-block h-2.5 w-2.5 rounded-full border', className)}
      style={{ backgroundColor: color, borderColor: 'var(--border)' }}
      {...props}
    />
  );
}

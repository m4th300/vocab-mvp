import { cn } from './lib';

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  id?: string;
}

export function Toggle({ checked, onChange, label, id }: Props) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none" htmlFor={id}>
      <span className="relative inline-flex items-center">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className={cn(
            'h-6 w-11 rounded-full border transition-colors',
            checked ? 'bg-[var(--accent)] border-transparent' : 'bg-[var(--border)] border-[var(--border)]'
          )}
        />
        <span
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow',
            'transition-all',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </span>
      {label && <span className="text-sm text-[var(--fg)]">{label}</span>}
    </label>
  );
}

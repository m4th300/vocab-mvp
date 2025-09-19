import { createContext, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from './lib';

type Variant = 'default' | 'success' | 'warning' | 'danger';

export type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  variant?: Variant;
  duration?: number; // ms
};

type Ctx = {
  show: (t: Omit<ToastItem, 'id'>) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const api = useMemo<Ctx>(
    () => ({
      show: (t) => {
        const id = Math.random().toString(36).slice(2);
        const item: ToastItem = { id, duration: 3000, variant: 'default', ...t };
        setItems((s) => [...s, item]);
        setTimeout(() => {
          setItems((s) => s.filter((x) => x.id !== id));
        }, item.duration);
      }
    }),
    []
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}
      {createPortal(
        <div className="fixed top-3 right-3 z-50 flex flex-col gap-2">
          <AnimatePresence>
            {items.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                className={cn(
                  'card min-w-[260px] max-w-[360px] p-3 text-sm shadow-xl',
                  t.variant === 'success' && 'border-[var(--ok)]/40',
                  t.variant === 'warning' && 'border-[var(--warn)]/40',
                  t.variant === 'danger' && 'border-[var(--danger)]/40'
                )}
              >
                {t.title && <div className="font-medium mb-0.5">{t.title}</div>}
                {t.description && <div className="text-[var(--muted)]">{t.description}</div>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  );
}

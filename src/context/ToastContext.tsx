import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Toast {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastCtx {
  showToast: (t: Omit<Toast, "id">) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const showToast = useCallback((t: Omit<Toast, "id">) => {
    window.clearTimeout(timer.current);
    setToast({ ...t, id: Date.now() });
    timer.current = window.setTimeout(() => setToast(null), 5000);
  }, []);

  return (
    <Ctx.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex justify-center px-4" aria-live="polite">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex max-w-md items-center gap-4 rounded-lg border border-white/10 bg-ink-800/95 px-4 py-3 text-sm text-fg shadow-2xl backdrop-blur"
              role="status"
            >
              <span>{toast.message}</span>
              {toast.actionLabel && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onAction?.();
                    setToast(null);
                  }}
                  className="min-h-[36px] shrink-0 rounded-md px-3 font-semibold text-accent-2 hover:bg-white/5"
                >
                  {toast.actionLabel}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useToast must be used inside ToastProvider");
  return c;
}

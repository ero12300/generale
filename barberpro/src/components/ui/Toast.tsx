"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/format";

type ToastKind = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
} as const;

const STYLES = {
  success: "border-emerald-500/40 text-emerald-300",
  error: "border-red-500/40 text-red-300",
  info: "border-gold/40 text-gold-soft",
} as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, kind: ToastKind = "info") => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => setItems((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2">
        {items.map((t) => {
          const Icon = ICONS[t.kind];
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-xl border bg-ink-card/95 px-4 py-3 text-sm shadow-card backdrop-blur animate-fade-up",
                STYLES[t.kind],
              )}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="flex-1 text-cream/90">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-cream/40 transition hover:text-cream"
                aria-label="Chiudi notifica"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve essere usato dentro <ToastProvider>");
  return ctx;
}

"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";
export type ToastPayload = {
  id?: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastInternal = Required<Omit<ToastPayload, "description">> & {
  description?: string;
};

const EVENT = "barberpro:toast";

/** Emette un toast da qualsiasi componente client. */
export function toast(payload: ToastPayload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: payload }));
}

/** Hook comodo che ritorna la funzione toast. */
export function useToast() {
  return { toast };
}

/**
 * Componente da montare una sola volta nel root layout.
 * Ascolta gli eventi globali e mostra le notifiche.
 */
export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastInternal[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastPayload>).detail;
      const id = detail.id ?? Math.random().toString(36).slice(2);
      const item: ToastInternal = {
        id,
        title: detail.title,
        description: detail.description,
        variant: detail.variant ?? "info",
      };
      setToasts((prev) => [...prev, item]);
      window.setTimeout(() => dismiss(id), 4200);
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, [dismiss]);

  return (
    <div
      role="region"
      aria-label="Notifiche"
      className="fixed top-6 right-6 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            "glass-strong rounded-lg p-4 pr-10 relative shadow-[var(--shadow-card)] animate-fade-up pointer-events-auto",
            t.variant === "success" && "border-emerald-500/40",
            t.variant === "error" && "border-red-500/40",
            t.variant === "info" && "border-[color:var(--color-gold-500)]/40"
          )}
        >
          <div className="flex gap-3">
            <div className="mt-0.5">
              {t.variant === "success" && (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              )}
              {t.variant === "error" && (
                <AlertTriangle className="h-5 w-5 text-red-400" />
              )}
              {t.variant === "info" && (
                <Info className="h-5 w-5 text-[color:var(--color-gold-400)]" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-ink-50">{t.title}</div>
              {t.description && (
                <div className="text-xs text-ink-400 mt-0.5">
                  {t.description}
                </div>
              )}
            </div>
          </div>
          <button
            aria-label="Chiudi notifica"
            className="absolute top-3 right-3 text-ink-400 hover:text-ink-100"
            onClick={() => dismiss(t.id)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

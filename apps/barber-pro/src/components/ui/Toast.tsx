"use client";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error" | "info" | "warning";
interface ToastItem {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
}

interface ToastCtx {
  push: (t: Omit<ToastItem, "id">) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [...prev, { id, ...t }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 4000);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto glass rounded-xl p-4 flex gap-3 items-start shadow-2xl",
              t.kind === "success" && "border-emerald-500/30",
              t.kind === "error" && "border-rose-500/30",
              t.kind === "warning" && "border-amber-500/30",
            )}
          >
            <span className="mt-0.5">
              {t.kind === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {t.kind === "error" && <XCircle className="w-5 h-5 text-rose-400" />}
              {t.kind === "warning" && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {t.kind === "info" && <Info className="w-5 h-5 text-gold-400" />}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-ink-100">{t.title}</div>
              {t.description ? (
                <div className="text-xs text-ink-400 mt-0.5">{t.description}</div>
              ) : null}
            </div>
            <button
              onClick={() => setItems((prev) => prev.filter((i) => i.id !== t.id))}
              className="text-ink-400 hover:text-ink-100"
              aria-label="Chiudi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be inside <ToastProvider>");
  return ctx;
}

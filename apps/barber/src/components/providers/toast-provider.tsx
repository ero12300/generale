"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = "success" | "error" | "info";
interface Toast {
  id: number;
  kind: Kind;
  title: string;
  description?: string;
}

interface Ctx {
  push(t: Omit<Toast, "id">): void;
  success(title: string, description?: string): void;
  error(title: string, description?: string): void;
  info(title: string, description?: string): void;
}

const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const ctx = useMemo<Ctx>(
    () => ({
      push,
      success: (title, description) => push({ kind: "success", title, description }),
      error: (title, description) => push({ kind: "error", title, description }),
      info: (title, description) => push({ kind: "info", title, description }),
    }),
    [push],
  );

  return (
    <ToastCtx.Provider value={ctx}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[70] flex flex-col items-center gap-2 px-4 sm:top-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto glass-strong flex w-full max-w-md items-start gap-3 rounded-xl px-4 py-3 text-sm shadow-2xl animate-in",
              t.kind === "success" && "border-emerald-500/30",
              t.kind === "error" && "border-rose-500/30",
              t.kind === "info" && "border-[color:var(--color-gold-300)]/30",
            )}
          >
            <div className="mt-0.5">
              {t.kind === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              {t.kind === "error" && <AlertCircle className="h-4 w-4 text-rose-400" />}
              {t.kind === "info" && <Info className="h-4 w-4 text-[color:var(--color-gold-300)]" />}
            </div>
            <div className="flex-1">
              <div className="font-medium text-white">{t.title}</div>
              {t.description && <div className="mt-0.5 text-white/70">{t.description}</div>}
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="text-white/50 hover:text-white/90"
              aria-label="Chiudi notifica"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast(): Ctx {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

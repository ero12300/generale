"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card w-full max-w-lg animate-fade-up rounded-b-none sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-ink-line px-6 py-4">
          <div>
            <h2 className="font-display text-xl text-cream">{title}</h2>
            {description ? <p className="mt-0.5 text-sm text-cream/50">{description}</p> : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-cream/50 transition hover:bg-ink-line hover:text-cream"
            aria-label="Chiudi"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-3 border-t border-ink-line px-6 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/components/ui/cn";

interface WizardShellProps {
  children: React.ReactNode;
  onBack?: () => void;
  backHref?: string;
  showBack?: boolean;
  title?: string;
  footer?: React.ReactNode;
}

export function WizardShell({
  children,
  onBack,
  backHref,
  showBack = true,
  title,
  footer,
}: WizardShellProps) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col bg-canvas">
      <header className="safe-top sticky top-0 z-10 flex items-center gap-3 bg-canvas/90 px-4 py-3 backdrop-blur-md">
        {showBack ? (
          onBack ? (
            <button
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink-soft transition-colors hover:text-ink"
              aria-label="Indietro"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href={backHref ?? "/"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink-soft transition-colors hover:text-ink"
              aria-label="Indietro"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )
        ) : null}
        <div className="flex-1 text-center text-sm font-medium text-ink-soft">{title}</div>
        <div className="w-10" />
      </header>
      <main className="flex-1 px-4 pb-32 pt-2">{children}</main>
      {footer ? (
        <footer
          className={cn(
            "safe-bottom sticky bottom-0 z-10 border-t border-line bg-white/95 px-4 py-3 backdrop-blur-md"
          )}
        >
          {footer}
        </footer>
      ) : null}
    </div>
  );
}

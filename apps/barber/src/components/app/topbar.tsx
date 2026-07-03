"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar({ title, subtitle, action, onOpenNav }: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  onOpenNav?: () => void;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 border-b border-white/5 pb-5 md:mb-8">
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenNav} aria-label="Apri menu">
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-2xl text-white md:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-white/60">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "./cn";

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
}

export function ToggleRow({ label, description, checked, onChange, icon }: ToggleRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all touch-manipulation",
        checked
          ? "border-wood bg-wood/10"
          : "border-line bg-white hover:border-ink/30"
      )}
    >
      {icon ? (
        <div className={cn("shrink-0", checked ? "text-wood" : "text-ink-muted")}>{icon}</div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-ink">{label}</div>
        {description ? (
          <div className="mt-0.5 text-xs text-ink-muted">{description}</div>
        ) : null}
      </div>
      <div
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-wood" : "bg-line"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </div>
    </button>
  );
}

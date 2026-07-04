"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Props {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  id?: string;
  className?: string;
}

export function Switch({ checked, onCheckedChange, label, description, id, className }: Props) {
  const generatedId = React.useId();
  const switchId = id ?? generatedId;
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4",
        className,
      )}
    >
      <div className="flex-1">
        <label htmlFor={switchId} className="cursor-pointer text-sm font-medium text-slate-100">
          {label}
        </label>
        {description && (
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">{description}</p>
        )}
      </div>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
          checked ? "bg-brand-500" : "bg-slate-700",
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}

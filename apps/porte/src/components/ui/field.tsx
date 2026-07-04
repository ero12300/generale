import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-slate-200 mb-1.5 block tracking-wide",
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full h-12 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2",
        "text-slate-100 placeholder-slate-500 shadow-inner shadow-black/20",
        "focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full h-12 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2",
        "text-slate-100 shadow-inner shadow-black/20",
        "focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30",
        "appearance-none pr-10 bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem]",
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5",
        "text-slate-100 placeholder-slate-500 shadow-inner shadow-black/20",
        "focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30",
        "resize-none",
        className,
      )}
      {...props}
    />
  );
}

export function HelperText({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "warning" | "error" | "success";
}) {
  const tones = {
    default: "text-slate-400",
    warning: "text-amber-300",
    error: "text-red-400",
    success: "text-emerald-400",
  } as const;
  return <p className={cn("mt-1.5 text-xs leading-relaxed", tones[tone])}>{children}</p>;
}

import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white",
        "placeholder:text-white/40 focus:outline-none focus:border-[color:var(--color-gold-300)]/60 focus:ring-2 focus:ring-[color:var(--color-gold-300)]/20 transition",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white",
        "placeholder:text-white/40 focus:outline-none focus:border-[color:var(--color-gold-300)]/60 focus:ring-2 focus:ring-[color:var(--color-gold-300)]/20 transition",
        "disabled:cursor-not-allowed disabled:opacity-60 min-h-[88px] resize-y",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60", className)} {...props} />;
}

import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-11 w-full rounded-md border border-white/10 bg-black/30 px-4 py-2 text-sm text-ink-100",
      "placeholder:text-ink-500 outline-none",
      "focus:border-[color:var(--color-gold-500)]/60 focus:ring-2 focus:ring-[color:var(--color-gold-500)]/30 focus:ring-offset-0",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "transition-all",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[100px] w-full rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm text-ink-100 resize-y",
      "placeholder:text-ink-500 outline-none",
      "focus:border-[color:var(--color-gold-500)]/60 focus:ring-2 focus:ring-[color:var(--color-gold-500)]/30",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Input, Textarea };

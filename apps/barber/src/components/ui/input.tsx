import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-ink-50 placeholder:text-ink-400 transition-colors",
          "focus:outline-none focus:border-gold-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-gold-400/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-ink-50 placeholder:text-ink-400 transition-colors",
        "focus:outline-none focus:border-gold-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-gold-400/20",
        "disabled:cursor-not-allowed disabled:opacity-50 resize-y",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-xs uppercase tracking-widest text-ink-300 font-medium mb-1.5 block", className)}
      {...props}
    >
      {children}
    </label>
  );
}

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const baseField =
  "w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-ink-100 placeholder:text-ink-500 focus:border-[color:var(--color-gold-500)]/60 focus:ring-2 focus:ring-[color:var(--color-gold-500)]/20 outline-none transition";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...rest }, ref) => <input ref={ref} className={cn(baseField, className)} {...rest} />,
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...rest }, ref) => (
    <textarea ref={ref} className={cn(baseField, "h-auto min-h-[80px] py-2", className)} {...rest} />
  ),
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...rest }, ref) => (
    <select ref={ref} className={cn(baseField, "pr-8 appearance-none", className)} {...rest}>
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block space-y-1.5">
      <div className="text-xs uppercase tracking-wider text-ink-400">{label}</div>
      {children}
      {hint && !error ? <div className="text-xs text-ink-500">{hint}</div> : null}
      {error ? <div className="text-xs text-rose-400">{error}</div> : null}
    </label>
  );
}

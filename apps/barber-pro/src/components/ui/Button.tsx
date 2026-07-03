import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-gold-500)]";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-[#e5cd8b] via-[#d9b968] to-[#a8853a] text-ink-950 shadow-lg shadow-black/30 hover:brightness-110 hover:-translate-y-px active:translate-y-0",
  secondary:
    "bg-white/[0.06] text-ink-100 border border-white/10 hover:bg-white/[0.10]",
  ghost: "text-ink-300 hover:text-ink-50 hover:bg-white/[0.05]",
  outline:
    "border border-[color:var(--color-gold-500)]/50 text-[color:var(--color-gold-400)] hover:bg-[color:var(--color-gold-500)]/10",
  danger: "bg-rose-500/90 text-white hover:bg-rose-500",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...rest}
      >
        {loading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

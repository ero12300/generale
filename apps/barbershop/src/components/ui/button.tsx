import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "gold" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", loading, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variants = {
      default: "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--accent)]",
      outline: "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[var(--accent)]",
      ghost: "bg-transparent text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]",
      destructive: "bg-red-900/20 text-red-400 border border-red-900/40 hover:bg-red-900/40",
      gold: "bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary)] text-[var(--background)] font-semibold hover:from-[var(--primary)] hover:to-[var(--primary-light)] shadow-lg shadow-[var(--primary)]/20",
      link: "bg-transparent text-[var(--primary)] hover:underline p-0 h-auto",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

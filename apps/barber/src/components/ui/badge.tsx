import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-white/5 border-white/10 text-ink-200",
        gold: "bg-[color:var(--color-gold-500)]/15 border-[color:var(--color-gold-500)]/40 text-[color:var(--color-gold-300)]",
        success:
          "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
        warning:
          "bg-amber-500/10 border-amber-500/30 text-amber-200",
        danger:
          "bg-red-500/10 border-red-500/30 text-red-300",
        info: "bg-sky-500/10 border-sky-500/30 text-sky-200",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors",
  {
    variants: {
      variant: {
        default: "bg-white/5 border-white/10 text-ink-200",
        gold: "bg-gold-400/10 border-gold-400/30 text-gold-200",
        emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
        rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
        blue: "bg-blue-500/10 border-blue-500/30 text-blue-300",
        muted: "bg-white/[0.03] border-white/[0.06] text-ink-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-zinc-800 text-zinc-200 border border-zinc-700",
        ottimo: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
        buono: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
        attenzione: "bg-amber-400/15 text-amber-300 border border-amber-400/30",
        critico: "bg-red-500/15 text-red-300 border border-red-500/30",
        gold: "bg-amber-400/15 text-amber-300 border border-amber-400/30",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

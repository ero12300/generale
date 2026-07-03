import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
        neutral: "bg-zinc-800 text-zinc-300 border border-zinc-700",
        success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
        warning: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",
        danger: "bg-red-500/15 text-red-300 border border-red-500/30",
        info: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

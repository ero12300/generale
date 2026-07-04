import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-amber-600/50 bg-amber-600/20 text-amber-300",
        secondary: "border-zinc-700 bg-zinc-800 text-zinc-300",
        success: "border-emerald-600/50 bg-emerald-600/20 text-emerald-300",
        warning: "border-amber-500/50 bg-amber-500/20 text-amber-200",
        danger: "border-red-600/50 bg-red-600/20 text-red-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

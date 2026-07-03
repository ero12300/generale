"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold-300)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-ink-950)]",
  {
    variants: {
      variant: {
        gold: "btn-gold",
        outline:
          "border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-[color:var(--color-gold-300)]/40",
        ghost:
          "text-white/80 hover:bg-white/10 hover:text-white",
        subtle:
          "bg-white/5 text-white hover:bg-white/10",
        danger:
          "bg-rose-500/10 text-rose-300 border border-rose-500/25 hover:bg-rose-500/20",
        link: "text-[color:var(--color-gold-200)] hover:text-[color:var(--color-gold-100)] rounded-none px-0",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };

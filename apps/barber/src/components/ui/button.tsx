"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-gold-300 to-gold-500 text-ink-950 hover:brightness-110 shadow-[0_10px_30px_-10px_rgba(212,167,44,0.6),inset_0_1px_0_rgba(255,255,255,0.4)] active:scale-[0.98]",
        secondary:
          "bg-white/5 text-ink-100 border border-white/10 hover:bg-white/10 hover:border-white/20",
        ghost:
          "text-ink-200 hover:bg-white/5 hover:text-ink-50",
        outline:
          "border border-gold-400/40 text-gold-200 hover:bg-gold-400/10 hover:border-gold-300/60",
        danger:
          "bg-rose-500/90 text-white hover:bg-rose-500 border border-rose-400/50",
        link:
          "text-gold-300 hover:text-gold-200 underline underline-offset-4 hover:decoration-gold-300 h-auto p-0",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

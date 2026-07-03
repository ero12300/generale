import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-br from-[color:var(--color-gold-400)] via-[color:var(--color-gold-500)] to-[color:var(--color-gold-500)] text-ink-950 hover:brightness-110 hover:shadow-[0_0_30px_-8px_rgba(201,162,75,0.6)] active:scale-[0.98]",
        secondary:
          "bg-white/5 text-ink-100 border border-white/10 hover:bg-white/10 hover:border-[color:var(--color-gold-500)]/40",
        ghost:
          "text-ink-200 hover:bg-white/5 hover:text-ink-50",
        outline:
          "border border-[color:var(--color-gold-500)]/40 text-[color:var(--color-gold-300)] hover:bg-[color:var(--color-gold-500)]/10",
        destructive:
          "bg-red-500/90 text-white hover:bg-red-500 active:scale-[0.98]",
        link: "text-[color:var(--color-gold-300)] underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-md",
        md: "h-10 px-4 text-sm rounded-md",
        lg: "h-12 px-6 text-base rounded-md",
        xl: "h-14 px-8 text-base rounded-lg",
        icon: "h-10 w-10 rounded-md",
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

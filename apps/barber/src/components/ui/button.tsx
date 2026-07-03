import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(212,175,55)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'gold-gradient text-[rgb(10,10,10)] shadow font-semibold hover:brightness-110 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]',
        destructive:
          'bg-red-600 text-white hover:bg-red-700',
        outline:
          'border border-[rgba(212,175,55,0.4)] bg-transparent text-[rgb(212,175,55)] hover:bg-[rgba(212,175,55,0.1)] hover:border-[rgb(212,175,55)]',
        secondary:
          'bg-[rgb(28,28,28)] text-[rgb(250,245,235)] hover:bg-[rgb(38,38,38)]',
        ghost:
          'text-[rgb(140,130,110)] hover:text-[rgb(250,245,235)] hover:bg-[rgba(255,255,255,0.05)]',
        link:
          'text-[rgb(212,175,55)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-xs rounded-md',
        lg: 'h-12 px-8 text-base rounded-xl',
        xl: 'h-14 px-10 text-lg rounded-xl',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

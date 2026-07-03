import * as React from 'react'
import { cn } from '@/lib/utils'

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' | 'outline' | 'gold' }
>(({ className, variant = 'default', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        {
          'bg-[rgba(212,175,55,0.15)] text-[rgb(212,175,55)] border border-[rgba(212,175,55,0.3)]':
            variant === 'default' || variant === 'gold',
          'bg-[rgba(255,255,255,0.08)] text-[rgb(140,130,110)]': variant === 'secondary',
          'border border-[rgba(212,175,55,0.3)] text-[rgb(212,175,55)] bg-transparent':
            variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = 'Badge'

export { Badge }

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-lg font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus:ring-4 focus:ring-accent focus:bg-accent focus:text-foreground focus:border-accent cursor-pointer",
  {
    variants: {
      variant: {
        default: 'bg-primary text-white border-b-3 border-[#002d18] hover:bg-[#005a30] active:translate-y-0.5 active:border-b-0',
        destructive:
          'bg-destructive text-white border-b-2 border-[#6d1c0f] hover:bg-[#a32916]',
        outline:
          'border-2 border-govuk-black bg-white hover:bg-govuk-grey-3',
        secondary:
          'bg-govuk-grey-3 text-govuk-black border-b-2 border-govuk-grey-1 hover:bg-govuk-grey-2',
        ghost:
          'hover:bg-govuk-grey-3',
        link: 'text-govuk-blue underline hover:text-[#003078] p-0 h-auto font-normal',
      },
      size: {
        default: 'h-12 px-6 py-2',
        sm: 'h-10 px-4 text-base',
        lg: 'h-14 px-8 text-xl',
        icon: 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

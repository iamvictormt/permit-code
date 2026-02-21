import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-10 w-full min-w-0 border-2 border-govuk-black bg-white px-2 py-1 text-lg outline-none transition-all',
        'focus:ring-4 focus:ring-accent focus:border-govuk-black',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-govuk-grey-3',
        'aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_4px_var(--destructive)]',
        className,
      )}
      {...props}
    />
  )
}

export { Input }

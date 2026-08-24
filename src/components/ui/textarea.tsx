import * as React from 'react'

import { cn } from '@/utilities/cn'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-check text-ink placeholder:text-ink-muted text-ui-sm focus-visible:border-blue-brand aria-invalid:border-error flex field-sizing-content min-h-24 w-full rounded-none border bg-transparent px-3.5 py-3 font-medium outline-none transition-colors duration-[120ms] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }

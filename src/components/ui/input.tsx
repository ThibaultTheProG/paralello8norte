import * as React from 'react'

import { cn } from '@/utilities/cn'

/**
 * Champ de saisie du système : rayon 0, filet de 1px, aucune ombre.
 * Reprend la géométrie de `components/p8/Field.tsx` pour que les formulaires
 * du template (compte, adresses, auth) soient homogènes avec le boletín.
 */
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-check text-ink placeholder:text-ink-muted text-ui-sm w-full min-w-0 rounded-none border bg-transparent px-3.5 py-3 font-medium outline-none transition-colors duration-[120ms]',
        'focus-visible:border-blue-brand focus-visible:ring-0 focus-visible:ring-offset-0',
        'disabled:text-ink-disabled disabled:border-hairline disabled:cursor-not-allowed',
        'aria-invalid:border-error',
        className,
      )}
      {...props}
    />
  )
}

export { Input }

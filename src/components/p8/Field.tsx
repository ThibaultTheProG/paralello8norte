'use client'

import { cn } from '@/utilities/cn'
import React from 'react'

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  /** Libellé du bouton accolé. Ce bouton est TOUJOURS noir encre. */
  button?: string
  className?: string
  label?: string
  onAccent?: boolean
}

/**
 * Le champ de saisie du système, avec bouton accolé optionnel.
 *
 * Le bouton est noir encre et jamais bleu : le bleu est réservé à l'action
 * d'achat, et un bouton de boletín bleu lui ferait concurrence.
 */
export const Field: React.FC<Props> = ({ button, className, label, onAccent, ...rest }) => (
  <div className={cn('flex flex-col gap-2', className)}>
    {label && (
      <span className={cn('text-meta font-bold', onAccent ? 'text-white' : 'text-ink')}>
        {label}
      </span>
    )}
    <div className="flex">
      <input
        className={cn(
          'text-ui-sm flex-1 bg-transparent px-3.5 py-3 font-medium outline-none',
          onAccent
            ? 'border-white/30 text-white placeholder:text-white/60'
            : 'border-check text-ink placeholder:text-ink-muted',
          button ? 'border border-r-0' : 'border',
        )}
        {...rest}
      />
      {button && (
        <button
          className="text-meta bg-ink cursor-pointer border-none px-[22px] font-extrabold tracking-[1px] text-white"
          type="submit"
        >
          {button}
        </button>
      )}
    </div>
  </div>
)

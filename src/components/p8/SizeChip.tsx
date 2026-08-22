import { cn } from '@/utilities/cn'
import React from 'react'

type Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: string
  selected?: boolean
}

/**
 * Sélecteur de taille (fiche produit et filtres du catalogue).
 * Sélection = aplat encre plein ; indisponible = gris désactivé, jamais barré.
 */
export const SizeChip: React.FC<Props> = ({ className, disabled, label, selected, ...rest }) => (
  <button
    className={cn(
      'text-ui-sm w-11 border px-0 py-2.5 text-center font-bold transition-colors duration-[120ms]',
      selected
        ? 'border-ink bg-ink text-white'
        : disabled
          ? 'border-control text-ink-disabled cursor-default'
          : 'border-control text-ink hover:border-ink',
      className,
    )}
    disabled={disabled}
    type="button"
    {...rest}
  >
    {label}
  </button>
)

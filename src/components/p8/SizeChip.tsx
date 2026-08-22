import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'
import React from 'react'

type Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** Renseigné, la pastille devient un lien : c'est la forme utilisée par les filtres du catalogue. */
  href?: string
  label: string
  selected?: boolean
}

/**
 * Sélecteur de taille (fiche produit et filtres du catalogue).
 * Sélection = aplat encre plein ; indisponible = gris désactivé, jamais barré.
 */
export const SizeChip: React.FC<Props> = ({
  className,
  disabled,
  href,
  label,
  selected,
  ...rest
}) => {
  const classes = cn(
    'text-ui-sm inline-block w-11 border px-0 py-2.5 text-center font-bold transition-colors duration-[120ms]',
    selected
      ? 'border-ink bg-ink text-white'
      : disabled
        ? 'border-control text-ink-disabled cursor-default'
        : 'border-control text-ink hover:border-ink',
    className,
  )

  if (href && !disabled) {
    return (
      <Link aria-current={selected ? 'true' : undefined} className={classes} href={href}>
        {label}
      </Link>
    )
  }

  return (
    <button className={classes} disabled={disabled} type="button" {...rest}>
      {label}
    </button>
  )
}

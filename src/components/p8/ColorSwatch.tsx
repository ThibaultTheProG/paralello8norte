import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'
import React from 'react'

type Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & {
  color: string
  /** Renseigné, la pastille devient un lien : c'est la forme utilisée par les filtres du catalogue. */
  href?: string
  name: string
  selected?: boolean
  /** 26px sur la fiche produit, 22px dans les filtres du catalogue. */
  size?: 22 | 26
}

/**
 * Pastille de couleur — l'une des deux seules exceptions au rayon 0 du système.
 * La sélection se marque par un anneau bleu de 2px décalé de 2px, jamais par une
 * coche.
 */
export const ColorSwatch: React.FC<Props> = ({
  className,
  color,
  href,
  name,
  selected,
  size = 26,
  ...rest
}) => {
  const classes = cn(
    'inline-block rounded-full border border-black/15',
    selected && 'outline-blue-brand outline-2 outline-offset-2',
    className,
  )
  const style = { backgroundColor: color, height: size, width: size }

  if (href) {
    return (
      <Link
        aria-label={name}
        aria-current={selected ? 'true' : undefined}
        className={classes}
        href={href}
        style={style}
        title={name}
      />
    )
  }

  return (
    <button
      aria-label={name}
      aria-pressed={selected}
      className={classes}
      style={style}
      title={name}
      type="button"
      {...rest}
    />
  )
}

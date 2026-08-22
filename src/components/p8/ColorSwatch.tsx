import { cn } from '@/utilities/cn'
import React from 'react'

type Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & {
  color: string
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
  name,
  selected,
  size = 26,
  ...rest
}) => (
  <button
    aria-label={name}
    aria-pressed={selected}
    className={cn(
      'inline-block rounded-full border border-black/15',
      selected && 'outline-blue-brand outline-2 outline-offset-2',
      className,
    )}
    style={{ backgroundColor: color, height: size, width: size }}
    title={name}
    type="button"
    {...rest}
  />
)

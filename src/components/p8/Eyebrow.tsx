import { cn } from '@/utilities/cn'
import React from 'react'

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  /** Le doré est la valeur par défaut ; le bleu sert aux rubriques du pied de page. */
  tone?: 'blue' | 'gold'
}

/**
 * Sur-titre en capitales interlettrées. Coiffe les noms de produit, les groupes
 * de filtres et les rubriques du pied de page.
 */
export const Eyebrow: React.FC<Props> = ({ children, className, tone = 'gold', ...rest }) => (
  <span
    className={cn(
      'text-eyebrow font-extrabold tracking-[2px] uppercase',
      tone === 'blue' ? 'text-blue-brand' : 'text-gold',
      className,
    )}
    {...rest}
  >
    {children}
  </span>
)

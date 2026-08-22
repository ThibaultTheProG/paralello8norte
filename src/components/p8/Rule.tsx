import { cn } from '@/utilities/cn'
import React from 'react'

/**
 * Le filet doré de 34×3px qui ouvre chaque bloc de page. C'est la signature du
 * système : le doré n'est jamais un aplat, seulement ce trait, les sur-titres et
 * les soulignements.
 */
export const Rule: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-gold mb-3 h-[3px] w-[34px]', className)} />
)

import { cn } from '@/utilities/cn'
import React from 'react'

type Props = {
  className?: string
  size?: 'default' | 'sm'
}

/**
 * Logotype typographique.
 *
 * Aucun fichier vectoriel n'a été fourni par la marque : le logo EST cette
 * composition. Cormorant Garamond n'est utilisé nulle part ailleurs sur le site.
 * Ne pas redessiner de marque.
 */
export const Wordmark: React.FC<Props> = ({ className, size = 'default' }) => (
  <span className={cn('flex flex-col gap-1 leading-none', className)}>
    <span
      className={cn(
        'text-navy font-serif tracking-[7px]',
        size === 'sm' ? 'text-[18px]' : 'text-[23px]',
      )}
    >
      PARALELO
    </span>
    <span className="text-gold text-[9px] font-extrabold tracking-[6px]">8 NORTE</span>
  </span>
)

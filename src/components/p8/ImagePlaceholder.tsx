import { cn } from '@/utilities/cn'
import React from 'react'

type Props = {
  className?: string
  /** Légende en capitales — décrit la photo attendue, pas le produit. */
  label?: string
  /** Variante `alt` pour le second visuel d'une vignette (état survol). */
  tone?: 'default' | 'alt' | 'dark'
}

/**
 * Réserve d'image.
 *
 * Aucune photo n'a été fournie par la marque : partout où une image manque, le
 * design system prescrit un aplat #E9F0F4 légendé en capitales 10px grises
 * plutôt qu'un visuel inventé. Ce composant est donc omniprésent tant que les
 * mockups Printful ne sont pas là — les remplacer se fera ici.
 */
export const ImagePlaceholder: React.FC<Props> = ({ className, label, tone = 'default' }) => (
  <div
    className={cn(
      'absolute inset-0 flex items-center justify-center p-3 text-center',
      tone === 'alt' && 'bg-mist-alt',
      tone === 'dark' && 'bg-[rgba(6,42,60,0.35)]',
      tone === 'default' && 'bg-mist',
      className,
    )}
  >
    {label && (
      <span
        className={cn(
          'text-eyebrow font-semibold tracking-[2px] uppercase',
          tone === 'dark' ? 'text-white/50' : 'text-ink-label',
        )}
      >
        {label}
      </span>
    )}
  </div>
)

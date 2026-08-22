import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * L'échelle typographique de la marque (`text-h2`, `text-ui`, `text-payment`…)
 * et sa palette (`text-gold`, `text-ink-body`…) partagent le préfixe `text-`.
 *
 * Sans cette configuration, tailwind-merge les range dans le même groupe et
 * supprime la taille au profit de la couleur : `cn('text-payment', 'text-ink')`
 * perdait silencieusement le 9px. On lui déclare donc explicitement quels noms
 * sont des tailles et lesquels sont des couleurs.
 */
const fontSizes = [
  'hero',
  'h1',
  'h1-product',
  'h2',
  'h2-sm',
  'price',
  'body',
  'body-sm',
  'ui',
  'ui-sm',
  'meta',
  'eyebrow',
  'kicker',
  'btn',
  'payment',
]

const textColors = [
  'blue-brand',
  'blue-hero',
  'navy',
  'gold',
  'gold-light',
  'ink',
  'ink-body',
  'ink-muted',
  'ink-label',
  'ink-disabled',
  'hairline',
  'control',
  'check',
  'footer-line',
  'mist',
  'mist-alt',
  'note',
  'sand',
]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': fontSizes.map((size) => `text-${size}`),
      'text-color': textColors.map((color) => `text-${color}`),
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

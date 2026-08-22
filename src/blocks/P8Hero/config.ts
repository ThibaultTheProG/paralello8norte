import type { Block } from 'payload'

/**
 * Hero de la page d'accueil : 560px, aplat bleu profond, titre 44px dont un seul
 * mot est repris en Permanent Marker doré. Le champ `accentWord` isole ce mot —
 * la marque n'autorise qu'un mot manuscrit par écran.
 */
export const P8Hero: Block = {
  slug: 'p8Hero',
  fields: [
    {
      name: 'titleBefore',
      type: 'text',
      admin: { description: 'Texte avant le mot manuscrit. Ex. « Un »' },
      localized: true,
    },
    {
      name: 'accentWord',
      type: 'text',
      admin: {
        description: 'Un seul mot, rendu en Permanent Marker doré. Ex. « pedacito »',
      },
      localized: true,
    },
    {
      name: 'titleAfter',
      type: 'text',
      admin: { description: 'Texte après le mot manuscrit. Ex. « de casa, donde estés. »' },
      localized: true,
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'VER CATÁLOGO',
      localized: true,
    },
    {
      name: 'ctaHref',
      type: 'text',
      defaultValue: '/catalogo',
    },
    {
      name: 'imageCaption',
      type: 'text',
      admin: {
        description: 'Légende de la réserve d’image, tant qu’aucune photo n’est fournie.',
      },
      defaultValue: 'Foto hero — naturaleza + lifestyle, ancho completo',
      localized: true,
    },
  ],
  interfaceName: 'P8HeroBlock',
  labels: { plural: 'Heros P8', singular: 'Hero P8' },
}

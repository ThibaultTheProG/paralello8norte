import type { Block } from 'payload'

/**
 * Encart « Diseñado en el paralelo 8 » : deux colonnes pleine largeur, image
 * carrée d'un côté, texte de l'autre, lien souligné doré en bas.
 */
export const AboutSplit: Block = {
  slug: 'aboutSplit',
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'paragraphs',
      type: 'array',
      admin: { description: 'La maquette en compte deux.' },
      fields: [{ name: 'text', type: 'textarea', localized: true, required: true }],
      maxRows: 3,
      minRows: 1,
    },
    {
      name: 'ctaLabel',
      type: 'text',
      admin: { description: 'En capitales. Laisser vide pour masquer le lien.' },
      localized: true,
    },
    {
      name: 'ctaHref',
      type: 'text',
      admin: { condition: (_, siblingData) => Boolean(siblingData?.ctaLabel) },
    },
    {
      name: 'imageSide',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Image à gauche', value: 'left' },
        { label: 'Image à droite', value: 'right' },
      ],
    },
    {
      name: 'imageCaption',
      type: 'text',
      admin: {
        description: 'Légende de la réserve d’image, tant qu’aucune photo n’est fournie.',
      },
      defaultValue: 'Foto lifestyle — plan americano, luz natural',
      localized: true,
    },
  ],
  interfaceName: 'AboutSplitBlock',
  labels: { plural: 'Encarts « à propos »', singular: 'Encart « à propos »' },
}

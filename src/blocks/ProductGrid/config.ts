import type { Block } from 'payload'

/**
 * Grille de 4 fiches produit. Sert deux fois sur la page d'accueil
 * (« Productos destacados » et « Novedades ») : d'où le choix entre une
 * sélection manuelle et un remplissage automatique par date de publication.
 */
export const ProductGrid: Block = {
  slug: 'productGrid',
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'mode',
      type: 'select',
      admin: {
        description:
          'Sélection manuelle, ou remplissage automatique par les derniers produits publiés.',
      },
      defaultValue: 'latest',
      options: [
        { label: 'Sélection manuelle', value: 'manual' },
        { label: 'Derniers publiés', value: 'latest' },
      ],
      required: true,
    },
    {
      name: 'products',
      type: 'relationship',
      admin: { condition: (_, siblingData) => siblingData?.mode === 'manual' },
      hasMany: true,
      maxRows: 8,
      relationTo: 'products',
    },
    {
      name: 'universe',
      type: 'select',
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'latest',
        description: 'Facultatif : restreindre le remplissage à un univers.',
      },
      options: [
        { label: 'Naturaleza', value: 'naturaleza' },
        { label: 'Aventura', value: 'aventura' },
        { label: 'Cultura', value: 'cultura' },
        { label: 'Origen', value: 'origen' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'latest',
        description: 'La maquette en aligne 4 — un multiple de 4 garde la grille pleine.',
      },
      defaultValue: 4,
      max: 12,
      min: 1,
    },
  ],
  interfaceName: 'ProductGridBlock',
  labels: { plural: 'Grilles de produits', singular: 'Grille de produits' },
}

import type { Block } from 'payload'

/** « Comprar por categoría » — 3 tuiles 3/4 avec bandeau bleu en pied. */
export const CategoryGrid: Block = {
  slug: 'categoryGrid',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Comprar por categoría',
      localized: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      hasMany: true,
      maxRows: 3,
      relationTo: 'categories',
    },
  ],
  interfaceName: 'CategoryGridBlock',
  labels: { plural: 'Grilles de catégories', singular: 'Grille de catégories' },
}

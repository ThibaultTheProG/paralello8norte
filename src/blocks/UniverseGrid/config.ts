import type { Block } from 'payload'

/**
 * « Los cuatro universos » — bandeau bleu pleine largeur.
 *
 * Les quatre univers sont un axe fixe de la marque (champ `universe` des
 * produits) : ils ne sont pas éditables ici. Seuls le titre et le sous-titre le
 * sont ; les noms et les accroches viennent des messages next-intl.
 */
export const UniverseGrid: Block = {
  slug: 'universeGrid',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Los cuatro universos',
      localized: true,
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Cada diseño nace de uno de ellos.',
      localized: true,
    },
  ],
  interfaceName: 'UniverseGridBlock',
  labels: { plural: 'Grilles d’univers', singular: 'Grille d’univers' },
}

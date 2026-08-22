import type { Category, Page, Product } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

type Blocks = NonNullable<Page['layout']>

const heroBlock: Blocks[number] = {
  accentWord: 'pedacito',
  blockType: 'p8Hero',
  ctaHref: '/catalogo',
  ctaLabel: 'VER CATÁLOGO',
  imageCaption: 'Foto hero — naturaleza + lifestyle, ancho completo',
  titleAfter: 'de casa, donde estés.',
  titleBefore: 'Un',
}

const universeBlock: Blocks[number] = {
  blockType: 'universeGrid',
  heading: 'Los cuatro universos',
  subtitle: 'Cada diseño nace de uno de ellos.',
}

const aboutBlock: Blocks[number] = {
  blockType: 'aboutSplit',
  ctaHref: '/',
  ctaLabel: 'NUESTRA HISTORIA',
  heading: 'Diseñado en el paralelo 8',
  imageCaption: 'Foto lifestyle — plano americano, luz natural',
  imageSide: 'left',
  paragraphs: [
    {
      text: 'Somos venezolanos viviendo en Europa. Cada pieza celebra lo que nos hace falta: el Ávila al fondo, una arepa recién hecha, la jerga que solo nosotros entendemos.',
    },
    {
      text: 'Impresión bajo demanda, cortes oversize y guiños que solo los que saben, saben.',
    },
  ],
}

const novedadesBlock: Blocks[number] = {
  blockType: 'productGrid',
  heading: 'Novedades',
  limit: 4,
  mode: 'latest',
}

/**
 * Page d'accueil de démonstration : les cinq blocs de la maquette, dans l'ordre
 * du fichier `ui_kits/web/index.html`.
 */
export const homePageData = ({
  categories,
  featured,
}: {
  categories: Category[]
  featured: Product[]
}): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'home',
  _status: 'published',
  hero: { type: 'none' },
  layout: [
    heroBlock,
    {
      blockType: 'categoryGrid',
      categories: categories.map((category) => category.id),
      heading: 'Comprar por categoría',
    },
    {
      blockType: 'productGrid',
      heading: 'Productos destacados',
      mode: 'manual',
      products: featured.map((product) => product.id),
    },
    universeBlock,
    aboutBlock,
    novedadesBlock,
  ],
  meta: {
    description:
      'Ropa y objetos para venezolanos lejos de casa. Diseño, aventura y origen, impresos bajo demanda.',
    title: 'Paralelo 8 Norte',
  },
  title: 'Inicio',
})

/**
 * Version sans relations, utilisée par `/` quand la base ne contient pas encore
 * la page « home » : mêmes blocs, moins ceux qui dépendent de documents.
 */
export const homeStaticLayout: Blocks = [heroBlock, universeBlock, aboutBlock, novedadesBlock]

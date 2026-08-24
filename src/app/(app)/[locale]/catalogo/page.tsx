import type { VariantType } from '@/payload-types'

import { Pagination, ProductCard } from '@/components/p8'
import { COLOR_AXIS, SIZE_AXIS } from '@/components/p8/variantAxes'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { getPayload, type Where } from 'payload'
import React from 'react'

import type { FacetOption } from './CatalogFilters'
import type { RawSearchParams } from './filters'

import { CatalogFilters } from './CatalogFilters'
import { SortSelect } from './SortSelect'
import { pageHref, parseFilters, SORT_TO_PAYLOAD } from './filters'

/** 12 produits par page : 3 rangées pleines dans la grille 4 colonnes de la maquette. */
const PER_PAGE = 12

type Props = {
  searchParams: Promise<RawSearchParams>
}

export async function generateMetadata() {
  const t = await getTranslations('Catalogo')

  return { title: t('titulo') }
}

export default async function CatalogoPage({ searchParams }: Props) {
  const filters = parseFilters(await searchParams)
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('Catalogo')

  // --- Facettes -------------------------------------------------------------
  const [categoriesResult, optionsResult] = await Promise.all([
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 100,
      overrideAccess: false,
      select: { title: true, slug: true },
      sort: 'title',
    }),
    payload.find({
      collection: 'variantOptions',
      depth: 1,
      overrideAccess: false,
      pagination: false,
    }),
  ])

  const axisName = (option: (typeof optionsResult.docs)[number]): string =>
    typeof option.variantType === 'object'
      ? ((option.variantType as VariantType).name ?? '').toLowerCase()
      : ''

  const optionsOfAxis = (names: string[]) =>
    optionsResult.docs.filter((o) => names.includes(axisName(o)))

  const toFacet = (option: (typeof optionsResult.docs)[number]): FacetOption => ({
    // `hex` est renseigné par la synchro Printify pour l'axe couleur.
    hex: option.hex,
    label: option.label,
    value: option.value.toLowerCase(),
  })

  const colorOptions = optionsOfAxis(COLOR_AXIS)
  const sizeOptions = optionsOfAxis(SIZE_AXIS)

  const categories: FacetOption[] = categoriesResult.docs
    .filter((category) => Boolean(category.slug))
    .map((category) => ({ label: category.title, value: category.slug as string }))

  // --- Contraintes issues des variantes -------------------------------------
  // Les axes couleur et taille vivent sur `variants`, qui n'est pas interrogeable
  // depuis `products` (c'est un champ de jointure). On résout donc d'abord les
  // identifiants de produits concernés, puis on les injecte dans la requête.
  const idsForOptions = async (values: string[], pool: typeof optionsResult.docs) => {
    const ids = pool.filter((o) => values.includes(o.value.toLowerCase())).map((o) => o.id)

    if (!ids.length) return new Set<number>()

    const variants = await payload.find({
      collection: 'variants',
      depth: 0,
      overrideAccess: false,
      pagination: false,
      select: { product: true },
      where: { options: { in: ids } },
    })

    return new Set(
      variants.docs.map((variant) =>
        typeof variant.product === 'object' ? variant.product.id : variant.product,
      ),
    )
  }

  const [colorIds, sizeIds] = await Promise.all([
    filters.color.length ? idsForOptions(filters.color, colorOptions) : null,
    filters.talla.length ? idsForOptions(filters.talla, sizeOptions) : null,
  ])

  // Un filtre par axe se cumule (couleur ET taille), les valeurs d'un même axe s'additionnent.
  let variantProductIds: null | number[] = null
  for (const set of [colorIds, sizeIds]) {
    if (!set) continue
    variantProductIds =
      variantProductIds === null ? [...set] : variantProductIds.filter((id) => set.has(id))
  }

  let inStockIds: null | number[] = null
  if (filters.stock) {
    const variants = await payload.find({
      collection: 'variants',
      depth: 0,
      overrideAccess: false,
      pagination: false,
      select: { product: true },
      where: { inventory: { greater_than: 0 } },
    })

    inStockIds = [
      ...new Set(
        variants.docs.map((variant) =>
          typeof variant.product === 'object' ? variant.product.id : variant.product,
        ),
      ),
    ]
  }

  // --- Requête produits -----------------------------------------------------
  const constraints: Where[] = [{ _status: { equals: 'published' } }]

  if (filters.universo.length) constraints.push({ universe: { in: filters.universo } })
  if (filters.categoria.length) constraints.push({ 'categories.slug': { in: filters.categoria } })
  if (variantProductIds !== null) constraints.push({ id: { in: variantProductIds } })
  if (inStockIds !== null) {
    // Un produit est disponible s'il a du stock en propre, ou une variante en stock.
    constraints.push({
      or: [{ inventory: { greater_than: 0 } }, { id: { in: inStockIds } }],
    })
  }

  // `id: { in: [] }` ne filtre rien côté Payload : on court-circuite pour ne pas
  // afficher le catalogue entier alors qu'aucun produit ne correspond.
  const impossible =
    (variantProductIds !== null && variantProductIds.length === 0) ||
    (inStockIds !== null && inStockIds.length === 0 && filters.stock)

  const products = impossible
    ? { docs: [], page: 1, totalDocs: 0, totalPages: 0 }
    : await payload.find({
        collection: 'products',
        depth: 1,
        draft: false,
        limit: PER_PAGE,
        overrideAccess: false,
        page: filters.page,
        select: {
          title: true,
          slug: true,
          gallery: true,
          priceInEUR: true,
          universe: true,
        },
        sort: SORT_TO_PAYLOAD[filters.orden],
        where: { and: constraints },
      })

  return (
    <>
      <div className="container flex items-baseline justify-between gap-4 pt-11 pb-6">
        <div className="flex items-baseline gap-3.5">
          <h1 className="text-h1 text-ink m-0 font-extrabold">{t('titulo')}</h1>
          <span className="text-ui-sm text-ink-muted">
            {t('articulos', { count: products.totalDocs })}
          </span>
        </div>
        <SortSelect filters={filters} />
      </div>

      <div className="container grid gap-10 pb-16 md:grid-cols-[var(--sidebar-w)_1fr]">
        <CatalogFilters
          categories={categories}
          colors={colorOptions.map(toFacet)}
          filters={filters}
          sizes={sizeOptions.map(toFacet)}
        />

        <div>
          {products.docs.length === 0 ? (
            <p className="text-ui text-ink-muted">{t('sinResultados')}</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-[18px] gap-y-[22px] md:grid-cols-3 lg:grid-cols-4">
              {products.docs.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination
            buildHref={(page) => pageHref(filters, page)}
            currentPage={products.page ?? 1}
            totalPages={products.totalPages ?? 1}
          />
        </div>
      </div>
    </>
  )
}

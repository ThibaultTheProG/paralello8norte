import type { Payload } from 'payload'

import type { Media, Product, VariantOption, VariantType } from '@/payload-types'

import { richText } from '@/endpoints/seed/lexical'

import { listAllProducts, printifyShopId } from './client'
import {
  axisForOption,
  basePrice,
  htmlToParagraphs,
  indexOptionValues,
  inventoryFor,
  mockupsToImport,
  sellableVariants,
  slugify,
} from './mapping'
import type { PrintifyProduct } from './types'

/**
 * Synchronisation descendante Printify → Payload.
 *
 * Ce que la synchro possède : titre, description, prix, variantes, mockups.
 * Ce qu'elle ne touche jamais après la création : l'univers, les catégories,
 * « la referencia », la composition et le slug. Ce sont des champs éditoriaux
 * de la marque, absents de Printify ; les écraser à chaque passage effacerait
 * le travail fait dans l'admin.
 *
 * Les prix sont réécrits à chaque synchro : c'est l'arbitrage retenu, Printify
 * fait autorité sur la grille tarifaire.
 */

export type SyncReport = {
  created: number
  errors: { printifyId: string; message: string; title: string }[]
  imagesImported: number
  /** Produits créés sans univers de marque : à qualifier dans l'admin. */
  needsCuration: { slug: string; title: string }[]
  skipped: number
  updated: number
  variantsUpserted: number
}

/** Univers par défaut des produits importés. `universe` est requis sur la collection. */
const DEFAULT_UNIVERSE: NonNullable<Product['universe']> = 'origen'

type Caches = {
  optionsByKey: Map<string, VariantOption>
  typesByName: Map<string, VariantType>
}

async function loadCaches(payload: Payload): Promise<Caches> {
  const [types, options] = await Promise.all([
    payload.find({ collection: 'variantTypes', depth: 0, limit: 0, pagination: false }),
    payload.find({ collection: 'variantOptions', depth: 0, limit: 0, pagination: false }),
  ])

  const typesById = new Map(types.docs.map((type) => [String(type.id), type]))

  const typesByName = new Map(
    types.docs.map((type) => [(type.name ?? '').toLowerCase(), type as VariantType]),
  )

  const optionsByKey = new Map<string, VariantOption>()

  for (const option of options.docs) {
    const typeId =
      typeof option.variantType === 'object' ? option.variantType?.id : option.variantType
    const type = typesById.get(String(typeId))

    if (!type) continue

    optionsByKey.set(`${(type.name ?? '').toLowerCase()}::${option.value}`, option as VariantOption)
  }

  return { optionsByKey, typesByName }
}

async function ensureVariantType(
  payload: Payload,
  caches: Caches,
  axis: { label: string; name: string },
): Promise<VariantType> {
  const cached = caches.typesByName.get(axis.name)

  if (cached) return cached

  const created = (await payload.create({
    collection: 'variantTypes',
    data: { name: axis.name, label: axis.label },
    depth: 0,
  })) as VariantType

  caches.typesByName.set(axis.name, created)

  return created
}

async function ensureVariantOption(
  payload: Payload,
  caches: Caches,
  args: {
    axis: { label: string; name: string }
    hex?: string
    label: string
    printifyOptionId: number
    value: string
  },
): Promise<VariantOption> {
  const key = `${args.axis.name}::${args.value}`
  const cached = caches.optionsByKey.get(key)

  if (cached) {
    // Le hex vient de Printify : il peut apparaître après coup si l'option
    // avait d'abord été saisie à la main.
    if (args.hex && cached.hex !== args.hex) {
      const updated = (await payload.update({
        collection: 'variantOptions',
        id: cached.id,
        data: { hex: args.hex, printifyOptionId: args.printifyOptionId },
        depth: 0,
      })) as VariantOption

      caches.optionsByKey.set(key, updated)

      return updated
    }

    return cached
  }

  const variantType = await ensureVariantType(payload, caches, args.axis)

  const created = (await payload.create({
    collection: 'variantOptions',
    data: {
      label: args.label,
      value: args.value,
      variantType: variantType.id,
      ...(args.hex ? { hex: args.hex } : {}),
      printifyOptionId: args.printifyOptionId,
    },
    depth: 0,
  })) as VariantOption

  caches.optionsByKey.set(key, created)

  return created
}

/** Slug libre : deux produits Printify peuvent porter le même titre. */
async function uniqueSlug(payload: Payload, title: string, printifyId: string): Promise<string> {
  const base = slugify(title) || `printify-${printifyId.slice(-8)}`

  const existing = await payload.find({
    collection: 'products',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { slug: { equals: base } },
  })

  if (existing.docs.length === 0) return base

  return `${base}-${printifyId.slice(-6)}`
}

/**
 * Importe un mockup dans la médiathèque.
 *
 * Les rendus Printify sont stables et adressés par URL : on les dédoublonne sur
 * cette URL pour qu'une seconde synchro ne re-télécharge pas les mêmes fichiers.
 */
async function importMockup(
  payload: Payload,
  args: { alt: string; src: string },
): Promise<Media | null> {
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { printifySrc: { equals: args.src } },
  })

  if (existing.docs[0]) return existing.docs[0] as Media

  const response = await fetch(args.src)

  if (!response.ok) return null

  const buffer = Buffer.from(await response.arrayBuffer())
  const name = `${slugify(args.alt) || 'mockup'}-${Math.abs(hashCode(args.src))}.jpg`

  return (await payload.create({
    collection: 'media',
    data: { alt: args.alt, printifySrc: args.src },
    depth: 0,
    file: {
      data: buffer,
      mimetype: response.headers.get('content-type') ?? 'image/jpeg',
      name,
      size: buffer.byteLength,
    },
  })) as Media
}

const hashCode = (value: string): number => {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return hash
}

async function syncProduct(
  payload: Payload,
  caches: Caches,
  printifyProduct: PrintifyProduct,
  report: SyncReport,
): Promise<void> {
  const variants = sellableVariants(printifyProduct)

  if (variants.length === 0) {
    report.skipped += 1
    payload.logger.warn(
      `Printify — « ${printifyProduct.title} » n'a aucune variante activée, produit ignoré.`,
    )
    return
  }

  const existingResult = await payload.find({
    collection: 'products',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { printifyProductId: { equals: printifyProduct.id } },
  })

  const existing = existingResult.docs[0] as Product | undefined

  const paragraphs = htmlToParagraphs(printifyProduct.description)
  const valuesById = indexOptionValues(printifyProduct)

  // --- Axes et options ------------------------------------------------------
  const axesByOptionIndex = printifyProduct.options.map(axisForOption)
  const variantTypeIds: Product['variantTypes'] = []

  for (const axis of axesByOptionIndex) {
    const variantType = await ensureVariantType(payload, caches, axis)
    variantTypeIds.push(variantType.id)
  }

  const optionDocByValueId = new Map<number, VariantOption>()

  for (const [valueId, value] of valuesById) {
    const axis = axesByOptionIndex.find(
      (candidate) =>
        candidate.name ===
        (value.optionType === 'color'
          ? 'color'
          : value.optionType === 'size'
            ? 'talla'
            : candidate.name),
    )

    if (!axis) continue

    optionDocByValueId.set(
      valueId,
      await ensureVariantOption(payload, caches, {
        axis,
        hex: value.hex,
        label: value.label,
        printifyOptionId: valueId,
        value: value.value,
      }),
    )
  }

  // --- Mockups --------------------------------------------------------------
  const gallery: NonNullable<Product['gallery']> = []

  for (const image of mockupsToImport(printifyProduct)) {
    const media = await importMockup(payload, {
      alt: `${printifyProduct.title} — ${image.position}`,
      src: image.src,
    })

    if (!media) continue

    report.imagesImported += 1

    // On rattache le rendu à l'option de couleur qu'il illustre, quand il n'en
    // illustre qu'une : c'est ce lien qui fait changer la galerie au clic sur
    // une pastille.
    const colorValueIds = new Set(
      image.variant_ids
        .map((variantId) => printifyProduct.variants.find((variant) => variant.id === variantId))
        .flatMap((variant) => variant?.options ?? [])
        .filter((valueId) => valuesById.get(valueId)?.optionType === 'color'),
    )

    const soleColor = colorValueIds.size === 1 ? [...colorValueIds][0] : undefined
    const variantOption = soleColor ? optionDocByValueId.get(soleColor) : undefined

    gallery.push({
      image: media.id,
      ...(variantOption ? { variantOption: variantOption.id } : {}),
    })
  }

  // --- Produit --------------------------------------------------------------
  // Champs sous l'autorité de Printify, réécrits à chaque passage.
  const syncedData = {
    description: paragraphs.length ? richText(...paragraphs) : undefined,
    enableVariants: true,
    priceInEUR: basePrice(printifyProduct),
    priceInEUREnabled: true,
    printifyProductId: printifyProduct.id,
    printifySyncedAt: new Date().toISOString(),
    title: printifyProduct.title,
    variantTypes: variantTypeIds,
    ...(gallery.length ? { gallery } : {}),
  }

  let product: Product

  if (existing) {
    product = (await payload.update({
      collection: 'products',
      id: existing.id,
      data: syncedData,
      depth: 0,
    })) as Product

    report.updated += 1
  } else {
    const slug = await uniqueSlug(payload, printifyProduct.title, printifyProduct.id)

    product = (await payload.create({
      collection: 'products',
      data: {
        ...syncedData,
        _status: 'draft',
        // Champs éditoriaux : posés une seule fois, à la création, puis laissés
        // à l'admin. Un produit importé reste en brouillon tant qu'il n'a pas
        // reçu son univers et sa catégorie.
        categories: [],
        gallery: gallery.length ? gallery : [],
        layout: [],
        meta: {
          description: paragraphs[0]?.slice(0, 155) ?? '',
          title: `${printifyProduct.title} — Paralelo 8 Norte`,
        },
        slug,
        universe: DEFAULT_UNIVERSE,
      },
      depth: 0,
    })) as Product

    report.created += 1
    report.needsCuration.push({ slug, title: printifyProduct.title })
  }

  // --- Variantes ------------------------------------------------------------
  const existingVariants = await payload.find({
    collection: 'variants',
    depth: 0,
    limit: 0,
    pagination: false,
    where: { product: { equals: product.id } },
  })

  const variantByPrintifyId = new Map(
    existingVariants.docs
      .filter((variant) => variant.printifyVariantId)
      .map((variant) => [variant.printifyVariantId as number, variant]),
  )

  for (const printifyVariant of variants) {
    const optionIds = printifyVariant.options
      .map((valueId) => optionDocByValueId.get(valueId)?.id)
      .filter((id): id is number => typeof id === 'number')

    if (optionIds.length !== printifyVariant.options.length) continue

    const data = {
      _status: 'published' as const,
      inventory: inventoryFor(printifyVariant),
      options: optionIds,
      priceInEUR: printifyVariant.price,
      priceInEUREnabled: true,
      printifySku: printifyVariant.sku,
      printifyVariantId: printifyVariant.id,
      product: product.id,
    }

    const existingVariant = variantByPrintifyId.get(printifyVariant.id)

    if (existingVariant) {
      await payload.update({ collection: 'variants', id: existingVariant.id, data, depth: 0 })
      variantByPrintifyId.delete(printifyVariant.id)
    } else {
      await payload.create({ collection: 'variants', data, depth: 0 })
    }

    report.variantsUpserted += 1
  }

  // Une variante désactivée dans Printify n'est plus vendable : on la met à zéro
  // plutôt que de la supprimer, pour ne pas casser l'historique des commandes.
  for (const orphan of variantByPrintifyId.values()) {
    await payload.update({
      collection: 'variants',
      id: orphan.id,
      data: { inventory: 0 },
      depth: 0,
    })
  }
}

export async function syncCatalog(payload: Payload): Promise<SyncReport> {
  const shopId = printifyShopId()

  const report: SyncReport = {
    created: 0,
    errors: [],
    imagesImported: 0,
    needsCuration: [],
    skipped: 0,
    updated: 0,
    variantsUpserted: 0,
  }

  payload.logger.info(`Printify — lecture du catalogue de la boutique ${shopId}…`)

  const printifyProducts = await listAllProducts(shopId)

  payload.logger.info(`Printify — ${printifyProducts.length} produits reçus.`)

  const caches = await loadCaches(payload)

  for (const printifyProduct of printifyProducts) {
    if (printifyProduct.is_deleted || !printifyProduct.visible) {
      report.skipped += 1
      continue
    }

    try {
      await syncProduct(payload, caches, printifyProduct, report)
    } catch (error) {
      report.errors.push({
        message: error instanceof Error ? error.message : String(error),
        printifyId: printifyProduct.id,
        title: printifyProduct.title,
      })
      payload.logger.error({ err: error, msg: `Printify — échec sur « ${printifyProduct.title} »` })
    }
  }

  return report
}

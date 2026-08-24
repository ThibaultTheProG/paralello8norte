import type { PrintifyImage, PrintifyOption, PrintifyProduct, PrintifyVariant } from './types'

/**
 * Traduction du vocabulaire Printify vers celui de la marque.
 *
 * Fonctions pures, sans accès à Payload ni au réseau : c'est ici que se règlent
 * les décisions de correspondance, et nulle part ailleurs dans la synchro.
 */

/** Slug ASCII : les titres Printify sont en anglais, parfois accentués. */
export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&apos;': "'",
  '&gt;': '>',
  '&lt;': '<',
  '&nbsp;': ' ',
  '&quot;': '"',
  '&#39;': "'",
}

/**
 * Les descriptions Printify sont du HTML rédigé dans leur éditeur. On en tire
 * des paragraphes de texte brut : le champ `description` du produit est du
 * Lexical, et y réinjecter du HTML brut afficherait les balises.
 */
export const htmlToParagraphs = (html: string): string[] =>
  html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '· ')
    .replace(/<[^>]+>/g, '')
    .replace(/&#?\w+;/g, (entity) => ENTITIES[entity.toLowerCase()] ?? entity)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

/**
 * Axe de variante correspondant à une option Printify.
 *
 * Les noms `color` et `talla` ne sont pas décoratifs : `src/components/p8/
 * variantAxes.ts` les reconnaît pour choisir entre pastilles rondes et chips,
 * et la fiche produit les met dans l'URL. Toute autre option (profondeur d'un
 * cadre, type de papier…) devient un axe supplémentaire nommé d'après elle.
 */
export const axisForOption = (option: PrintifyOption): { label: string; name: string } => {
  if (option.type === 'color') return { label: 'Color', name: 'color' }
  if (option.type === 'size') return { label: 'Talla', name: 'talla' }

  return { label: option.name, name: slugify(option.name) }
}

/** Index `id de valeur d'option Printify` → option et axe auxquels elle appartient. */
export const indexOptionValues = (product: PrintifyProduct) => {
  const byValueId = new Map<
    number,
    { hex?: string; label: string; optionType: string; value: string }
  >()

  for (const option of product.options) {
    for (const value of option.values) {
      byValueId.set(value.id, {
        hex: value.colors?.[0],
        label: value.title,
        optionType: option.type,
        value: slugify(value.title),
      })
    }
  }

  return byValueId
}

/** Seules les variantes activées dans Printify sont vendables. */
export const sellableVariants = (product: PrintifyProduct): PrintifyVariant[] =>
  product.variants.filter((variant) => variant.is_enabled)

/**
 * Prix de référence de la fiche produit : le plus bas des variantes vendables.
 * Printify chiffre déjà en centimes, comme Payload.
 */
export const basePrice = (product: PrintifyProduct): number => {
  const prices = sellableVariants(product).map((variant) => variant.price)

  return prices.length ? Math.min(...prices) : 0
}

/**
 * Stock d'une variante.
 *
 * L'impression est à la demande : il n'y a pas d'inventaire à suivre. On expose
 * donc une réserve nominale, et zéro dès que Printify déclare la variante
 * indisponible — c'est ce qui pilote l'état « agotado » des chips de taille.
 */
export const PRINT_ON_DEMAND_STOCK = 999

export const inventoryFor = (variant: PrintifyVariant): number =>
  variant.is_available ? PRINT_ON_DEMAND_STOCK : 0

/**
 * Mockups à importer.
 *
 * Printify renvoie jusqu'à une trentaine de rendus par produit (angles, plans
 * serrés, ambiances). En importer l'intégralité gonflerait la médiathèque sans
 * servir la fiche, qui empile les visuels : on retient le rendu par défaut,
 * puis un rendu par couleur, dans la limite de `max`.
 */
export const mockupsToImport = (product: PrintifyProduct, max = 8): PrintifyImage[] => {
  const published = product.images.filter((image) => image.is_selected_for_publishing !== false)
  const pool = published.length ? published : product.images

  const chosen: PrintifyImage[] = []
  const seenSignatures = new Set<string>()

  for (const image of [...pool].sort((a, b) => Number(b.is_default) - Number(a.is_default))) {
    // Deux rendus qui couvrent exactement les mêmes variantes sous le même
    // angle sont redondants pour une galerie empilée.
    const signature = `${image.position}:${[...image.variant_ids].sort().join(',')}`

    if (seenSignatures.has(signature)) continue

    seenSignatures.add(signature)
    chosen.push(image)

    if (chosen.length >= max) break
  }

  return chosen
}

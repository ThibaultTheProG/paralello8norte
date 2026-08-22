/**
 * Lecture et écriture de l'état du catalogue dans l'URL.
 *
 * Tous les filtres vivent dans les `searchParams` : la page reste un composant
 * serveur, chaque filtre est un lien, et un catalogue filtré est partageable et
 * indexable. Les noms de paramètres sont en espagnol comme le reste des URLs
 * publiques (`/catalogo?universo=cultura&talla=m`).
 */

export const SORT_KEYS = ['novedades', 'precio-asc', 'precio-desc', 'nombre'] as const

export type SortKey = (typeof SORT_KEYS)[number]

/** Traduction des clés de tri publiques en `sort` Payload. */
export const SORT_TO_PAYLOAD: Record<SortKey, string> = {
  nombre: 'title',
  novedades: '-createdAt',
  'precio-asc': 'priceInEUR',
  'precio-desc': '-priceInEUR',
}

/** Les filtres à valeurs multiples, sérialisés en liste séparée par des virgules. */
export const MULTI_KEYS = ['universo', 'categoria', 'color', 'talla'] as const

export type MultiKey = (typeof MULTI_KEYS)[number]

export type CatalogFilters = {
  orden: SortKey
  page: number
  stock: boolean
} & Record<MultiKey, string[]>

export type RawSearchParams = { [key: string]: string | string[] | undefined }

const readList = (value: string | string[] | undefined): string[] => {
  const flat = Array.isArray(value) ? value.join(',') : (value ?? '')

  return flat
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
}

const readOne = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value

export const parseFilters = (params: RawSearchParams): CatalogFilters => {
  const orden = readOne(params.orden)
  const page = Number.parseInt(readOne(params.page) ?? '1', 10)

  return {
    categoria: readList(params.categoria),
    color: readList(params.color),
    orden: SORT_KEYS.includes(orden as SortKey) ? (orden as SortKey) : 'novedades',
    page: Number.isFinite(page) && page > 0 ? page : 1,
    stock: readOne(params.stock) === '1',
    talla: readList(params.talla),
    universo: readList(params.universo),
  }
}

/** Sérialise les filtres en URL. Les valeurs par défaut sont omises pour garder l'URL courte. */
export const buildHref = (filters: CatalogFilters): string => {
  const search = new URLSearchParams()

  for (const key of MULTI_KEYS) {
    if (filters[key].length) search.set(key, filters[key].join(','))
  }
  if (filters.stock) search.set('stock', '1')
  if (filters.orden !== 'novedades') search.set('orden', filters.orden)
  if (filters.page > 1) search.set('page', String(filters.page))

  const query = search.toString()

  return query ? `/catalogo?${query}` : '/catalogo'
}

/**
 * Ajoute ou retire une valeur d'un filtre multiple. Tout changement de filtre
 * ramène à la première page — rester en page 4 d'un résultat qui n'en fait plus
 * qu'une donnerait une grille vide.
 */
export const toggleHref = (filters: CatalogFilters, key: MultiKey, value: string): string => {
  const current = filters[key]
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value].sort()

  return buildHref({ ...filters, [key]: next, page: 1 })
}

export const stockHref = (filters: CatalogFilters): string =>
  buildHref({ ...filters, page: 1, stock: !filters.stock })

export const sortHref = (filters: CatalogFilters, orden: SortKey): string =>
  buildHref({ ...filters, orden, page: 1 })

export const pageHref = (filters: CatalogFilters, page: number): string =>
  buildHref({ ...filters, page })

export const hasActiveFilters = (filters: CatalogFilters): boolean =>
  filters.stock || MULTI_KEYS.some((key) => filters[key].length > 0)

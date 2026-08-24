import type {
  PrintifyList,
  PrintifyOrderPayload,
  PrintifyOrderResponse,
  PrintifyProduct,
  PrintifyShop,
} from './types'

const API_BASE = 'https://api.printify.com/v1'

/**
 * Printify plafonne à 600 requêtes/minute, et à 200/30 min sur la publication.
 * On reste très en dessous, mais une synchro de catalogue enchaîne une requête
 * par produit : cette pause suffit à ne jamais s'en approcher.
 */
const THROTTLE_MS = 120

export class PrintifyError extends Error {
  readonly status: number
  readonly body: string

  constructor(status: number, body: string, path: string) {
    super(`Printify ${status} sur ${path}: ${body.slice(0, 300)}`)
    this.name = 'PrintifyError'
    this.status = status
    this.body = body
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Jeton d'API. Absent, rien de ce module ne doit être appelé. */
export const printifyToken = (): string => {
  const token = process.env.PRINTIFY_TOKEN

  if (!token) {
    throw new Error('PRINTIFY_TOKEN est absent de .env — impossible de joindre Printify.')
  }

  return token
}

/**
 * Boutique visée par la synchro et par l'envoi des commandes.
 *
 * `PRINTIFY_SHOP_ID` est obligatoire : le compte porte plusieurs boutiques et
 * deviner laquelle enverrait des commandes réelles au mauvais endroit.
 */
export const printifyShopId = (): string => {
  const shopId = process.env.PRINTIFY_SHOP_ID

  if (!shopId) {
    throw new Error('PRINTIFY_SHOP_ID est absent de .env — la boutique cible est indéterminée.')
  }

  return shopId
}

/** `true` si la connexion Printify est configurée. Sert à ne pas casser un environnement sans jeton. */
export const printifyIsConfigured = (): boolean =>
  Boolean(process.env.PRINTIFY_TOKEN && process.env.PRINTIFY_SHOP_ID)

type RequestOptions = {
  body?: unknown
  method?: 'DELETE' | 'GET' | 'POST' | 'PUT'
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, method = 'GET' } = options

  const response = await fetch(`${API_BASE}${path}`, {
    body: body ? JSON.stringify(body) : undefined,
    // Printify exige un User-Agent identifiable et refuse les requêtes anonymes.
    headers: {
      Authorization: `Bearer ${printifyToken()}`,
      'User-Agent': 'paralelo8-norte-storefront',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    method,
  })

  const text = await response.text()

  if (!response.ok) {
    throw new PrintifyError(response.status, text, path)
  }

  return (text ? JSON.parse(text) : {}) as T
}

export const listShops = () => request<PrintifyShop[]>('/shops.json')

/**
 * Catalogue complet de la boutique, pagination déroulée.
 *
 * Printify plafonne `limit` à 50 ; au-delà il renvoie une erreur de validation
 * plutôt que de tronquer.
 */
export async function listAllProducts(shopId: string): Promise<PrintifyProduct[]> {
  const products: PrintifyProduct[] = []
  let page = 1

  for (;;) {
    const result = await request<PrintifyList<PrintifyProduct>>(
      `/shops/${shopId}/products.json?limit=50&page=${page}`,
    )

    products.push(...result.data)

    if (page >= result.last_page || result.data.length === 0) break

    page += 1
    await sleep(THROTTLE_MS)
  }

  return products
}

export const getProduct = (shopId: string, productId: string) =>
  request<PrintifyProduct>(`/shops/${shopId}/products/${productId}.json`)

/**
 * Crée la commande côté Printify.
 *
 * La commande n'est que déposée : elle n'entre en production qu'après un appel
 * à `sendOrderToProduction`, ce qui laisse une fenêtre d'annulation.
 */
export const createOrder = (shopId: string, payload: PrintifyOrderPayload) =>
  request<PrintifyOrderResponse>(`/shops/${shopId}/orders.json`, {
    body: payload,
    method: 'POST',
  })

export const sendOrderToProduction = (shopId: string, orderId: string) =>
  request<PrintifyOrderResponse>(`/shops/${shopId}/orders/${orderId}/send_to_production.json`, {
    method: 'POST',
  })

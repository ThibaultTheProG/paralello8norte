import type { Payload } from 'payload'

import type { Address, Order, Product, User, Variant } from '@/payload-types'

import { createOrder, printifyIsConfigured, printifyShopId } from './client'
import type { PrintifyAddressTo, PrintifyLineItem } from './types'

/**
 * Envoi d'une commande payée vers Printify.
 *
 * La commande est déposée mais **pas** mise en production : `send_to_production`
 * n'est pas appelé. Printify laisse ainsi une fenêtre de vérification et
 * d'annulation, ce qui évite qu'un bug de mapping ne parte imprimer.
 *
 * Toute commande dont aucune ligne n'est rattachée à Printify est marquée
 * `skipped` : les produits saisis à la main dans l'admin ne sont pas imprimés
 * par Printify et n'ont rien à y faire.
 */

/**
 * Méthode d'expédition Printify : 1 = standard, 2 = express, 3 = économique.
 * Le standard est le seul disponible sur tous les fournisseurs.
 */
const SHIPPING_STANDARD = 1

class SubmitError extends Error {}

const asAddress = (value: unknown): Partial<Address> | null =>
  value && typeof value === 'object' ? (value as Partial<Address>) : null

function toPrintifyAddress(order: Order): PrintifyAddressTo {
  const address = asAddress(order.shippingAddress)

  if (!address) {
    throw new SubmitError("La commande n'a pas d'adresse de livraison.")
  }

  const required = {
    address1: address.addressLine1,
    city: address.city,
    country: address.country,
    first_name: address.firstName,
    last_name: address.lastName,
    zip: address.postalCode,
  }

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length) {
    throw new SubmitError(`Adresse de livraison incomplète : ${missing.join(', ')}.`)
  }

  // Une commande d'invité porte `customerEmail` ; une commande de client
  // connecté ne porte que la relation `customer`.
  const customer = typeof order.customer === 'object' ? (order.customer as User) : null
  const email = order.customerEmail || customer?.email

  if (!email) {
    throw new SubmitError("La commande n'a pas d'adresse e-mail.")
  }

  return {
    address1: required.address1 as string,
    address2: address.addressLine2 ?? undefined,
    city: required.city as string,
    country: required.country as string,
    email,
    first_name: required.first_name as string,
    last_name: required.last_name as string,
    phone: address.phone ?? undefined,
    region: address.state ?? undefined,
    zip: required.zip as string,
  }
}

/**
 * Lignes imprimables de la commande.
 *
 * Une ligne n'est imprimable que si son produit porte un `printifyProductId`
 * *et* sa variante un `printifyVariantId` : Printify identifie l'article par ce
 * couple, et un seul des deux ne suffit pas.
 */
function toLineItems(order: Order): { lineItems: PrintifyLineItem[]; nonPrintify: number } {
  const lineItems: PrintifyLineItem[] = []
  let nonPrintify = 0

  for (const item of order.items ?? []) {
    const product = typeof item.product === 'object' ? (item.product as Product) : null
    const variant = typeof item.variant === 'object' ? (item.variant as Variant) : null

    const productId = product?.printifyProductId
    const variantId = variant?.printifyVariantId

    if (!productId || !variantId) {
      nonPrintify += 1
      continue
    }

    lineItems.push({
      product_id: productId,
      quantity: item.quantity ?? 1,
      variant_id: variantId,
    })
  }

  return { lineItems, nonPrintify }
}

export type SubmitResult =
  | { printifyOrderId: string; status: 'submitted' }
  | { reason: string; status: 'failed' }
  | { reason: string; status: 'skipped' }

/**
 * Idempotent par construction : une commande déjà porteuse d'un
 * `printifyOrderId` n'est jamais renvoyée. Sans cela, un webhook Stripe rejoué
 * ferait imprimer deux fois.
 */
export async function submitOrderToPrintify(
  payload: Payload,
  orderId: number | string,
): Promise<SubmitResult> {
  if (!printifyIsConfigured()) {
    return { reason: 'PRINTIFY_TOKEN ou PRINTIFY_SHOP_ID absent.', status: 'skipped' }
  }

  const order = (await payload.findByID({
    collection: 'orders',
    id: orderId,
    depth: 2,
    overrideAccess: true,
  })) as Order

  if (order.printifyOrderId) {
    return { printifyOrderId: order.printifyOrderId, status: 'submitted' }
  }

  const record = async (
    data: Partial<Pick<Order, 'printifyError' | 'printifyOrderId' | 'printifyStatus'>>,
  ) => {
    await payload.update({
      collection: 'orders',
      id: orderId,
      // La mise à jour ne doit pas relancer les hooks qui ont mené ici.
      context: { skipPrintifySubmission: true },
      data,
      depth: 0,
      overrideAccess: true,
    })
  }

  try {
    const { lineItems, nonPrintify } = toLineItems(order)

    if (lineItems.length === 0) {
      const reason = "Aucune ligne de la commande n'est rattachée à Printify."
      await record({ printifyError: reason, printifyStatus: 'skipped' })
      return { reason, status: 'skipped' }
    }

    if (nonPrintify > 0) {
      payload.logger.warn(
        `Printify — commande ${order.id} : ${nonPrintify} ligne(s) hors Printify, à traiter à la main.`,
      )
    }

    const created = await createOrder(printifyShopId(), {
      address_to: toPrintifyAddress(order),
      external_id: String(order.id),
      label: `Paralelo 8 Norte #${order.id}`,
      line_items: lineItems,
      send_shipping_notification: false,
      shipping_method: SHIPPING_STANDARD,
    })

    await record({
      printifyError: null,
      printifyOrderId: created.id,
      printifyStatus: 'submitted',
    })

    payload.logger.info(`Printify — commande ${order.id} déposée sous ${created.id}.`)

    return { printifyOrderId: created.id, status: 'submitted' }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)

    await record({ printifyError: reason, printifyStatus: 'failed' })
    payload.logger.error({ err: error, msg: `Printify — échec sur la commande ${order.id}` })

    return { reason, status: 'failed' }
  }
}

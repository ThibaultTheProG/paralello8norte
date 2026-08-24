/**
 * Formes de l'API Printify v1 effectivement consommées ici.
 *
 * Volontairement partielles : Printify renvoie beaucoup de champs (print_areas,
 * sales_channel_properties, mockups de prévisualisation…) dont la boutique n'a
 * pas l'usage. On ne type que ce qu'on lit, pour que le compilateur signale une
 * dérive de contrat plutôt que de la masquer derrière un `any`.
 */

export type PrintifyShop = {
  id: number
  title: string
  sales_channel: string
}

export type PrintifyOptionValue = {
  id: number
  title: string
  /** Présent uniquement sur les options de type `color`. */
  colors?: string[]
}

export type PrintifyOption = {
  name: string
  /** `color`, `size`, `depth`, `paper-type`… selon le blueprint. */
  type: string
  values: PrintifyOptionValue[]
}

export type PrintifyVariant = {
  id: number
  sku: string
  /** Coût de production, en centimes de la devise du compte. */
  cost: number
  /** Prix de vente, en centimes de la devise du compte. */
  price: number
  title: string
  grams: number
  is_enabled: boolean
  is_default: boolean
  is_available: boolean
  /** Identifiants des valeurs d'options, dans l'ordre des `options` du produit. */
  options: number[]
  quantity: number
}

export type PrintifyImage = {
  src: string
  variant_ids: number[]
  position: string
  is_default: boolean
  is_selected_for_publishing?: boolean
}

export type PrintifyProduct = {
  id: string
  title: string
  /** HTML, tel que saisi dans Printify. */
  description: string
  tags: string[]
  options: PrintifyOption[]
  variants: PrintifyVariant[]
  images: PrintifyImage[]
  blueprint_id: number
  print_provider_id: number
  shop_id: number
  visible: boolean
  is_locked: boolean
  is_deleted?: boolean
  created_at: string
  updated_at: string
}

export type PrintifyList<T> = {
  current_page: number
  data: T[]
  last_page: number
  total: number
}

export type PrintifyAddressTo = {
  first_name: string
  last_name: string
  email: string
  phone?: string
  country: string
  region?: string
  address1: string
  address2?: string
  city: string
  zip: string
}

export type PrintifyLineItem = {
  product_id: string
  variant_id: number
  quantity: number
}

export type PrintifyOrderPayload = {
  external_id: string
  label?: string
  line_items: PrintifyLineItem[]
  shipping_method: number
  send_shipping_notification: boolean
  address_to: PrintifyAddressTo
}

export type PrintifyOrderResponse = {
  id: string
}

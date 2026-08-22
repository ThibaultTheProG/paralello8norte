/**
 * Les deux axes de variantes de la marque, tels que nommés dans `variantTypes`.
 *
 * Le seed (phase 7) crée « Color » et « Talla » ; les alias couvrent une saisie
 * manuelle dans l'admin. Le catalogue s'en sert pour ses facettes, la fiche
 * produit pour choisir entre pastilles rondes et chips.
 */
export const COLOR_AXIS = ['color', 'colores']
export const SIZE_AXIS = ['talla', 'tallas', 'size', 'sizes']

export type VariantAxis = 'color' | 'other' | 'size'

export const axisOf = (name: null | string | undefined): VariantAxis => {
  const normalized = (name ?? '').toLowerCase()

  if (COLOR_AXIS.includes(normalized)) return 'color'
  if (SIZE_AXIS.includes(normalized)) return 'size'

  return 'other'
}

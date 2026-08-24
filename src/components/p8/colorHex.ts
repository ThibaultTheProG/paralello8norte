/**
 * Les 5 couleurs produit du design system, indexées par le `value` de l'option
 * de variante correspondante.
 *
 * Les pastilles ont besoin d'un hex ; la collection `variantOptions` ne stocke
 * qu'un libellé et un slug. Ce tableau est le pont, et il fixe donc les slugs
 * que le seed (phase 7) doit utiliser pour les options de l'axe « Color ».
 */
export const COLOR_HEX: Record<string, string> = {
  'azul-profundo': '#1E2F45',
  blanco: '#FFFFFF',
  celeste: '#00A0DD',
  dorado: '#C9A227',
  negro: '#10131A',
}

/** Réserve neutre : une couleur inconnue ne doit pas casser la rangée de pastilles. */
export const FALLBACK_COLOR = '#E9F0F4'

const HEX = /^#[0-9a-f]{3,8}$/i

/**
 * Hex de la pastille.
 *
 * Le catalogue Printify apporte bien plus que les cinq couleurs du design
 * system, et il fournit lui-même le hex de chaque coloris : la synchro le range
 * dans `variantOptions.hex`, qui fait donc autorité. Le tableau ci-dessus reste
 * le repli pour les options saisies à la main dans l'admin.
 */
export const colorHex = (value: string, stored?: null | string): string => {
  if (stored && HEX.test(stored.trim())) return stored.trim()

  return COLOR_HEX[value] ?? FALLBACK_COLOR
}

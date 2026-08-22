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

export const colorHex = (value: string): string => COLOR_HEX[value] ?? FALLBACK_COLOR

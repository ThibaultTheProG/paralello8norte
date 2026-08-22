import { HeaderClient } from './index.client'

/**
 * La navigation de l'en-tête est fixée par la maquette (Inicio / Catálogo /
 * Contacto) plutôt que pilotée par le global `header` : trois entrées, dont deux
 * sont des routes du storefront et pas des pages CMS.
 */
export function Header() {
  return <HeaderClient />
}

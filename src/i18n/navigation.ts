import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

/**
 * Navigation consciente de la locale. Tout le storefront doit importer `Link`,
 * `redirect`, `usePathname` et `useRouter` d'ici plutôt que de `next/link` ou
 * `next/navigation`, sinon le préfixe de langue est perdu à la navigation.
 */
export const { Link, getPathname, redirect, usePathname, useRouter } = createNavigation(routing)

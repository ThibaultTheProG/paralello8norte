import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  /**
   * Le proxy ne doit toucher QUE le storefront.
   *
   * Sont exclus, dans l'ordre : le panneau d'administration Payload (`admin`),
   * ses API auto-générées (`api`, `graphql`, `graphql-playground`), les route
   * handlers du template (`next/seed`, `next/preview`, `next/exit-preview`),
   * les internes de Next et Vercel, et tout chemin contenant un point — donc
   * les fichiers statiques comme `favicon.ico`.
   *
   * Préfixer une locale sur `/admin` casserait l'accès à l'admin.
   */
  matcher: '/((?!admin|api|graphql|graphql-playground|next|_next|_vercel|.*\\..*).*)',
}

import type { RequiredDataFromCollectionSlug } from 'payload'

import { homeStaticLayout } from './home'

/**
 * Repli de la page d'accueil quand la base ne contient pas encore de page
 * « home » — au premier démarrage, avant le seed.
 */
export const homeStaticData: () => RequiredDataFromCollectionSlug<'pages'> = () => ({
  slug: 'home',
  _status: 'published',
  hero: { type: 'none' },
  layout: homeStaticLayout,
  title: 'Inicio',
})

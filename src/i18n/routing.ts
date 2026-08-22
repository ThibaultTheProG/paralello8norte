import { defineRouting } from 'next-intl/routing'

/**
 * Les trois langues de la marque. L'espagnol du Venezuela est la langue par
 * défaut : c'est celle dans laquelle toute l'UI est écrite.
 *
 * Ces codes doivent rester alignés sur `localization.locales` de
 * `src/payload.config.ts`, qui gouverne le contenu éditorial côté CMS.
 */
export const routing = defineRouting({
  defaultLocale: 'es',
  locales: ['es', 'en', 'fr'],
})

export type Locale = (typeof routing.locales)[number]

import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import * as rootParams from 'next/root-params'

import { routing } from './routing'

import esMessages from '../../messages/es.json'

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await rootParams.locale()
    locale = hasLocale(routing.locales, paramValue) ? paramValue : routing.defaultLocale
  }

  // L'espagnol sert de socle : EN et FR ne sont pas encore traduits, et cette
  // fusion évite qu'une clé manquante ne fasse planter le rendu.
  const messages =
    locale === routing.defaultLocale
      ? esMessages
      : { ...esMessages, ...(await import(`../../messages/${locale}.json`)).default }

  return { locale, messages }
})

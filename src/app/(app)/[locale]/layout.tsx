import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { routing } from '@/i18n/routing'
import { Providers } from '@/providers'
import { hasLocale } from 'next-intl'
import { NextIntlClientProvider } from 'next-intl'
import { Cormorant_Garamond, Manrope, Permanent_Marker } from 'next/font/google'
import { notFound } from 'next/navigation'
import { locale as rootLocale } from 'next/root-params'
import React from 'react'
import '../globals.css'

// Manrope porte tout l'UI. Cormorant Garamond est réservé au mot PARALELO du
// logotype, et Permanent Marker à un seul mot-accent par écran (hero, noms
// d'univers, titre « la referencia ») — voir le README du design system.
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600'],
})

const permanentMarker = Permanent_Marker({
  subsets: ['latin'],
  variable: '--font-permanent-marker',
  weight: '400',
})

export const metadata = {
  description:
    'Streetwear venezolano editado desde Europa. Impresión bajo demanda, cortes oversize y guiños que solo los que saben, saben.',
  title: {
    default: 'Paralelo 8 Norte',
    template: '%s | Paralelo 8 Norte',
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await rootLocale()

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html
      className={[manrope.variable, cormorant.variable, permanentMarker.variable].join(' ')}
      data-theme="light"
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <NextIntlClientProvider>
          <Providers>
            <AdminBar />
            <LivePreviewListener />

            <Header />
            <main className="grow">{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

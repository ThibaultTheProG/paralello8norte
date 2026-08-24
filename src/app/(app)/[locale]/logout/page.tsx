import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { LogoutPage } from './LogoutPage'

export default async function Logout() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-lg">
        <LogoutPage />
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Cuenta')

  return {
    description: t('cerrarSesion'),
    openGraph: mergeOpenGraph({
      title: t('cerrarSesion'),
      url: '/logout',
    }),
    title: t('cerrarSesion'),
  }
}

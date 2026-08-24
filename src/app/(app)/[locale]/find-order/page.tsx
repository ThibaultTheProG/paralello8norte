import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'
import { FindOrderForm } from '@/components/forms/FindOrderForm'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'

export default async function FindOrderPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-lg">
        <FindOrderForm initialEmail={user?.email} />
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth')

  return {
    description: t('buscarPedidoTexto'),
    openGraph: mergeOpenGraph({
      title: t('buscarPedido'),
      url: '/find-order',
    }),
    title: t('buscarPedido'),
  }
}

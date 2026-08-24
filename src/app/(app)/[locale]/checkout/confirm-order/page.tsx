import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getTranslations } from 'next-intl/server'
import React, { Suspense } from 'react'
import { ConfirmOrder } from '@/components/checkout/ConfirmOrder'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default async function ConfirmOrderPage() {
  return (
    <div className="container flex min-h-[70vh] items-start justify-center py-20">
      {/* `ConfirmOrder` lit `payment_intent` dans l'URL : sans cette frontière,
          le prérendu de la page échoue sur `useSearchParams`. */}
      <Suspense fallback={<LoadingSpinner className="h-6 w-12" />}>
        <ConfirmOrder />
      </Suspense>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Checkout')

  return {
    description: t('confirmandoPedido'),
    openGraph: mergeOpenGraph({
      title: t('confirmandoPedido'),
      url: '/checkout/confirm-order',
    }),
    title: t('confirmandoPedido'),
  }
}

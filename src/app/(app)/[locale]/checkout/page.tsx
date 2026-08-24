import type { Metadata } from 'next'

import { Message } from '@/components/Message'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { CheckoutPage } from '@/components/checkout/CheckoutPage'

export default async function Checkout() {
  const t = await getTranslations('Checkout')

  return (
    <div className="container flex min-h-[70vh] flex-col">
      {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
        <Message className="mt-8" warning={t('faltanClavesStripe')} />
      )}

      <h1 className="sr-only">{t('titulo')}</h1>

      <CheckoutPage />
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Checkout')

  return {
    description: t('titulo'),
    openGraph: mergeOpenGraph({
      title: t('titulo'),
      url: '/checkout',
    }),
    title: t('titulo'),
  }
}

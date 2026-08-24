import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'

export default async function ForgotPasswordPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-lg">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth')

  return {
    description: t('recuperarTexto'),
    openGraph: mergeOpenGraph({
      title: t('recuperarContrasena'),
      url: '/forgot-password',
    }),
    title: t('recuperarContrasena'),
  }
}

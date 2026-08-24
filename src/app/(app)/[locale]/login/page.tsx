import type { Metadata } from 'next'

import { RenderParams } from '@/components/RenderParams'
import { SectionHeading } from '@/components/p8'
import React from 'react'

import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { LoginForm } from '@/components/forms/LoginForm'
import { getTranslations } from 'next-intl/server'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { redirect } from 'next/navigation'

export default async function Login() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  const t = await getTranslations('Auth')

  if (user) {
    redirect(`/account?warning=${encodeURIComponent(t('yaIniciaste'))}`)
  }

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-lg">
        <RenderParams className="mb-8" />

        <SectionHeading
          className="mb-8"
          subtitle={t('iniciarSesionTexto')}
          title={t('iniciarSesion')}
        />

        <LoginForm />
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth')

  return {
    description: t('iniciarSesionTexto'),
    openGraph: mergeOpenGraph({
      title: t('iniciarSesion'),
      url: '/login',
    }),
    title: t('iniciarSesion'),
  }
}

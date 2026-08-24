import type { Metadata } from 'next'

import { SectionHeading } from '@/components/p8'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { AddressListing } from '@/components/addresses/AddressListing'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'

export default async function AddressesPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  const t = await getTranslations('Cuenta')

  if (!user) {
    redirect(`/login?warning=${encodeURIComponent(t('debesIniciarSesion'))}`)
  }

  return (
    <section>
      <SectionHeading className="mb-8" title={t('direcciones')} />

      <div className="mb-8">
        <AddressListing />
      </div>

      <CreateAddressModal />
    </section>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Cuenta')

  return {
    description: t('direcciones'),
    openGraph: mergeOpenGraph({
      title: t('direcciones'),
      url: '/account/addresses',
    }),
    title: t('direcciones'),
  }
}

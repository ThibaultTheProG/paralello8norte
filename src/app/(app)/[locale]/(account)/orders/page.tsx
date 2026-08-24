import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { SectionHeading } from '@/components/p8'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { OrderItem } from '@/components/OrderItem'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

export default async function Orders() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  const t = await getTranslations('Cuenta')

  let orders: Order[] | null = null

  if (!user) {
    redirect(`/login?warning=${encodeURIComponent(t('debesIniciarSesionPedidos'))}`)
  }

  try {
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: 0,
      pagination: false,
      user,
      overrideAccess: false,
      where: {
        customer: {
          equals: user?.id,
        },
      },
    })

    orders = ordersResult?.docs || []
  } catch (error) {}

  return (
    <section className="w-full">
      <SectionHeading className="mb-8" title={t('pedidos')} />

      {(!orders || !Array.isArray(orders) || orders?.length === 0) && (
        <p className="text-ui-sm text-ink-muted">{t('sinPedidos')}</p>
      )}

      {orders && orders.length > 0 && (
        <ul className="flex flex-col gap-4">
          {orders?.map((order) => (
            <li key={order.id}>
              <OrderItem order={order} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Cuenta')

  return {
    description: t('pedidos'),
    openGraph: mergeOpenGraph({
      title: t('pedidos'),
      url: '/orders',
    }),
    title: t('pedidos'),
  }
}

import type { Metadata } from 'next'

import { SectionHeading } from '@/components/p8'
import { Button } from '@/components/ui/button'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Link } from '@/i18n/navigation'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { AccountForm } from '@/components/forms/AccountForm'
import { Order } from '@/payload-types'
import { OrderItem } from '@/components/OrderItem'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  const t = await getTranslations('Cuenta')

  let orders: Order[] | null = null

  if (!user) {
    redirect(`/login?warning=${encodeURIComponent(t('debesIniciarSesion'))}`)
  }

  try {
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: 5,
      user,
      overrideAccess: false,
      pagination: false,
      where: {
        customer: {
          equals: user?.id,
        },
      },
    })

    orders = ordersResult?.docs || []
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  return (
    <>
      <section>
        <SectionHeading className="mb-8" title={t('ajustesTitulo')} />
        <AccountForm />
      </section>

      <section className="border-hairline border-t pt-10">
        <SectionHeading
          className="mb-6"
          size="sm"
          subtitle={t('pedidosRecientesTexto')}
          title={t('pedidosRecientes')}
        />

        {(!orders || !Array.isArray(orders) || orders?.length === 0) && (
          <p className="text-ui-sm text-ink-muted mb-8">{t('sinPedidos')}</p>
        )}

        {orders && orders.length > 0 && (
          <ul className="mb-8 flex flex-col gap-4">
            {orders?.map((order) => (
              <li key={order.id}>
                <OrderItem order={order} />
              </li>
            ))}
          </ul>
        )}

        <Button asChild size="sm" variant="outline">
          <Link href="/orders">{t('verTodosLosPedidos')}</Link>
        </Button>
      </section>
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Cuenta')

  return {
    description: t('ajustesTitulo'),
    openGraph: mergeOpenGraph({
      title: t('titulo'),
      url: '/account',
    }),
    title: t('titulo'),
  }
}

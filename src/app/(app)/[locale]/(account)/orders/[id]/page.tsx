import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Link } from '@/i18n/navigation'
import { notFound } from 'next/navigation'
import { ChevronLeftIcon } from 'lucide-react'
import { ProductItem } from '@/components/ProductItem'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { OrderStatus } from '@/components/OrderStatus'
import { AddressItem } from '@/components/addresses/AddressItem'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ email?: string; accessToken?: string }>
}

export default async function Order({ params, searchParams }: PageProps) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  const t = await getTranslations('Pedido')

  const { id } = await params
  const { email = '', accessToken = '' } = await searchParams

  let order: Order | null = null

  try {
    const {
      docs: [orderResult],
    } = await payload.find({
      collection: 'orders',
      user,
      overrideAccess: !Boolean(user),
      depth: 2,
      where: {
        and: [
          {
            id: {
              equals: id,
            },
          },
          ...(user
            ? [
                {
                  customer: {
                    equals: user.id,
                  },
                },
              ]
            : [
                {
                  accessToken: {
                    equals: accessToken,
                  },
                },
                ...(email
                  ? [
                      {
                        customerEmail: {
                          equals: email,
                        },
                      },
                    ]
                  : []),
              ]),
        ],
      },
      select: {
        amount: true,
        currency: true,
        items: true,
        customerEmail: true,
        customer: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        shippingAddress: true,
      },
    })

    const canAccessAsGuest =
      !user &&
      email &&
      accessToken &&
      orderResult &&
      orderResult.customerEmail &&
      orderResult.customerEmail === email
    const canAccessAsUser =
      user &&
      orderResult &&
      orderResult.customer &&
      (typeof orderResult.customer === 'object'
        ? orderResult.customer.id
        : orderResult.customer) === user.id

    if (orderResult && (canAccessAsGuest || canAccessAsUser)) {
      order = orderResult
    }
  } catch (error) {
    console.error(error)
  }

  if (!order) {
    notFound()
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between gap-8">
        {user ? (
          <Button asChild size="sm" variant="ghost" className="-ml-4">
            <Link href="/orders">
              <ChevronLeftIcon strokeWidth={1.8} />
              {t('todosLosPedidos')}
            </Link>
          </Button>
        ) : (
          <div />
        )}

        <h1 className="text-meta text-ink-muted m-0 font-bold tracking-[1px] uppercase">
          {`${t('numero')} ${order.id}`}
        </h1>
      </div>

      <div className="border-hairline flex flex-col gap-10 border p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
          <div>
            <p className="text-meta text-ink-muted mb-1 font-bold tracking-[1px] uppercase">
              {t('fecha')}
            </p>
            <p className="text-ui text-ink font-semibold">
              <time dateTime={order.createdAt}>
                {formatDateTime({ date: order.createdAt, format: 'dd/MM/yyyy' })}
              </time>
            </p>
          </div>

          <div>
            <p className="text-meta text-ink-muted mb-1 font-bold tracking-[1px] uppercase">
              {t('total')}
            </p>
            {order.amount && (
              <Price className="text-price text-ink font-extrabold" amount={order.amount} />
            )}
          </div>

          {order.status && (
            <div>
              <p className="text-meta text-ink-muted mb-1 font-bold tracking-[1px] uppercase">
                {t('estado')}
              </p>
              <OrderStatus status={order.status} />
            </div>
          )}
        </div>

        {order.items && (
          <div className="border-hairline border-t pt-8">
            <h2 className="text-meta text-ink-muted mb-5 font-bold tracking-[1px] uppercase">
              {t('articulos')}
            </h2>
            <ul className="flex flex-col gap-6">
              {order.items?.map((item, index) => {
                if (typeof item.product === 'string') {
                  return null
                }

                if (!item.product || typeof item.product !== 'object') {
                  return (
                    <li className="text-ui-sm text-ink-muted" key={index}>
                      {t('yaNoDisponible')}
                    </li>
                  )
                }

                const variant =
                  item.variant && typeof item.variant === 'object' ? item.variant : undefined

                return (
                  <li key={item.id}>
                    <ProductItem
                      product={item.product}
                      quantity={item.quantity}
                      variant={variant}
                    />
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {order.shippingAddress && (
          <div className="border-hairline border-t pt-8">
            <h2 className="text-meta text-ink-muted mb-4 font-bold tracking-[1px] uppercase">
              {t('direccionEnvio')}
            </h2>

            {/* @ts-expect-error - some kind of type hell */}
            <AddressItem address={order.shippingAddress} hideActions />
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const t = await getTranslations('Pedido')
  const title = `${t('numero')} ${id}`

  return {
    description: title,
    openGraph: mergeOpenGraph({
      title,
      url: `/orders/${id}`,
    }),
    title,
  }
}

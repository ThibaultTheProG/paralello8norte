import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Order } from '@/payload-types'
import { formatDateTime } from '@/utilities/formatDateTime'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

type Props = {
  order: Order
}

/** Ligne de commande : encadré à filet, rayon 0, aucune ombre. */
export const OrderItem: React.FC<Props> = ({ order }) => {
  const t = useTranslations('Pedido')
  const tc = useTranslations('Cuenta')
  const tCart = useTranslations('Carrito')

  const count = order.items?.length ?? 0

  return (
    <div className="border-hairline flex flex-col gap-6 border p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-12 md:p-6">
      <div className="flex flex-col gap-3">
        <h3 className="text-meta text-ink-muted max-w-40 truncate font-bold tracking-[1px] uppercase sm:max-w-none">
          {`${t('numero')} ${order.id}`}
        </h3>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:gap-5">
          <p className="text-ui text-ink font-semibold">
            <time dateTime={order.createdAt}>
              {formatDateTime({ date: order.createdAt, format: 'dd/MM/yyyy' })}
            </time>
          </p>

          {order.status && <OrderStatus status={order.status} />}
        </div>

        <p className="text-meta text-ink-muted flex gap-2">
          <span>{`${count} ${count === 1 ? tCart('articulo') : tCart('articulos')}`}</span>
          {order.amount && (
            <>
              <span>·</span>
              <Price as="span" amount={order.amount} currencyCode={order.currency ?? undefined} />
            </>
          )}
        </p>
      </div>

      <Button variant="outline" size="sm" asChild className="self-start sm:self-auto">
        <Link href={`/orders/${order.id}`}>{tc('verPedido')}</Link>
      </Button>
    </div>
  )
}

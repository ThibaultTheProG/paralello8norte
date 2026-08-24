import { OrderStatus as StatusOptions } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { useTranslations } from 'next-intl'

type Props = {
  status: NonNullable<StatusOptions>
  className?: string
}

/**
 * Statut de commande : même géométrie que le Badge du système (rayon 0,
 * capitales interlettrées). Le doré reste un filet, d'où la variante `gold`
 * en contour et non en aplat.
 */
export const OrderStatus: React.FC<Props> = ({ status, className }) => {
  const t = useTranslations('Pedido')

  return (
    <span
      className={cn(
        'text-payment inline-block w-fit px-2 py-1 font-extrabold tracking-[1px] uppercase',
        {
          'border-gold text-gold border': status === 'processing',
          'bg-blue-brand text-white': status === 'completed',
          'border-control text-ink-body border': status !== 'processing' && status !== 'completed',
        },
        className,
      )}
    >
      {t(status)}
    </span>
  )
}

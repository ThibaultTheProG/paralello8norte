import { ImagePlaceholder } from '@/components/p8'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { Product, Variant } from '@/payload-types'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

type Props = {
  product: Product
  style?: 'compact' | 'default'
  variant?: Variant
  quantity?: number
  /**
   * Force all formatting to a particular currency.
   */
  currencyCode?: string
}

/**
 * Ligne d'article dans une commande. La vignette est carrée, l'image en
 * `cover` ; sans visuel, on retombe sur la réserve légendée du système.
 */
export const ProductItem: React.FC<Props> = ({
  product,
  style = 'default',
  quantity,
  variant,
  currencyCode,
}) => {
  const t = useTranslations('Pedido')
  const { title } = product

  const metaImage =
    product.meta?.image && typeof product.meta?.image !== 'string' ? product.meta.image : undefined

  const firstGalleryImage =
    typeof product.gallery?.[0]?.image !== 'string' ? product.gallery?.[0]?.image : undefined

  let image = firstGalleryImage || metaImage

  const isVariant = Boolean(variant) && typeof variant === 'object'

  if (isVariant) {
    const imageVariant = product.gallery?.find((item) => {
      if (!item.variantOption) return false
      const variantOptionID =
        typeof item.variantOption === 'object' ? item.variantOption.id : item.variantOption

      const hasMatch = variant?.options?.some((option) => {
        if (typeof option === 'object') return option.id === variantOptionID
        else return option === variantOptionID
      })

      return hasMatch
    })

    if (imageVariant?.image && typeof imageVariant.image !== 'string') {
      image = imageVariant.image
    }
  }

  const itemPrice = variant?.priceInEUR || product.priceInEUR
  const itemURL = `/productos/${product.slug}${variant ? `?variant=${variant.id}` : ''}`

  return (
    <div className="flex items-center gap-4">
      <div className="border-hairline relative size-20 shrink-0 border">
        {image && typeof image !== 'string' ? (
          <Media fill imgClassName="object-cover" resource={image} />
        ) : (
          <ImagePlaceholder className="h-full w-full" />
        )}
      </div>
      <div className="flex grow items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-ui text-ink font-semibold">
            <Link className="hover:text-blue-brand" href={itemURL}>
              {title}
            </Link>
          </p>
          {variant && (
            <p className="text-meta text-ink-muted">
              {variant.options
                ?.map((option) => {
                  if (typeof option === 'object') return option.label
                  return null
                })
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
          <p className="text-meta text-ink-muted">{`× ${quantity}`}</p>
        </div>

        {itemPrice && quantity && (
          <div className="text-right">
            <p className="text-meta text-ink-muted font-bold tracking-[1px] uppercase">
              {t('subtotal')}
            </p>
            <Price
              className="text-ui text-ink font-extrabold"
              amount={itemPrice * quantity}
              currencyCode={currencyCode}
            />
          </div>
        )}
      </div>
    </div>
  )
}

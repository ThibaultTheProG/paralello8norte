'use client'

import { ImagePlaceholder, Rule } from '@/components/p8'
import { Price } from '@/components/Price'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { OpenCartButton } from './OpenCart'
import { Button } from '@/components/ui/button'
import { Product, Variant } from '@/payload-types'

// `useCart()` renvoie un panier faiblement typé côté plugin : on annote donc
// explicitement les callbacks qui parcourent galerie et options de variante.
type GalleryItem = NonNullable<Product['gallery']>[number]
type VariantOptionRef = Variant['options'][number]

export function CartModal() {
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('Carrito')

  const pathname = usePathname()

  useEffect(() => {
    // Close the cart modal when the pathname changes.
    setIsOpen(false)
  }, [pathname])

  const totalQuantity = useMemo(() => {
    if (!cart || !cart.items || !cart.items.length) return undefined
    return cart.items.reduce((quantity, item) => (item.quantity || 0) + quantity, 0)
  }, [cart])

  const isEmpty = !cart || !cart.items?.length

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton quantity={totalQuantity} />
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="px-6 pt-6 pb-4">
          <Rule />
          <SheetTitle className="text-h2-sm text-ink m-0 font-extrabold">{t('titulo')}</SheetTitle>
          <SheetDescription className="sr-only">{t('gestiona')}</SheetDescription>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex grow flex-col items-center justify-center gap-4 px-6 pb-16 text-center">
            <ShoppingBag className="text-ink-label size-10" strokeWidth={1.8} />
            <p className="text-ui text-ink-muted">{t('vacio')}</p>
            <Button asChild size="sm" variant="outline">
              <Link href="/catalogo">{t('seguirComprando')}</Link>
            </Button>
          </div>
        ) : (
          <div className="flex grow flex-col justify-between overflow-hidden">
            <ul className="grow overflow-y-auto px-6">
              {cart?.items?.map((item, i) => {
                const product = item.product
                const variant = item.variant

                if (typeof product !== 'object' || !item || !product || !product.slug)
                  return <React.Fragment key={i} />

                const metaImage =
                  product.meta?.image && typeof product.meta?.image === 'object'
                    ? product.meta.image
                    : undefined

                const firstGalleryImage =
                  typeof product.gallery?.[0]?.image === 'object'
                    ? product.gallery?.[0]?.image
                    : undefined

                let image = firstGalleryImage || metaImage
                let price = product.priceInEUR

                const isVariant = Boolean(variant) && typeof variant === 'object'

                if (isVariant) {
                  price = variant?.priceInEUR

                  const imageVariant = product.gallery?.find((galleryItem: GalleryItem) => {
                    if (!galleryItem.variantOption) return false
                    const variantOptionID =
                      typeof galleryItem.variantOption === 'object'
                        ? galleryItem.variantOption.id
                        : galleryItem.variantOption

                    const hasMatch = variant?.options?.some((option: VariantOptionRef) => {
                      if (typeof option === 'object') return option.id === variantOptionID
                      else return option === variantOptionID
                    })

                    return hasMatch
                  })

                  if (imageVariant && typeof imageVariant.image === 'object') {
                    image = imageVariant.image
                  }
                }

                return (
                  <li className="border-hairline border-b py-5 last:border-none" key={i}>
                    <div className="flex gap-4">
                      <Link
                        className="border-hairline relative size-20 shrink-0 border"
                        href={`/productos/${(item.product as Product)?.slug}`}
                      >
                        {image?.url ? (
                          <Image
                            alt={image?.alt || product?.title || ''}
                            className="h-full w-full object-cover"
                            height={160}
                            src={image.url}
                            width={160}
                          />
                        ) : (
                          <ImagePlaceholder />
                        )}
                      </Link>

                      <div className="flex grow flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              className="text-ui text-ink hover:text-blue-brand font-semibold"
                              href={`/productos/${(item.product as Product)?.slug}`}
                            >
                              {product?.title}
                            </Link>
                            {isVariant && variant ? (
                              <p className="text-meta text-ink-muted mt-0.5">
                                {variant.options
                                  ?.map((option: VariantOptionRef) =>
                                    typeof option === 'object' ? option.label : null,
                                  )
                                  .filter(Boolean)
                                  .join(' · ')}
                              </p>
                            ) : null}
                          </div>

                          <DeleteItemButton item={item} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="border-control flex items-center border">
                            <EditItemQuantityButton item={item} type="minus" />
                            <span className="text-ui-sm text-ink w-7 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>

                          {typeof price === 'number' && (
                            <Price
                              amount={price * (item.quantity || 1)}
                              className="text-ui text-ink font-extrabold"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="border-hairline border-t px-6 py-5">
              {typeof cart?.subtotal === 'number' && (
                <>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-ui text-ink-body">{t('subtotal')}</span>
                    <Price amount={cart.subtotal} className="text-price text-ink font-extrabold" />
                  </div>
                  <div className="text-meta text-ink-muted mb-5 flex items-center justify-between">
                    <span>{t('envio')}</span>
                    <span>{t('envioCalculado')}</span>
                  </div>
                </>
              )}

              <Button asChild className="w-full">
                <Link href="/checkout">{t('irAPagar')}</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

'use client'

import type { Product, Variant } from '@/payload-types'

import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import React, { useMemo } from 'react'

type Props = {
  product: Product
}

/** Discret sous le CTA : n'apparaît qu'en stock bas ou en rupture. */
export const StockIndicator: React.FC<Props> = ({ product }) => {
  const searchParams = useSearchParams()
  const t = useTranslations('Producto')

  const variants = product.variants?.docs || []

  const selectedVariant = useMemo<undefined | Variant>(() => {
    if (product.enableVariants && variants.length) {
      const variantId = searchParams.get('variant')
      const validVariant = variants.find((variant) =>
        typeof variant === 'object'
          ? String(variant.id) === variantId
          : String(variant) === variantId,
      )

      if (validVariant && typeof validVariant === 'object') return validVariant
    }

    return undefined
  }, [product.enableVariants, searchParams, variants])

  const stockQuantity = useMemo(() => {
    if (product.enableVariants && selectedVariant) return selectedVariant.inventory || 0

    return product.inventory || 0
  }, [product.enableVariants, selectedVariant, product.inventory])

  if (product.enableVariants && !selectedVariant) return null

  if (stockQuantity > 0 && stockQuantity < 10) {
    return (
      <p className="text-meta text-ink-muted m-0">{t('quedanPocas', { count: stockQuantity })}</p>
    )
  }

  if (stockQuantity <= 0) {
    return <p className="text-meta text-error m-0">{t('sinStock')}</p>
  }

  return null
}

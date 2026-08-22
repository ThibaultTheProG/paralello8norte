'use client'

import type { Product, Variant } from '@/payload-types'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  /** Barre d'achat mobile : même logique, sans le sélecteur de quantité. */
  compact?: boolean
  product: Product
}

export function AddToCart({ compact = false, product }: Props) {
  const { addItem, cart, isLoading } = useCart()
  const searchParams = useSearchParams()
  const t = useTranslations('Producto')
  const [quantity, setQuantity] = useState(1)

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

  const addToCart = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()

      addItem({ product: product.id, variant: selectedVariant?.id ?? undefined }, quantity).then(
        () => {
          toast.success(t('anadido'))
        },
      )
    },
    [addItem, product, quantity, selectedVariant, t],
  )

  const disabled = useMemo<boolean>(() => {
    const existingItem = cart?.items?.find((item) => {
      const productID = typeof item.product === 'object' ? item.product?.id : item.product
      const variantID = item.variant
        ? typeof item.variant === 'object'
          ? item.variant?.id
          : item.variant
        : undefined

      if (productID === product.id) {
        if (product.enableVariants) return variantID === selectedVariant?.id
        return true
      }
    })

    if (existingItem) {
      const existingQuantity = existingItem.quantity

      if (product.enableVariants) return existingQuantity >= (selectedVariant?.inventory || 0)
      return existingQuantity >= (product.inventory || 0)
    }

    if (product.enableVariants) {
      if (!selectedVariant) return true
      if (selectedVariant.inventory === 0) return true
    } else if (product.inventory === 0) {
      return true
    }

    return false
  }, [selectedVariant, cart?.items, product])

  const stepper = 'text-ink-muted px-[15px] text-[16px] disabled:text-ink-disabled'

  return (
    <div className="flex items-stretch gap-3">
      {!compact && (
        <div className="border-control flex items-center border">
          <button
            aria-label="−"
            className={stepper}
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            type="button"
          >
            −
          </button>
          <span className="text-ui px-1.5 font-bold">{quantity}</span>
          <button
            aria-label="+"
            className={stepper}
            onClick={() => setQuantity((q) => q + 1)}
            type="button"
          >
            +
          </button>
        </div>
      )}

      <button
        aria-label={t('anadirAlCarrito')}
        className="bg-blue-brand text-btn flex-1 p-4 font-extrabold tracking-[1.5px] text-white transition-opacity duration-[120ms] hover:opacity-90 disabled:opacity-40"
        disabled={disabled || isLoading}
        onClick={addToCart}
        type="submit"
      >
        {disabled && !isLoading ? t('agotado') : t('anadirAlCarrito')}
      </button>
    </div>
  )
}

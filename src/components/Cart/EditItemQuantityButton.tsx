'use client'

import { CartItem } from '@/components/Cart'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useMemo } from 'react'

/** Pas de rayon, pas de cercle : le sélecteur de quantité est un rectangle à filet. */
export function EditItemQuantityButton({ type, item }: { item: CartItem; type: 'minus' | 'plus' }) {
  const { decrementItem, incrementItem, isLoading } = useCart()
  const t = useTranslations('Carrito')

  const disabled = useMemo(() => {
    if (!item.id) return true

    const target =
      item.variant && typeof item.variant === 'object'
        ? item.variant
        : item.product && typeof item.product === 'object'
          ? item.product
          : null

    if (
      target &&
      typeof target === 'object' &&
      target.inventory !== undefined &&
      target.inventory !== null
    ) {
      if (type === 'plus' && item.quantity !== undefined && item.quantity !== null) {
        return item.quantity >= target.inventory
      }
    }

    return false
  }, [item, type])

  return (
    <button
      disabled={disabled || isLoading}
      aria-label={type === 'plus' ? t('aumentar') : t('disminuir')}
      className={clsx(
        'text-ink hover:text-blue-brand flex h-8 w-8 flex-none items-center justify-center transition-colors duration-[120ms]',
        { 'cursor-not-allowed opacity-45': disabled || isLoading },
      )}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (item.id) {
          if (type === 'plus') {
            incrementItem(item.id)
          } else {
            decrementItem(item.id)
          }
        }
      }}
      type="button"
    >
      {type === 'plus' ? (
        <PlusIcon className="size-3.5" strokeWidth={1.8} />
      ) : (
        <MinusIcon className="size-3.5" strokeWidth={1.8} />
      )}
    </button>
  )
}

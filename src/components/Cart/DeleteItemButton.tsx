'use client'

import type { CartItem } from '@/components/Cart'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

/** Retrait d'une ligne du panier : icône filaire, pas de pastille pleine. */
export function DeleteItemButton({ item }: { item: CartItem }) {
  const { isLoading, removeItem } = useCart()
  const t = useTranslations('Carrito')
  const itemId = item.id

  return (
    <button
      aria-label={t('quitarArticulo')}
      className={clsx(
        'text-ink-muted hover:text-ink flex size-6 items-center justify-center transition-colors duration-[120ms]',
        { 'cursor-not-allowed opacity-45': !itemId || isLoading },
      )}
      disabled={!itemId || isLoading}
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (itemId) removeItem(itemId)
      }}
      type="button"
    >
      <XIcon className="size-4" strokeWidth={1.8} />
    </button>
  )
}

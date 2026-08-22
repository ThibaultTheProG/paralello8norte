'use client'

import { cn } from '@/utilities/cn'
import { ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

/**
 * Déclencheur du panier dans l'en-tête : icône sac filaire 1.8, sans
 * remplissage. La quantité est une pastille bleue — l'un des rares cercles
 * autorisés par le système.
 */
export function OpenCartButton({
  className,
  quantity,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  quantity?: number
}) {
  const t = useTranslations('Nav')

  return (
    <button
      aria-label={t('carrito')}
      className={cn('text-ink hover:text-blue-brand relative transition-colors duration-[120ms]', className)}
      type="button"
      {...rest}
    >
      <ShoppingBag className="size-[18px]" strokeWidth={1.8} />

      {quantity ? (
        <span className="bg-blue-brand absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-extrabold text-white">
          {quantity}
        </span>
      ) : null}
    </button>
  )
}

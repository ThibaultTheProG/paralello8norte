import type { Product } from '@/payload-types'

import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import React, { Suspense } from 'react'

/**
 * Barre d'achat fixée en bas de l'écran en mobile (56px), comme le prescrit la
 * maquette : le CTA reste atteignable pendant qu'on fait défiler la galerie.
 */
export const MobileBuyBar: React.FC<{ product: Product }> = ({ product }) => (
  <div className="border-hairline bg-background fixed right-0 bottom-0 left-0 z-40 flex h-14 items-center gap-3 border-t px-[18px] md:hidden">
    {typeof product.priceInEUR === 'number' && (
      <Price amount={product.priceInEUR} as="span" className="text-ui text-ink font-semibold" />
    )}
    <div className="flex-1">
      <Suspense fallback={null}>
        <AddToCart compact product={product} />
      </Suspense>
    </div>
  </div>
)

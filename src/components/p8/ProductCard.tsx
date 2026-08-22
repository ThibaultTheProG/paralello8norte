import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { Link } from '@/i18n/navigation'
import type { Product } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'

import { Eyebrow } from './Eyebrow'
import { ImagePlaceholder } from './ImagePlaceholder'

const universeLabels: Record<string, string> = {
  aventura: 'Aventura',
  cultura: 'Cultura',
  naturaleza: 'Naturaleza',
  origen: 'Origen',
}

type Props = {
  className?: string
  product: Pick<Product, 'gallery' | 'priceInEUR' | 'slug' | 'title' | 'universe'>
}

/**
 * Brique de toutes les grilles : destacados, novedades, catálogo, « del mismo
 * universo ». Ratio 4/5, survol qui bascule sur le second visuel et fait monter
 * la barre bleue.
 */
export const ProductCard: React.FC<Props> = ({ className, product }) => {
  const { gallery, priceInEUR, slug, title, universe } = product

  const primary = gallery?.[0]?.image
  const secondary = gallery?.[1]?.image

  return (
    <Link className={cn('group flex flex-col gap-2.5', className)} href={`/productos/${slug}`}>
      <div className="relative aspect-[4/5] overflow-hidden">
        {primary && typeof primary === 'object' ? (
          <Media
            className="h-full w-full"
            fill
            imgClassName="object-cover"
            resource={primary}
            priority={false}
          />
        ) : (
          <ImagePlaceholder label={title} />
        )}

        {/* Second visuel au survol — le dos du produit dans la maquette. */}
        {secondary && typeof secondary === 'object' && (
          <Media
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[180ms] group-hover:opacity-100"
            fill
            imgClassName="object-cover"
            resource={secondary}
          />
        )}
      </div>

      <div className="flex flex-col gap-[3px]">
        {universe && <Eyebrow>{universeLabels[universe] ?? universe}</Eyebrow>}
        <span className="text-ui text-ink font-semibold">{title}</span>
        {typeof priceInEUR === 'number' && (
          <Price amount={priceInEUR} as="span" className="text-ui text-ink" />
        )}
      </div>
    </Link>
  )
}

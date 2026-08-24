import type { Media as MediaType, Product } from '@/payload-types'

import { ImagePlaceholder } from '@/components/p8'
import { GalleryCarousel } from './GalleryCarousel'
import { getTranslations } from 'next-intl/server'
import React from 'react'

type Props = {
  gallery: NonNullable<Product['gallery']>
  title: string
}

/**
 * Colonne visuelle de la fiche produit : un carrousel 4/5 face à la colonne
 * d'achat. Faute de photo, on empile les réserves prescrites par le design
 * system plutôt que de faire défiler du vide.
 */
const PLACEHOLDER_COUNT = 3

export const Gallery: React.FC<Props> = async ({ gallery, title }) => {
  const t = await getTranslations('Comun')

  const images = gallery
    .map((item) => item.image)
    .filter((image): image is MediaType => Boolean(image) && typeof image === 'object')

  if (!images.length) {
    return (
      <div className="flex flex-col gap-[18px]">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
          <div className="relative aspect-[4/5] w-full" key={index}>
            <ImagePlaceholder label={index === 0 ? title : t('imagenPendiente')} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <GalleryCarousel
      images={images}
      labels={{
        anterior: t('imagenAnterior'),
        siguiente: t('imagenSiguiente'),
        verImagen: t('verImagen'),
      }}
    />
  )
}

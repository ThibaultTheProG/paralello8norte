import type { Media as MediaType, Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { ImagePlaceholder } from '@/components/p8'
import { getTranslations } from 'next-intl/server'
import React from 'react'

type Props = {
  gallery: NonNullable<Product['gallery']>
  title: string
}

/** Le carrousel du template est remplacé par la colonne empilée de la maquette : trois visuels 4/5 qui défilent contre la colonne d'achat restée fixe. */
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
    <div className="flex flex-col gap-[18px]">
      {images.map((image, index) => (
        <div className="relative aspect-[4/5] w-full overflow-hidden" key={image.id}>
          <Media
            className="h-full w-full"
            fill
            imgClassName="object-cover"
            priority={index === 0}
            resource={image}
          />
        </div>
      ))}
    </div>
  )
}

'use client'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import { cn } from '@/utilities/cn'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

type Props = {
  images: MediaType[]
  labels: { anterior: string; siguiente: string; verImagen: string }
}

/**
 * Carrousel de la fiche produit.
 *
 * Les flèches sont posées à l'intérieur du cadre plutôt qu'à l'extérieur comme
 * le fait la primitive shadcn : la galerie occupe une colonne de grille, des
 * boutons en `-left-12` déborderaient sur le fil d'Ariane et sur la colonne
 * d'achat. Carrés, sans ombre, ils suivent la règle de rayon 0 ; seule la
 * vignette active porte un filet or, jamais un aplat.
 */
export const GalleryCarousel: React.FC<Props> = ({ images, labels }) => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [selected, setSelected] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    const sync = () => setSelected(api.selectedScrollSnap())

    sync()
    api.on('select', sync)

    return () => {
      api.off('select', sync)
    }
  }, [api])

  const multiple = images.length > 1

  return (
    <div className="flex flex-col gap-[18px]">
      <Carousel
        className="relative"
        opts={{ align: 'start', loop: multiple, watchDrag: multiple }}
        setApi={setApi}
      >
        <CarouselContent className="ml-0">
          {images.map((image, index) => (
            <CarouselItem className="pl-0" key={image.id}>
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Media
                  className="h-full w-full"
                  fill
                  imgClassName="object-cover"
                  priority={index === 0}
                  resource={image}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {multiple && (
          <>
            <ArrowButton label={labels.anterior} onClick={() => api?.scrollPrev()} side="left" />
            <ArrowButton label={labels.siguiente} onClick={() => api?.scrollNext()} side="right" />
          </>
        )}
      </Carousel>

      {multiple && (
        <div className="flex gap-2.5">
          {images.map((image, index) => (
            <button
              aria-current={index === selected}
              aria-label={`${labels.verImagen} ${index + 1}`}
              className={cn(
                'relative aspect-[4/5] w-16 shrink-0 overflow-hidden border-b transition-colors duration-150',
                index === selected ? 'border-gold' : 'border-transparent',
              )}
              key={image.id}
              onClick={() => api?.scrollTo(index)}
              type="button"
            >
              <Media
                className="h-full w-full"
                fill
                imgClassName={cn(
                  'object-cover transition-opacity duration-150',
                  index === selected ? 'opacity-100' : 'opacity-70 hover:opacity-100',
                )}
                resource={image}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ArrowButton: React.FC<{
  label: string
  onClick: () => void
  side: 'left' | 'right'
}> = ({ label, onClick, side }) => (
  <button
    aria-label={label}
    className={cn(
      'text-ink absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center',
      'bg-white/85 transition-colors duration-150 hover:bg-white',
      side === 'left' ? 'left-3' : 'right-3',
    )}
    onClick={onClick}
    type="button"
  >
    {side === 'left' ? (
      <ChevronLeft size={24} strokeWidth={1.8} />
    ) : (
      <ChevronRight size={24} strokeWidth={1.8} />
    )}
  </button>
)

import { ImagePlaceholder } from '@/components/p8'
import { Link } from '@/i18n/navigation'
import type { P8HeroBlock } from '@/payload-types'
import React from 'react'

export const P8HeroComponent: React.FC<P8HeroBlock> = ({
  accentWord,
  ctaHref,
  ctaLabel,
  imageCaption,
  titleAfter,
  titleBefore,
}) => (
  <section className="relative h-[420px] w-full overflow-hidden md:h-[560px]">
    {/* Aucune photo fournie : le dégradé du hero tient lieu de réserve. */}
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {imageCaption && (
        <span className="text-eyebrow px-4 text-center font-semibold tracking-[2px] text-white/55 uppercase">
          {imageCaption}
        </span>
      )}
    </div>

    <div className="absolute right-0 bottom-13 left-0">
      <div className="container">
        <h1 className="text-hero m-0 max-w-[18ch] font-extrabold text-white">
          {titleBefore}{' '}
          {accentWord && (
            <span className="font-marker text-gold-light text-[50px] font-normal">
              {accentWord}
            </span>
          )}{' '}
          {titleAfter}
        </h1>

        {ctaLabel && (
          <Link
            className="text-btn text-blue-hero mt-6 inline-block bg-white px-[34px] py-[15px] font-extrabold tracking-[1.5px] transition-opacity duration-[120ms] hover:opacity-90"
            href={ctaHref || '/catalogo'}
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  </section>
)

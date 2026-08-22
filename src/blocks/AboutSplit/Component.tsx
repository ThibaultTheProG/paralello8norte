import { ImagePlaceholder, Rule } from '@/components/p8'
import { Link } from '@/i18n/navigation'
import type { AboutSplitBlock } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'

export const AboutSplitComponent: React.FC<AboutSplitBlock> = ({
  ctaHref,
  ctaLabel,
  heading,
  imageCaption,
  imageSide,
  paragraphs,
}) => (
  <section className="mt-16 grid w-full items-center md:grid-cols-2">
    <div className={cn('relative aspect-square w-full', imageSide === 'right' && 'md:order-2')}>
      <ImagePlaceholder label={imageCaption ?? undefined} />
    </div>

    <div className="px-[18px] py-12 md:px-[72px] md:py-0">
      <Rule />
      {/* 26px : taille propre à cet encart dans la maquette, entre h2 et h1. */}
      <h2 className="text-ink m-0 mb-4 text-[26px] font-extrabold">{heading}</h2>

      {(paragraphs ?? []).map((paragraph, i) => (
        <p className="text-body text-ink-body mt-0 mb-3 last:mb-0" key={paragraph.id ?? i}>
          {paragraph.text}
        </p>
      ))}

      {ctaLabel && (
        <Link
          className="text-btn text-blue-brand border-gold mt-[22px] inline-block border-b-2 pb-1 font-extrabold tracking-[1px]"
          href={ctaHref || '/'}
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  </section>
)

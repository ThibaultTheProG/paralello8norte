import { Link } from '@/i18n/navigation'
import React from 'react'

import { ImagePlaceholder } from './ImagePlaceholder'

type Props = {
  description?: string
  href?: string
  imageLabel?: string
  name: string
}

/**
 * Tuile du bloc « Los cuatro universos », posée sur l'aplat bleu.
 * Le nom en Permanent Marker 30px est le seul usage à grande taille de cette
 * fonte sur le site. Le texte est protégé par le dégradé, jamais par un flou.
 */
export const UniverseTile: React.FC<Props> = ({ description, href, imageLabel, name }) => {
  const content = (
    <div className="relative aspect-[3/4] overflow-hidden bg-[rgba(6,42,60,0.35)]">
      <ImagePlaceholder label={imageLabel ?? `Foto ${name}`} tone="dark" />
      <div
        className="absolute right-0 bottom-0 left-0 px-[18px] py-5"
        style={{ background: 'var(--gradient-protect)' }}
      >
        <div className="font-marker text-[30px] text-white">{name}</div>
        {description && <div className="text-kicker mt-0.5 text-white/80">{description}</div>}
      </div>
    </div>
  )

  return href ? <Link href={href}>{content}</Link> : content
}

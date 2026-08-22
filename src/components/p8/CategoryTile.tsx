import { Link } from '@/i18n/navigation'
import React from 'react'

import { ImagePlaceholder } from './ImagePlaceholder'

type Props = {
  count?: string
  href: string
  name: string
}

/** Tuile du bloc « Comprar por categoría » : ratio 3/4, bandeau bleu en pied. */
export const CategoryTile: React.FC<Props> = ({ count, href, name }) => (
  <Link className="group relative block aspect-[3/4] overflow-hidden" href={href}>
    <ImagePlaceholder label={`Foto ${name}`} />
    <div className="bg-blue-brand absolute right-0 bottom-0 left-0 flex items-baseline justify-between px-[18px] py-3.5 text-white">
      <span className="text-[16px] font-extrabold">{name}</span>
      {count && <span className="text-kicker opacity-85">{count}</span>}
    </div>
  </Link>
)

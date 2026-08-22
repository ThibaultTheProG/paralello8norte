import { cn } from '@/utilities/cn'
import React from 'react'

import { Rule } from './Rule'

type Props = {
  className?: string
  /** Sur aplat bleu : texte en blanc et filet doré supprimé (il ne tiendrait pas). */
  onAccent?: boolean
  size?: 'md' | 'sm'
  subtitle?: string
  title: string
}

/** Ouvre chaque bloc de page. Le filet doré est la signature — ne l'omettre que sur aplat. */
export const SectionHeading: React.FC<Props> = ({
  className,
  onAccent = false,
  size = 'md',
  subtitle,
  title,
}) => (
  <div className={className}>
    {!onAccent && <Rule />}
    <h2
      className={cn(
        'm-0 font-extrabold',
        size === 'sm' ? 'text-h2-sm' : 'text-h2',
        onAccent ? 'text-white' : 'text-ink',
      )}
    >
      {title}
    </h2>
    {subtitle && (
      <p className={cn('text-ui mt-1.5 mb-0', onAccent ? 'text-white/85' : 'text-ink-muted')}>
        {subtitle}
      </p>
    )}
  </div>
)

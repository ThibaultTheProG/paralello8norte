import { cn } from '@/utilities/cn'
import React from 'react'

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'blue' | 'gold' | 'ink' | 'quiet'
}

const tones: Record<NonNullable<Props['tone']>, string> = {
  blue: 'bg-blue-brand text-white',
  gold: 'border border-gold text-gold',
  ink: 'bg-ink text-white',
  quiet: 'border border-control text-ink-body',
}

/** Étiquette rectangulaire : NUEVO, AGOTADO, logos de paiement du pied de page. */
export const Badge: React.FC<Props> = ({ children, className, tone = 'ink', ...rest }) => (
  <span
    className={cn(
      'text-payment inline-block px-2 py-1 font-extrabold tracking-[1px] uppercase',
      tones[tone],
      className,
    )}
    {...rest}
  >
    {children}
  </span>
)

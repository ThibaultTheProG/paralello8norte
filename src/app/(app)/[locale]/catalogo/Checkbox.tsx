import { Link } from '@/i18n/navigation'
import React from 'react'

type Props = {
  checked: boolean
  href: string
  label: string
}

/**
 * Case à cocher du panneau de filtres : carré 15px, bordure 1.5px, coche blanche
 * sur aplat bleu quand elle est active. C'est un lien, pas un `input` — l'état
 * des filtres vit dans l'URL et la page reste rendue côté serveur.
 */
export const FilterCheckbox: React.FC<Props> = ({ checked, href, label }) => (
  <Link
    aria-current={checked ? 'true' : undefined}
    className="text-ui-sm text-ink hover:text-blue-brand flex items-center gap-[9px] transition-colors duration-[120ms]"
    href={href}
  >
    <span
      aria-hidden
      className={
        checked
          ? 'border-blue-brand bg-blue-brand flex h-[15px] w-[15px] shrink-0 items-center justify-center border-[1.5px] text-[10px] font-extrabold text-white'
          : 'border-check h-[15px] w-[15px] shrink-0 border-[1.5px]'
      }
    >
      {checked ? '✓' : ''}
    </span>
    {label}
  </Link>
)

'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/utilities/cn'
import { useLocale } from 'next-intl'
import React from 'react'

/**
 * Sélecteur ES / EN / FR de l'en-tête.
 *
 * `usePathname` de next-intl renvoie le chemin SANS préfixe de langue, ce qui
 * permet de rester sur la même page en changeant de locale.
 */
export const LocaleSwitcher: React.FC = () => {
  const active = useLocale()
  const pathname = usePathname()

  return (
    <div className="flex gap-2">
      {routing.locales.map((locale) => (
        <Link
          className={cn(
            'text-meta transition-colors duration-[120ms]',
            locale === active
              ? 'text-ink font-bold'
              : 'text-ink-disabled hover:text-ink font-medium',
          )}
          href={pathname}
          key={locale}
          locale={locale}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}

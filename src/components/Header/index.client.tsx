'use client'

import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { Wordmark } from '@/components/p8'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'
import { Search, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { Suspense } from 'react'

import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileMenu } from './MobileMenu'

/**
 * En-tête unique du site : fond blanc, filet gris de 1px en bas, lien actif en
 * bleu souligné 2px. Les icônes sont des tracés de 1.8 sans remplissage
 * (substitution Lucide validée par le design system).
 */
export function HeaderClient() {
  const t = useTranslations('Nav')
  const pathname = usePathname()

  const links = [
    { href: '/', label: t('inicio') },
    { href: '/catalogo', label: t('catalogo') },
    { href: '/contacto', label: t('contacto') },
  ]

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className="border-hairline bg-white border-b">
      <div className="container flex items-center justify-between py-[18px]">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Suspense fallback={null}>
              <MobileMenu links={links} />
            </Suspense>
          </div>
          <Link aria-label="Paralelo 8 Norte" href="/">
            <Wordmark />
          </Link>
        </div>

        <nav className="text-ui text-ink hidden gap-9 font-semibold md:flex">
          {links.map((link) => (
            <Link
              className={cn(
                'transition-colors duration-[120ms]',
                isActive(link.href)
                  ? 'text-blue-brand border-blue-brand border-b-2 pb-[3px]'
                  : 'hover:text-blue-brand',
              )}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="text-meta text-ink flex items-center gap-[22px]">
          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>
          <span className="hidden font-semibold sm:inline">EUR ▾</span>

          <Link aria-label={t('buscar')} href="/catalogo">
            <Search className="hover:text-blue-brand size-[18px] transition-colors duration-[120ms]" strokeWidth={1.8} />
          </Link>
          <Link aria-label={t('cuenta')} href="/account">
            <User className="hover:text-blue-brand size-[18px] transition-colors duration-[120ms]" strokeWidth={1.8} />
          </Link>

          <Suspense fallback={<OpenCartButton />}>
            <Cart />
          </Suspense>
        </div>
      </div>
    </header>
  )
}

'use client'

import { Rule } from '@/components/p8'
import clsx from 'clsx'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

type Props = {
  className?: string
}

/**
 * Colonne de navigation du compte. Les entrées sont des liens en capitales
 * interlettrées ; l'entrée active passe au bleu de la marque, jamais en aplat.
 */
export const AccountNav: React.FC<Props> = ({ className }) => {
  const pathname = usePathname()
  const t = useTranslations('Cuenta')

  const links = [
    { href: '/account', label: t('ajustes') },
    { href: '/account/addresses', label: t('direcciones') },
    { href: '/orders', label: t('pedidos') },
  ]

  const isActive = (href: string) =>
    href === '/orders' ? pathname.includes('/orders') : pathname.endsWith(href)

  return (
    <nav className={clsx(className)}>
      <Rule />
      <ul className="flex w-full flex-col gap-3">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={clsx(
                'text-btn font-extrabold tracking-[1.5px] uppercase transition-colors duration-[120ms]',
                isActive(href) ? 'text-blue-brand' : 'text-ink-muted hover:text-ink',
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="border-hairline my-5 w-full" />

      <Link
        href="/logout"
        className="text-btn text-ink-muted hover:text-ink font-extrabold tracking-[1.5px] uppercase transition-colors duration-[120ms]"
      >
        {t('cerrarSesion')}
      </Link>
    </nav>
  )
}

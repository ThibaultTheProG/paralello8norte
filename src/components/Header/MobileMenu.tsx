'use client'

import { Wordmark } from '@/components/p8'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Link, usePathname } from '@/i18n/navigation'
import { useAuth } from '@/providers/Auth'
import { MenuIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { LocaleSwitcher } from './LocaleSwitcher'

interface Props {
  links: { href: string; label: string }[]
}

export function MobileMenu({ links }: Props) {
  const { user } = useAuth()
  const t = useTranslations()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger
        aria-label={t('Nav.menu')}
        className="text-ink flex h-9 w-9 items-center justify-center"
      >
        <MenuIcon className="size-[18px]" strokeWidth={1.8} />
      </SheetTrigger>

      <SheetContent className="px-[18px]" side="left">
        <SheetHeader className="px-0 pt-4 pb-0">
          <SheetTitle asChild>
            <span>
              <Wordmark size="sm" />
            </span>
          </SheetTitle>
          <SheetDescription className="sr-only">{t('Nav.menu')}</SheetDescription>
        </SheetHeader>

        <nav className="py-6">
          <ul className="flex w-full flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link className="text-h2-sm text-ink font-extrabold" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-hairline border-t pt-6">
          {user ? (
            <ul className="text-ui text-ink-body flex flex-col gap-3">
              <li>
                <Link href="/orders">{t('Cuenta.pedidos')}</Link>
              </li>
              <li>
                <Link href="/account/addresses">{t('Cuenta.direcciones')}</Link>
              </li>
              <li>
                <Link href="/account">{t('Cuenta.ajustes')}</Link>
              </li>
              <li className="mt-4">
                <Button asChild size="sm" variant="outline">
                  <Link href="/logout">{t('Cuenta.cerrarSesion')}</Link>
                </Button>
              </li>
            </ul>
          ) : (
            <div className="flex flex-col gap-3">
              <Button asChild size="sm" variant="outline">
                <Link href="/login">{t('Auth.iniciarSesion')}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/create-account">{t('Auth.crearCuenta')}</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="border-hairline mt-6 flex items-center justify-between border-t pt-6">
          <LocaleSwitcher />
          <span className="text-meta text-ink font-semibold">EUR ▾</span>
        </div>
      </SheetContent>
    </Sheet>
  )
}

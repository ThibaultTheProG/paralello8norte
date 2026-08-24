'use client'

import { SectionHeading } from '@/components/p8'
import { useAuth } from '@/providers/Auth'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import React, { Fragment, useEffect, useState } from 'react'

export const LogoutPage: React.FC = () => {
  const { logout } = useAuth()
  const t = useTranslations('Auth')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setSuccess(t('sesionCerrada'))
      } catch (_) {
        setError(t('yaEstabasFuera'))
      }
    }

    void performLogout()
  }, [logout, t])

  if (!error && !success) return null

  return (
    <Fragment>
      <SectionHeading className="mb-6" title={error || success} />

      <p className="text-ui text-ink-body">
        {`${t('queHacemos')} `}
        <Link className="text-blue-brand border-gold border-b-2 font-semibold" href="/catalogo">
          {t('volverATienda')}
        </Link>
        {' · '}
        <Link className="text-blue-brand border-gold border-b-2 font-semibold" href="/login">
          {t('volverAEntrar')}
        </Link>
      </p>
    </Fragment>
  )
}

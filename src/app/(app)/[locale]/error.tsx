'use client'

import { Rule } from '@/components/p8'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function Error({ reset }: { reset: () => void }) {
  const t = useTranslations('Comun')

  return (
    <div className="container flex min-h-[50vh] flex-col justify-center py-24">
      <Rule />
      <h2 className="text-h1 text-ink mb-3 font-extrabold">{t('errorTitulo')}</h2>
      <p className="text-body text-ink-muted mb-8 max-w-md">{t('errorTexto')}</p>

      <Button className="self-start" onClick={() => reset()} type="button" variant="default">
        {t('reintentar')}
      </Button>
    </div>
  )
}

import { Rule } from '@/components/p8'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { Button } from '@/components/ui/button'

export default async function NotFound() {
  const t = await getTranslations('Comun')

  return (
    <div className="container flex min-h-[50vh] flex-col justify-center py-24">
      <Rule />
      <p className="text-hero text-ink-label font-extrabold">404</p>
      <h1 className="text-h1 text-ink mt-2 mb-3 font-extrabold">{t('noEncontrado')}</h1>
      <p className="text-body text-ink-muted mb-8 max-w-md">{t('noEncontradoTexto')}</p>

      <Button asChild className="self-start" variant="default">
        <Link href="/">{t('irAlInicio')}</Link>
      </Button>
    </div>
  )
}

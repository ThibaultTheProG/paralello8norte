'use client'

import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import React from 'react'

import type { CatalogFilters, SortKey } from './filters'

import { SORT_KEYS, sortHref } from './filters'

/**
 * Le tri est le seul contrôle du catalogue qui ne peut pas être un simple lien :
 * la maquette montre un menu déroulant. Le reste des filtres reste rendu côté
 * serveur.
 */
export const SortSelect: React.FC<{ filters: CatalogFilters }> = ({ filters }) => {
  const router = useRouter()
  const t = useTranslations('Catalogo')

  const labels: Record<SortKey, string> = {
    nombre: t('ordenNombre'),
    novedades: t('ordenNovedades'),
    'precio-asc': t('ordenPrecioAsc'),
    'precio-desc': t('ordenPrecioDesc'),
  }

  return (
    <div className="text-ui-sm flex items-center gap-2.5">
      <span className="text-ink-muted">{t('ordenar')}</span>
      <select
        aria-label={t('ordenar')}
        className="border-control text-ink cursor-pointer border bg-transparent px-3.5 py-2 font-bold"
        onChange={(event) => router.push(sortHref(filters, event.target.value as SortKey))}
        value={filters.orden}
      >
        {SORT_KEYS.map((key) => (
          <option key={key} value={key}>
            {labels[key]}
          </option>
        ))}
      </select>
    </div>
  )
}

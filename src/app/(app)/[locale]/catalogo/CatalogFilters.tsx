import { ColorSwatch, Eyebrow, SizeChip } from '@/components/p8'
import { colorHex } from '@/components/p8/colorHex'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import type { CatalogFilters as Filters } from './filters'

import { FilterCheckbox } from './Checkbox'
import { hasActiveFilters, stockHref, toggleHref } from './filters'

/** Les 4 univers sont un axe fixe de la marque : ils ne viennent pas de la base. */
const UNIVERSES = ['naturaleza', 'aventura', 'cultura', 'origen'] as const

export type FacetOption = { label: string; value: string }

type Props = {
  categories: FacetOption[]
  colors: FacetOption[]
  filters: Filters
  sizes: FacetOption[]
}

const Group: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
  <div className="flex flex-col gap-2.5">
    <Eyebrow className="text-kicker">{title}</Eyebrow>
    {children}
  </div>
)

export const CatalogFilters: React.FC<Props> = async ({ categories, colors, filters, sizes }) => {
  const t = await getTranslations('Catalogo')
  const tu = await getTranslations('Universos')

  return (
    <aside className="flex flex-col gap-7">
      <Group title={t('filtroUniverso')}>
        {UNIVERSES.map((universe) => (
          <FilterCheckbox
            checked={filters.universo.includes(universe)}
            href={toggleHref(filters, 'universo', universe)}
            key={universe}
            label={tu(universe)}
          />
        ))}
      </Group>

      {categories.length > 0 && (
        <Group title={t('filtroTipo')}>
          {categories.map((category) => (
            <FilterCheckbox
              checked={filters.categoria.includes(category.value)}
              href={toggleHref(filters, 'categoria', category.value)}
              key={category.value}
              label={category.label}
            />
          ))}
        </Group>
      )}

      {colors.length > 0 && (
        <Group title={t('filtroColor')}>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <ColorSwatch
                color={colorHex(color.value)}
                href={toggleHref(filters, 'color', color.value)}
                key={color.value}
                name={color.label}
                selected={filters.color.includes(color.value)}
                size={22}
              />
            ))}
          </div>
        </Group>
      )}

      {sizes.length > 0 && (
        <Group title={t('filtroTalla')}>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <SizeChip
                href={toggleHref(filters, 'talla', size.value)}
                key={size.value}
                label={size.label}
                selected={filters.talla.includes(size.value)}
              />
            ))}
          </div>
        </Group>
      )}

      <Group title={t('filtroDisponibilidad')}>
        <Link
          aria-current={filters.stock ? 'true' : undefined}
          className="text-ui-sm text-ink hover:text-blue-brand flex items-center gap-[9px] transition-colors duration-[120ms]"
          href={stockHref(filters)}
        >
          {/* L'interrupteur pilule est, avec les pastilles de couleur, la seule
              exception au rayon 0 du système. */}
          <span
            aria-hidden
            className={`relative inline-block h-[17px] w-[30px] shrink-0 rounded-full transition-colors duration-[120ms] ${
              filters.stock ? 'bg-blue-brand' : 'bg-control'
            }`}
          >
            <span
              className={`absolute top-0.5 h-[13px] w-[13px] rounded-full bg-white transition-all duration-[120ms] ${
                filters.stock ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </span>
          {t('soloEnStock')}
        </Link>
      </Group>

      {hasActiveFilters(filters) && (
        <Link className="text-ui-sm text-blue-brand self-start underline" href="/catalogo">
          {t('limpiarFiltros')}
        </Link>
      )}
    </aside>
  )
}

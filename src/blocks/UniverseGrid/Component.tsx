import { SectionHeading, UniverseTile } from '@/components/p8'
import type { UniverseGridBlock } from '@/payload-types'
import { getTranslations } from 'next-intl/server'
import React from 'react'

/** L'ordre est celui de la maquette, et il ne change pas. */
const UNIVERSES = ['naturaleza', 'aventura', 'cultura', 'origen'] as const

export const UniverseGridComponent: React.FC<UniverseGridBlock> = async ({ heading, subtitle }) => {
  const t = await getTranslations('Universos')

  return (
    <section className="mt-16 w-full" style={{ background: 'var(--surface-accent)' }}>
      <div className="container py-16">
        <SectionHeading
          className="mb-[26px]"
          onAccent
          subtitle={subtitle ?? undefined}
          title={heading}
        />
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {UNIVERSES.map((universe) => (
            <UniverseTile
              description={t(`${universe}Desc`)}
              href={`/catalogo?universo=${universe}`}
              imageLabel={`Foto ${t(universe)}`}
              key={universe}
              name={t(universe)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

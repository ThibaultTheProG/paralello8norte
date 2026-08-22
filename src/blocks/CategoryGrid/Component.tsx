import { CategoryTile, SectionHeading } from '@/components/p8'
import type { CategoryGridBlock } from '@/payload-types'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import React from 'react'

export const CategoryGridComponent: React.FC<CategoryGridBlock> = async ({
  categories,
  heading,
}) => {
  const resolved = (categories ?? []).filter((c) => typeof c === 'object')

  if (!resolved.length) return null

  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('Catalogo')

  // Le compte d'articles est affiché sur chaque tuile : une requête par
  // catégorie, en `limit: 0` pour ne ramener que le total.
  const counts = await Promise.all(
    resolved.map((category) =>
      payload
        .count({
          collection: 'products',
          overrideAccess: false,
          where: {
            and: [{ _status: { equals: 'published' } }, { categories: { contains: category.id } }],
          },
        })
        .then((r) => r.totalDocs),
    ),
  )

  return (
    <section className="container pt-16">
      <SectionHeading className="mb-6" title={heading || ''} />
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {resolved.map((category, i) => (
          <CategoryTile
            count={t('articulos', { count: counts[i] ?? 0 })}
            href={`/catalogo?categoria=${category.slug}`}
            key={category.id}
            name={category.title}
          />
        ))}
      </div>
    </section>
  )
}

import { ProductCard, SectionHeading } from '@/components/p8'
import type { Product, ProductGridBlock } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const ProductGridComponent: React.FC<ProductGridBlock> = async ({
  heading,
  limit,
  mode,
  products,
  universe,
}) => {
  let resolved: Product[] = []

  if (mode === 'manual') {
    resolved = (products ?? []).filter((p): p is Product => typeof p === 'object')
  } else {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'products',
      depth: 1,
      draft: false,
      limit: limit ?? 4,
      overrideAccess: false,
      select: {
        title: true,
        slug: true,
        gallery: true,
        priceInEUR: true,
        universe: true,
      },
      sort: '-createdAt',
      where: {
        and: [
          { _status: { equals: 'published' } },
          ...(universe ? [{ universe: { equals: universe } }] : []),
        ],
      },
    })

    resolved = result.docs as Product[]
  }

  if (!resolved.length) return null

  return (
    <section className="container pt-16">
      <SectionHeading className="mb-6" title={heading} />
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {resolved.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

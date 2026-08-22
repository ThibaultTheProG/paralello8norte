import type { Media, Product } from '@/payload-types'
import type { Metadata } from 'next'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { ProductCard, SectionHeading } from '@/components/p8'
import { BuyColumn } from '@/components/product/BuyColumn'
import { Gallery } from '@/components/product/Gallery'
import { MobileBuyBar } from '@/components/product/MobileBuyBar'
import { Link } from '@/i18n/navigation'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery = product.gallery?.filter((item) => typeof item.image === 'object') || []
  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const canIndex = product._status === 'published'
  const seoImage = metaImage || (gallery.length ? (gallery[0]?.image as Media) : undefined)

  return {
    description: product.meta?.description || '',
    openGraph: seoImage?.url
      ? {
          images: [
            {
              alt: seoImage?.alt,
              height: seoImage.height!,
              url: seoImage?.url,
              width: seoImage.width!,
            },
          ],
        }
      : null,
    robots: {
      follow: canIndex,
      googleBot: { follow: canIndex, index: canIndex },
      index: canIndex,
    },
    title: product.meta?.title || product.title,
  }
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const t = await getTranslations('Producto')
  const tn = await getTranslations('Nav')
  const tu = await getTranslations('Universos')

  const hasStock = product.enableVariants
    ? product.variants?.docs?.some(
        (variant) => typeof variant === 'object' && (variant.inventory ?? 0) > 0,
      )
    : (product.inventory ?? 0) > 0

  const productJsonLd = {
    name: product.title,
    '@context': 'https://schema.org',
    '@type': 'Product',
    description: product.meta?.description ?? undefined,
    offers: {
      '@type': 'Offer',
      availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      // Les prix sont stockés en centimes ; schema.org attend des unités.
      price: typeof product.priceInEUR === 'number' ? product.priceInEUR / 100 : undefined,
      priceCurrency: 'EUR',
    },
  }

  const sameUniverse = await querySameUniverse(product)

  return (
    <React.Fragment>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        type="application/ld+json"
      />

      <nav className="text-meta text-ink-muted container pt-[22px]">
        <Link className="hover:text-blue-brand" href="/">
          {tn('inicio')}
        </Link>
        {' / '}
        <Link className="hover:text-blue-brand" href="/catalogo">
          {tn('catalogo')}
        </Link>
        {product.universe && (
          <>
            {' / '}
            <Link
              className="text-blue-brand font-semibold"
              href={`/catalogo?universo=${product.universe}`}
            >
              {tu(product.universe)}
            </Link>
          </>
        )}
      </nav>

      <div className="container grid items-start gap-12 pt-[22px] pb-16 md:grid-cols-[1.25fr_1fr]">
        <Gallery gallery={product.gallery ?? []} title={product.title} />
        <BuyColumn product={product} />
      </div>

      {product.layout?.length ? <RenderBlocks blocks={product.layout} /> : null}

      {sameUniverse.length > 0 && (
        <section className="container pb-16">
          <SectionHeading className="mb-6" size="sm" title={t('delMismoUniverso')} />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {sameUniverse.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}

      {/* Réserve la hauteur de la barre d'achat mobile pour qu'elle ne recouvre pas le pied de page. */}
      <div aria-hidden className="h-14 md:hidden" />
      <MobileBuyBar product={product} />
    </React.Fragment>
  )
}

const queryProductBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    populate: {
      variants: {
        title: true,
        inventory: true,
        options: true,
        priceInEUR: true,
      },
    },
    where: {
      and: [{ slug: { equals: slug } }, ...(draft ? [] : [{ _status: { equals: 'published' } }])],
    },
  })

  return result.docs?.[0] || null
}

/** « Del mismo universo » : la section de bas de fiche est pilotée par le champ `universe`, pas par une sélection manuelle. */
const querySameUniverse = async (product: Product): Promise<Product[]> => {
  if (!product.universe) return []

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 1,
    draft: false,
    limit: 4,
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
        { universe: { equals: product.universe } },
        { id: { not_equals: product.id } },
      ],
    },
  })

  return result.docs as Product[]
}

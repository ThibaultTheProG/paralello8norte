import type { Product, Variant } from '@/payload-types'

import { AddToCart } from '@/components/Cart/AddToCart'
import { Eyebrow, ReferenceNote } from '@/components/p8'
import { Price } from '@/components/Price'
import { RichText } from '@/components/RichText'
import { getTranslations } from 'next-intl/server'
import React, { Suspense } from 'react'

import { Accordion } from './Accordion'
import { StockIndicator } from './StockIndicator'
import { VariantSelector } from './VariantSelector'

/**
 * Colonne d'achat de la fiche produit — `sticky` face à la galerie empilée.
 *
 * Rendue côté serveur ; seuls le sélecteur de variantes, le prix, l'indicateur
 * de stock et l'ajout au panier sont des îlots client, comme dans le template.
 */
export const BuyColumn: React.FC<{ product: Product }> = async ({ product }) => {
  const t = await getTranslations('Producto')
  const tu = await getTranslations('Universos')

  const variants = (product.variants?.docs ?? []).filter(
    (variant): variant is Variant => typeof variant === 'object',
  )
  const hasVariants = Boolean(product.enableVariants && variants.length)

  // Sans variante, un prix ; avec variantes, la fourchette. Le formatage lui-même
  // appartient au composant `Price`, qui lit la devise active côté client.
  const variantPrices = variants
    .map((variant) => variant.priceInEUR)
    .filter((price): price is number => typeof price === 'number')

  return (
    <div className="flex flex-col md:sticky md:top-6">
      {product.universe && <Eyebrow>{tu(product.universe)}</Eyebrow>}

      <h1 className="text-h1-product text-ink mt-2 mb-1.5 font-extrabold">{product.title}</h1>

      {hasVariants && variantPrices.length ? (
        <Price
          as="span"
          className="text-price font-semibold"
          highestAmount={Math.max(...variantPrices)}
          lowestAmount={Math.min(...variantPrices)}
        />
      ) : (
        typeof product.priceInEUR === 'number' && (
          <Price amount={product.priceInEUR} as="span" className="text-price font-semibold" />
        )
      )}

      <div className="mt-[26px]">
        <Suspense fallback={null}>
          <VariantSelector product={product} />
        </Suspense>
      </div>

      <div className="mt-[22px]">
        <Suspense fallback={null}>
          <AddToCart product={product} />
        </Suspense>
      </div>

      <span className="text-meta text-ink-muted mt-2.5">{t('bajoDemanda')}</span>

      <div className="mt-1">
        <Suspense fallback={null}>
          <StockIndicator product={product} />
        </Suspense>
      </div>

      {product.reference && (
        <div className="mt-[26px]">
          <ReferenceNote title={t('laReferencia')}>{product.reference}</ReferenceNote>
        </div>
      )}

      <div className="border-hairline mt-[26px] border-t">
        {product.description && (
          <Accordion defaultOpen title={t('descripcion')}>
            <RichText data={product.description} enableGutter={false} enableProse={false} />
          </Accordion>
        )}
        {product.composition && (
          <Accordion title={t('composicion')}>{product.composition}</Accordion>
        )}
        <Accordion title={t('enviosDevoluciones')}>{t('enviosTexto')}</Accordion>
      </div>
    </div>
  )
}

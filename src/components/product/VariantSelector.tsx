'use client'

import type { Product, VariantOption, VariantType } from '@/payload-types'

import { ColorSwatch, SizeChip } from '@/components/p8'
import { colorHex } from '@/components/p8/colorHex'
import { axisOf } from '@/components/p8/variantAxes'
import { createUrl } from '@/utilities/createUrl'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

/**
 * Sélecteur de variantes de la fiche produit.
 *
 * La logique est celle du template — l'état de la sélection vit dans les
 * `searchParams`, ce qui permet à la galerie, à l'indicateur de stock et au
 * bouton d'ajout de la lire sans état partagé. Seule la présentation est celle
 * du design system : pastilles rondes pour la couleur, chips 44px pour la
 * taille.
 */
export function VariantSelector({ product }: { product: Product }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('Producto')

  const variants = product.variants?.docs
  const variantTypes = product.variantTypes

  if (!product.enableVariants || !variants?.length || !variantTypes?.length) return null

  return (
    <div className="flex flex-col gap-[22px]">
      {variantTypes.map((type) => {
        if (typeof type !== 'object') return null

        const options = (type as VariantType).options?.docs?.filter(
          (option): option is VariantOption => typeof option === 'object',
        )

        if (!options?.length) return null

        const axis = axisOf(type.name)
        const selectedId = searchParams.get(type.name)
        const selectedLabel = options.find((option) => String(option.id) === selectedId)?.label

        /**
         * Reproduit l'URL telle qu'elle serait si l'option était choisie, et
         * détermine au passage si la variante correspondante est en stock.
         */
        const resolve = (option: VariantOption) => {
          const next = new URLSearchParams(searchParams.toString())
          next.delete('variant')
          next.delete('image')
          next.set(type.name, String(option.id))

          const currentOptions = Array.from(next.values())

          const matchingVariant = variants
            .filter((variant) => typeof variant === 'object')
            .find((variant) =>
              (variant.options ?? []).every((variantOption) =>
                currentOptions.includes(
                  String(typeof variantOption === 'object' ? variantOption.id : variantOption),
                ),
              ),
            )

          if (matchingVariant) next.set('variant', String(matchingVariant.id))

          return {
            available: matchingVariant ? (matchingVariant.inventory ?? 0) > 0 : true,
            href: createUrl(pathname, next),
          }
        }

        const go = (href: string) => router.replace(href, { scroll: false })

        return (
          <div className="flex flex-col gap-[9px]" key={type.id}>
            <div className="flex items-baseline justify-between">
              <span className="text-meta text-ink font-bold">
                {type.label}
                {axis === 'color' && selectedLabel && (
                  <span className="text-ink-muted font-medium">: {selectedLabel}</span>
                )}
              </span>
              {axis === 'size' && (
                // Pas de page « guía de tallas » pour l'instant : le lien est en
                // place mais reste sur la fiche tant que la page n'existe pas.
                <span className="text-meta text-blue-brand border-gold cursor-default border-b font-semibold">
                  {t('guiaDeTallas')}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const { available, href } = resolve(option)
                const selected = String(option.id) === selectedId

                return axis === 'color' ? (
                  <ColorSwatch
                    color={colorHex(option.value.toLowerCase())}
                    key={option.id}
                    name={option.label}
                    onClick={() => go(href)}
                    selected={selected}
                    size={26}
                  />
                ) : (
                  <SizeChip
                    disabled={!available}
                    key={option.id}
                    label={option.label}
                    onClick={() => go(href)}
                    selected={selected}
                    title={available ? option.label : `${option.label} — ${t('sinStock')}`}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

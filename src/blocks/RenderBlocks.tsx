import { AboutSplitComponent } from '@/blocks/AboutSplit/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { CategoryGridComponent } from '@/blocks/CategoryGrid/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { P8HeroComponent } from '@/blocks/P8Hero/Component'
import { ProductGridComponent } from '@/blocks/ProductGrid/Component'
import { UniverseGridComponent } from '@/blocks/UniverseGrid/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ThreeItemGridBlock } from '@/blocks/ThreeItemGrid/Component'
import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'

import type { Page } from '../payload-types'

const blockComponents = {
  aboutSplit: AboutSplitComponent,
  archive: ArchiveBlock,
  banner: BannerBlock,
  carousel: CarouselBlock,
  categoryGrid: CategoryGridComponent,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  p8Hero: P8HeroComponent,
  productGrid: ProductGridComponent,
  universeGrid: UniverseGridComponent,
  threeItemGrid: ThreeItemGridBlock,
}

/**
 * Les blocs P8 gèrent leur propre rythme vertical (le design system impose 64px
 * entre sections, et le hero est pleine largeur) : ils ne doivent pas hériter de
 * la marge `my-16` appliquée aux blocs du template.
 */
const selfSpacedBlocks = new Set([
  'aboutSplit',
  'categoryGrid',
  'p8Hero',
  'productGrid',
  'universeGrid',
])

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className={selfSpacedBlocks.has(blockType) ? undefined : 'my-16'} key={index}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore - weird type mismatch here */}
                  <Block id={toKebabCase(blockName!)} {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utilities/cn'

/**
 * Boutons Paralelo 8 Norte.
 *
 * Règles de marque appliquées ici : rayon 0, aucune ombre, capitales
 * interlettrées, transitions de 120ms sans rebond. Le doré n'apparaît qu'en
 * soulignement de la variante `link`, jamais en aplat.
 *
 * Les noms shadcn (`default`, `outline`, `ghost`…) sont conservés pour ne pas
 * casser les appels existants, mais leur apparence est celle du design system.
 */
const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-2 rounded-none font-extrabold whitespace-nowrap uppercase transition-colors duration-[120ms] outline-none hover:cursor-pointer disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // CTA principal : « AÑADIR AL CARRITO », le bleu de la marque.
        default: 'bg-blue-brand text-white hover:bg-blue-hero',
        destructive: 'bg-destructive text-white hover:opacity-90',
        // Aplat encre : boutons secondaires et champ accolé du boletín.
        invert: 'bg-ink text-white hover:bg-ink-body',
        outline: 'border border-control text-ink hover:border-ink bg-transparent',
        // Sur photo uniquement : blanc sur le hero.
        onHero: 'bg-white text-blue-hero hover:bg-white/90',
        secondary: 'bg-sand text-ink hover:bg-hairline',
        ghost: 'text-ink-muted hover:text-ink tracking-[1.5px] px-4 py-2 text-btn',
        // Lien accentué : soulignement doré de 2px, aucun fond.
        link: 'text-blue-brand border-b-2 border-gold rounded-none px-0 pt-0 pb-1 tracking-[1px]',
        nav: 'text-ink-muted hover:text-ink [&.active]:text-blue-brand p-0 pt-2 pb-6 tracking-[1.5px] text-btn',
      },
      size: {
        clear: '',
        default: 'text-btn px-[34px] py-[15px] tracking-[1.5px]',
        sm: 'text-meta px-[18px] py-[11px] tracking-[1.5px]',
        lg: 'text-ui px-7 py-4 tracking-[1.5px]',
        icon: 'size-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

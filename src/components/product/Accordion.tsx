import React from 'react'

type Props = {
  children: React.ReactNode
  defaultOpen?: boolean
  title: string
}

/**
 * Accordéon de la fiche produit. Bâti sur `<details>` : aucun JavaScript, et
 * le contenu reste dans le document pour le référencement. Les signes `+` / `−`
 * sont dorés — le seul usage de l'or ici, en filet et en signe, jamais en aplat.
 */
export const Accordion: React.FC<Props> = ({ children, defaultOpen = false, title }) => (
  <details className="border-hairline group border-b" open={defaultOpen}>
    <summary className="flex cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden">
      <span className="text-ui-sm text-ink font-extrabold">{title}</span>
      <span aria-hidden className="text-gold">
        <span className="group-open:hidden">+</span>
        <span className="hidden group-open:inline">−</span>
      </span>
    </summary>
    <div className="text-body-sm text-ink-body pb-4">{children}</div>
  </details>
)

import React from 'react'

type Props = {
  children: React.ReactNode
  title?: string
}

/**
 * « la referencia » — l'encart éditorial qui raconte le clin d'œil culturel
 * derrière la pièce. Un seul par fiche produit, deux phrases maximum, toujours
 * en espagnol. C'est l'une des trois seules apparitions autorisées de Permanent
 * Marker sur le site.
 */
export const ReferenceNote: React.FC<Props> = ({ children, title = 'la referencia' }) => (
  <div className="border-gold bg-note border px-5 py-[18px]">
    <div className="text-gold font-marker mb-2 text-[17px]">{title}</div>
    <p className="text-body-sm text-ink-body m-0">{children}</p>
  </div>
)

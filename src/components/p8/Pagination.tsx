import { Link } from '@/i18n/navigation'
import { cn } from '@/utilities/cn'
import React from 'react'

type Props = {
  /** Construit l'URL d'une page en conservant les filtres courants. */
  buildHref: (page: number) => string
  currentPage: number
  totalPages: number
}

const cell = 'text-ui-sm px-3.5 py-2.5'

/** Pagination du catalogue : page active en aplat encre, flèches en caractères Unicode. */
export const Pagination: React.FC<Props> = ({ buildHref, currentPage, totalPages }) => {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav className="mt-11 flex justify-center gap-2">
      {hasPrev ? (
        <Link
          className={cn(cell, 'border-control text-ink hover:border-ink border')}
          href={buildHref(currentPage - 1)}
        >
          ‹
        </Link>
      ) : (
        <span className={cn(cell, 'border-control text-ink-disabled border')}>‹</span>
      )}

      {pages.map((page) =>
        page === currentPage ? (
          <span className={cn(cell, 'bg-ink font-bold text-white')} key={page}>
            {page}
          </span>
        ) : (
          <Link
            className={cn(cell, 'border-control text-ink hover:border-ink border')}
            href={buildHref(page)}
            key={page}
          >
            {page}
          </Link>
        ),
      )}

      {hasNext ? (
        <Link
          className={cn(cell, 'border-control text-ink hover:border-ink border')}
          href={buildHref(currentPage + 1)}
        >
          ›
        </Link>
      ) : (
        <span className={cn(cell, 'border-control text-ink-disabled border')}>›</span>
      )}
    </nav>
  )
}

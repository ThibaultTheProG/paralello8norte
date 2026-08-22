import React from 'react'

/** Squelette de la grille : réserves neutres, sans animation d'apparition. */
export default function Loading() {
  return (
    <div className="container grid gap-10 pt-11 pb-16 md:grid-cols-[var(--sidebar-w)_1fr]">
      <div className="bg-mist h-96 w-full" />
      <div className="grid grid-cols-2 gap-x-[18px] gap-y-[22px] md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div className="bg-mist aspect-[4/5] w-full" key={index} />
        ))}
      </div>
    </div>
  )
}

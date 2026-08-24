import clsx from 'clsx'
import React from 'react'

/**
 * Bandeau d'information : rayon 0, aucune ombre, un filet de 3px à gauche pour
 * porter la couleur. Le doré ne sert qu'à ce trait, jamais en aplat.
 */
export const Message: React.FC<{
  className?: string
  error?: React.ReactNode
  message?: React.ReactNode
  success?: React.ReactNode
  warning?: React.ReactNode
}> = ({ className, error, message, success, warning }) => {
  const messageToRender = message || error || success || warning

  if (!messageToRender) return null

  return (
    <div
      className={clsx(
        'text-ui-sm text-ink-body border-l-[3px] px-4 py-3 font-medium',
        {
          'bg-sand border-success': Boolean(success),
          'bg-note border-gold': Boolean(warning),
          'border-error bg-error/5': Boolean(error),
          'bg-mist border-blue-brand': !success && !warning && !error,
        },
        className,
      )}
    >
      {messageToRender}
    </div>
  )
}

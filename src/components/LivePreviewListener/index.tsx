'use client'
import { getClientSideURL } from '@/utilities/getURL'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

/**
 * Écoute les sauvegardes de l'admin pour rafraîchir l'aperçu en direct.
 *
 * L'origine est dérivée de `window.location` plutôt que de
 * `NEXT_PUBLIC_SERVER_URL` : quand cette variable manque (un déploiement Vercel
 * où elle n'est pas configurée), l'ancienne valeur de repli `''` faisait lever
 * `postMessage` à `Invalid target origin`, ce qui plantait tout le rendu client
 * et affichait « This page couldn't load » sur chaque page.
 */
export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  const serverURL = getClientSideURL()

  if (!serverURL) return null

  return <PayloadLivePreview refresh={router.refresh} serverURL={serverURL} />
}

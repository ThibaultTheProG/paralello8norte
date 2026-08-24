import { canUseDOM } from './canUseDOM'

export const getServerSideURL = () => {
  let url = process.env.NEXT_PUBLIC_SERVER_URL

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  if (!url) {
    url = 'http://localhost:3000'
  }

  return url
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}

/**
 * Résout l'`url` d'un média en URL absolue.
 *
 * Sans stockage distant, Payload renvoie un chemin relatif (`/api/media/file/…`)
 * qu'il faut préfixer. Avec R2, l'`url` est déjà absolue et la préfixer produit
 * `http://localhost:3000https://…`, que `next/image` rejette. Le stockage étant
 * optionnel, les deux formes coexistent selon l'environnement.
 */
export const getMediaURL = (url: null | string | undefined): string => {
  if (!url) return ''

  return /^https?:\/\//.test(url) ? url : `${getServerSideURL()}${url}`
}

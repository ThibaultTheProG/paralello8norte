import type { Plugin } from 'payload'

import { s3Storage } from '@payloadcms/storage-s3'

/**
 * Stockage des médias sur Cloudflare R2 (API compatible S3).
 *
 * Sans R2, les uploads atterrissent dans `public/media`, un répertoire que
 * Vercel remet à zéro à chaque déploiement et interdit en écriture au runtime :
 * la synchro Printify ne peut donc pas y déposer ses mockups en production.
 *
 * Le branchement reste optionnel — si les variables manquent, on retombe sur le
 * disque local, ce qui garde le projet démarrable sans compte Cloudflare.
 */

/**
 * `CLOUDFLARE_R2` est renseignée telle que Cloudflare l'affiche, bucket compris
 * (`https://<account>.r2.cloudflarestorage.com/<bucket>`). Le SDK S3, lui, veut
 * l'endpoint et le bucket séparés.
 */
const parseEndpoint = (value: string): { bucket: string; endpoint: string } | null => {
  try {
    const url = new URL(value)
    const bucket = url.pathname.split('/').filter(Boolean)[0]

    if (!bucket) return null

    return { bucket, endpoint: url.origin }
  } catch {
    return null
  }
}

export const r2StoragePlugins = (): Plugin[] => {
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  const publicURL = process.env.CLOUDFLARE_R2_PUBLIC_URL
  const parsed = process.env.CLOUDFLARE_R2 ? parseEndpoint(process.env.CLOUDFLARE_R2) : null

  if (!parsed || !accessKeyId || !secretAccessKey || !publicURL) return []

  const base = publicURL.replace(/\/$/, '')

  return [
    s3Storage({
      bucket: parsed.bucket,
      collections: {
        media: {
          // Les fichiers sont servis par le domaine public R2 plutôt que
          // proxifiés par `/api/media/file/...` : c'est ce qui met le CDN
          // Cloudflare devant les images. La route Payload reste en place et
          // continue de streamer depuis R2, ce qui garde un repli fonctionnel.
          generateFileURL: ({ filename, prefix }) =>
            prefix ? `${base}/${prefix}/${filename}` : `${base}/${filename}`,
        },
      },
      config: {
        credentials: { accessKeyId, secretAccessKey },
        endpoint: parsed.endpoint,
        // R2 n'expose pas les buckets en virtual-host sur l'endpoint de compte :
        // sans ceci le SDK viserait `<bucket>.<account>.r2.cloudflarestorage.com`.
        forcePathStyle: true,
        region: 'auto',
      },
    }),
  ]
}

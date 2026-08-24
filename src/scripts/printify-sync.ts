import config from '@payload-config'
import { getPayload } from 'payload'

import { syncCatalog } from '@/lib/printify/syncCatalog'

/**
 * Synchronise le catalogue Printify vers Payload : `pnpm printify:sync`.
 *
 * À lancer à la main : la synchro écrit des produits et télécharge des mockups,
 * elle n'a rien à faire dans un cycle de requête.
 */
const run = async () => {
  const payload = await getPayload({ config })

  const report = await syncCatalog(payload)

  payload.logger.info(
    `Printify — ${report.created} créés, ${report.updated} mis à jour, ${report.skipped} ignorés, ` +
      `${report.variantsUpserted} variantes, ${report.imagesImported} mockups importés.`,
  )

  if (report.needsCuration.length) {
    payload.logger.warn(
      `Printify — ${report.needsCuration.length} produit(s) créé(s) en brouillon, à qualifier ` +
        `(univers, catégorie, « la referencia ») avant publication :`,
    )
    for (const product of report.needsCuration) {
      payload.logger.warn(
        `    · ${product.title} → /admin/collections/products?slug=${product.slug}`,
      )
    }
  }

  for (const failure of report.errors) {
    payload.logger.error(
      `Printify — « ${failure.title} » (${failure.printifyId}) : ${failure.message}`,
    )
  }

  process.exit(report.errors.length ? 1 : 0)
}

void run()

import type { CollectionAfterChangeHook } from 'payload'

import { printifyIsConfigured } from '@/lib/printify/client'
import { submitOrderToPrintify } from '@/lib/printify/submitOrder'

/**
 * Dépose la commande chez Printify dès qu'elle est payée.
 *
 * Le plugin crée la commande avec le statut `processing` juste après la
 * confirmation Stripe : c'est le seul signal fiable de paiement encaissé.
 *
 * Le hook ne relaie jamais d'erreur : un échec Printify ne doit pas faire
 * échouer une commande déjà payée. L'échec est consigné sur la commande
 * (`printifyStatus`, `printifyError`) et se rejoue depuis l'admin.
 */
export const submitOrderToPrintifyHook: CollectionAfterChangeHook = async ({
  context,
  doc,
  operation,
  previousDoc,
  req,
}) => {
  if (context?.skipPrintifySubmission) return doc
  if (!printifyIsConfigured()) return doc

  const becamePaid =
    doc?.status === 'processing' && (operation === 'create' || previousDoc?.status !== 'processing')

  if (!becamePaid) return doc
  if (doc?.printifyOrderId) return doc

  try {
    await submitOrderToPrintify(req.payload, doc.id)
  } catch (error) {
    req.payload.logger.error({
      err: error,
      msg: `Printify — le dépôt de la commande ${doc.id} a échoué de façon inattendue.`,
    })
  }

  return doc
}

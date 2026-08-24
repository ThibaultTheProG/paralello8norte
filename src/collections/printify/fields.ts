import type { Field } from 'payload'

/**
 * Champs de liaison Printify.
 *
 * Toutes les collections commerce sont injectées par `ecommercePlugin` : ces
 * champs sont donc ajoutés par surcharge dans `src/plugins/index.ts`, pas dans
 * un fichier de collection. Ils sont tous en lecture seule dans l'admin — c'est
 * la synchro qui les écrit, et une saisie manuelle romprait l'appariement.
 */

const syncedOnly = {
  admin: { position: 'sidebar' as const, readOnly: true },
}

/** Sur `products`. Clé d'appariement de la synchro descendante. */
export const printifyProductFields: Field[] = [
  {
    name: 'printifyProductId',
    type: 'text',
    ...syncedOnly,
    index: true,
    label: 'Printify — ID produit',
  },
  {
    name: 'printifySyncedAt',
    type: 'date',
    ...syncedOnly,
    label: 'Printify — dernière synchro',
  },
]

/** Sur `variants`. `printifyVariantId` est ce qu'attend l'API de commande. */
export const printifyVariantFields: Field[] = [
  {
    name: 'printifyVariantId',
    type: 'number',
    ...syncedOnly,
    index: true,
    label: 'Printify — ID variante',
  },
  {
    name: 'printifySku',
    type: 'text',
    ...syncedOnly,
    label: 'Printify — SKU',
  },
]

/**
 * Sur `variantOptions`.
 *
 * `hex` n'est pas qu'un champ de synchro : les pastilles de couleur ont besoin
 * d'un hex, et le catalogue Printify en apporte bien plus que les cinq couleurs
 * du design system. Il reste modifiable à la main pour les produits saisis dans
 * l'admin — d'où l'absence de `readOnly`.
 */
export const printifyVariantOptionFields: Field[] = [
  {
    name: 'hex',
    type: 'text',
    admin: {
      description: 'Couleur de la pastille, en hexadécimal (#RRGGBB). Axe « color » uniquement.',
    },
    label: 'Hex',
  },
  {
    name: 'printifyOptionId',
    type: 'number',
    ...syncedOnly,
    index: true,
    label: 'Printify — ID option',
  },
]

/** Sur `orders`. Trace de l'envoi en production, y compris les échecs. */
export const printifyOrderFields: Field[] = [
  {
    name: 'printifyOrderId',
    type: 'text',
    ...syncedOnly,
    index: true,
    label: 'Printify — ID commande',
  },
  {
    name: 'printifyStatus',
    type: 'select',
    ...syncedOnly,
    defaultValue: 'pending',
    label: 'Printify — envoi',
    options: [
      { label: 'À envoyer', value: 'pending' },
      { label: 'Envoyée', value: 'submitted' },
      { label: 'Échec', value: 'failed' },
      { label: 'Hors Printify', value: 'skipped' },
    ],
  },
  {
    name: 'printifyError',
    type: 'textarea',
    admin: { readOnly: true },
    label: 'Printify — dernière erreur',
  },
]

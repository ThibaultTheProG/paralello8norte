import type { Address, Category, Product, Transaction, VariantOption } from '@/payload-types'
import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'

import { CATEGORIES, COLORS, PRODUCTS, SIZES } from './catalog'
import { contactFormData } from './contact-form'
import { contactPageData } from './contact-page'
import { homePageData } from './home'
import { richText } from './lexical'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'products',
  'forms',
  'form-submissions',
  'variants',
  'variantOptions',
  'variantTypes',
  'carts',
  'transactions',
  'addresses',
  'orders',
]

const globals: GlobalSlug[] = ['header', 'footer']

/**
 * Les produits sont mis en avant sur la page d'accueil dans cet ordre — ce sont
 * les quatre pièces de la maquette.
 */
const FEATURED_SLUGS = ['hoodie-avila-2765', 'camiseta-no-joda', 'gorra-8-norte', 'tote-conoemadre']

const addressES: Transaction['billingAddress'] = {
  addressLine1: 'Carrer de Provença 214',
  addressLine2: '3r 1a',
  city: 'Barcelona',
  country: 'ES',
  firstName: 'Andreína',
  lastName: 'Pérez',
  phone: '+34600112233',
  postalCode: '08036',
  state: 'Barcelona',
  title: 'Sra.',
}

const addressFR: Transaction['billingAddress'] = {
  addressLine1: '18 rue de la Verrerie',
  city: 'Paris',
  country: 'FR',
  firstName: 'Andreína',
  lastName: 'Pérez',
  phone: '+33600112233',
  postalCode: '75004',
  title: 'Sra.',
}

// Les erreurs de revalidation Next sont normales quand le seed tourne sans serveur.
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')
  payload.logger.info(`— Clearing collections and globals...`)

  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        context: { disableRevalidate: true },
        data: { navItems: [] },
        depth: 0,
      }),
    ),
  )

  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: { email: { equals: 'customer@example.com' } },
  })

  // `ensureFirstUserIsAdmin` promeut le premier compte créé : sans ce garde-fou,
  // le client de démonstration deviendrait administrateur sur une base vide.
  const existingUsers = await payload.find({ collection: 'users', depth: 0, limit: 0 })

  if (existingUsers.totalDocs === 0) {
    payload.logger.info(`— No user found, seeding an admin account...`)

    await payload.create({
      collection: 'users',
      data: {
        name: 'Admin',
        email: 'admin@paralelo8norte.com',
        password: 'password',
        roles: ['admin'],
      },
    })
  }

  payload.logger.info(`— Seeding customer...`)

  const customer = await payload.create({
    collection: 'users',
    data: {
      name: 'Andreína Pérez',
      email: 'customer@example.com',
      password: 'password',
      roles: ['customer'],
    },
  })

  payload.logger.info(`— Seeding categories...`)

  const categories: Category[] = []

  for (const category of CATEGORIES) {
    categories.push(
      await payload.create({
        collection: 'categories',
        data: { slug: category.slug, title: category.title },
      }),
    )
  }

  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]))

  payload.logger.info(`— Seeding variant types and options...`)

  // Les `name` (`talla`, `color`) sont les clés que la fiche produit met dans
  // l'URL et que `src/components/p8/variantAxes.ts` reconnaît. Ne pas les renommer.
  const sizeType = await payload.create({
    collection: 'variantTypes',
    data: { name: 'talla', label: 'Talla' },
  })

  const colorType = await payload.create({
    collection: 'variantTypes',
    data: { name: 'color', label: 'Color' },
  })

  const sizeOptions: VariantOption[] = []

  for (const option of SIZES) {
    sizeOptions.push(
      await payload.create({
        collection: 'variantOptions',
        data: { ...option, variantType: sizeType.id },
      }),
    )
  }

  const colorOptions: VariantOption[] = []

  for (const option of COLORS) {
    colorOptions.push(
      await payload.create({
        collection: 'variantOptions',
        data: { ...option, variantType: colorType.id },
      }),
    )
  }

  const sizeByValue = new Map(sizeOptions.map((option) => [option.value, option]))
  const colorByValue = new Map(colorOptions.map((option) => [option.value, option]))

  payload.logger.info(`— Seeding products and variants...`)

  const products = new Map<string, Product>()

  for (const seed of PRODUCTS) {
    const category = categoryBySlug.get(seed.category)
    const hasVariants = Boolean(seed.colors?.length && seed.sizes?.length)

    const product = await payload.create({
      collection: 'products',
      depth: 0,
      data: {
        _status: 'published',
        categories: category ? [category.id] : [],
        composition: seed.composition,
        description: richText(seed.description),
        enableVariants: hasVariants,
        // Aucune photo n'a été fournie : la galerie reste vide et l'interface
        // retombe sur la réserve #E9F0F4 légendée.
        gallery: [],
        inventory: hasVariants ? undefined : (seed.inventory ?? 0),
        layout: [],
        meta: { description: seed.description, title: `${seed.title} — Paralelo 8 Norte` },
        priceInEUR: seed.price,
        priceInEUREnabled: true,
        reference: seed.reference,
        slug: seed.slug,
        title: seed.title,
        universe: seed.universe,
        ...(hasVariants ? { variantTypes: [colorType.id, sizeType.id] } : {}),
      },
    })

    products.set(seed.slug, product)

    if (!hasVariants) continue

    for (const colorValue of seed.colors!) {
      for (const sizeValue of seed.sizes!) {
        const color = colorByValue.get(colorValue)
        const size = sizeByValue.get(sizeValue)

        if (!color || !size) continue

        await payload.create({
          collection: 'variants',
          depth: 0,
          data: {
            _status: 'published',
            inventory: seed.outOfStock?.includes(sizeValue) ? 0 : 24,
            options: [color.id, size.id],
            priceInEUR: seed.price,
            priceInEUREnabled: true,
            product: product.id,
          },
        })
      }
    }
  }

  payload.logger.info(`— Seeding pages...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData(),
  })

  await payload.create({
    collection: 'pages',
    // Le hook `revalidatePage` appelle `revalidatePath`, qui n'existe pas hors
    // d'une requête Next : le seed lancé en ligne de commande planterait.
    context: { disableRevalidate: true },
    depth: 0,
    data: homePageData({
      categories,
      featured: FEATURED_SLUGS.map((slug) => products.get(slug)).filter(
        (product): product is Product => Boolean(product),
      ),
    }),
  })

  await payload.create({
    collection: 'pages',
    context: { disableRevalidate: true },
    depth: 0,
    data: contactPageData({ contactForm }),
  })

  payload.logger.info(`— Seeding addresses, transactions, carts and orders...`)

  await payload.create({
    collection: 'addresses',
    depth: 0,
    data: { customer: customer.id, ...(addressES as Address) },
  })

  await payload.create({
    collection: 'addresses',
    depth: 0,
    data: { customer: customer.id, ...(addressFR as Address) },
  })

  const succeededTransaction = await payload.create({
    collection: 'transactions',
    data: {
      billingAddress: addressES,
      currency: 'EUR',
      customer: customer.id,
      paymentMethod: 'stripe',
      status: 'succeeded',
      stripe: { customerID: 'cus_123', paymentIntentID: 'pi_123' },
    },
  })

  const hoodie = products.get('hoodie-avila-2765')!
  const gorra = products.get('gorra-8-norte')!

  // Une variante du hoodie, pour que le panier et la commande portent une
  // sélection taille + couleur comme en production.
  const hoodieVariants = await payload.find({
    collection: 'variants',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { product: { equals: hoodie.id } },
  })

  const hoodieVariant = hoodieVariants.docs[0]

  const cartItems = [
    { product: hoodie.id, quantity: 1, ...(hoodieVariant ? { variant: hoodieVariant.id } : {}) },
    { product: gorra.id, quantity: 1 },
  ]

  await payload.create({
    collection: 'carts',
    data: { currency: 'EUR', customer: customer.id, items: cartItems },
  })

  await payload.create({
    collection: 'orders',
    data: {
      amount: 7000,
      currency: 'EUR',
      customer: customer.id,
      items: cartItems,
      shippingAddress: addressES,
      status: 'completed',
      transactions: [succeededTransaction.id],
    },
  })

  await payload.create({
    collection: 'orders',
    data: {
      amount: 2500,
      currency: 'EUR',
      customer: customer.id,
      items: [{ product: gorra.id, quantity: 1 }],
      shippingAddress: addressFR,
      status: 'processing',
      transactions: [succeededTransaction.id],
    },
  })

  payload.logger.info(`— Seeding globals...`)

  // L'en-tête et le pied de page sont fixés par la maquette et rendus depuis
  // next-intl ; ces entrées ne servent qu'au cas où un menu CMS soit rebranché.
  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          { link: { type: 'custom', label: 'Inicio', url: '/' } },
          { link: { type: 'custom', label: 'Catálogo', url: '/catalogo' } },
          { link: { type: 'custom', label: 'Contacto', url: '/contacto' } },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [
          { link: { type: 'custom', label: 'Guía de tallas', url: '/contacto' } },
          { link: { type: 'custom', label: 'Envíos y devoluciones', url: '/contacto' } },
          { link: { type: 'custom', label: 'Buscar mi pedido', url: '/find-order' } },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

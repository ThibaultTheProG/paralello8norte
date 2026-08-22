import type { Form } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'

import { richText } from './lexical'

/** Le slug est `contacto` : c'est la route que vise la navigation de l'en-tête. */
export const contactPageData = ({
  contactForm,
}: {
  contactForm: Form
}): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'contacto',
  _status: 'published',
  hero: { type: 'none' },
  layout: [
    {
      blockType: 'formBlock',
      enableIntro: true,
      form: contactForm,
      introContent: richText(
        'Escríbenos por lo que sea: una talla que no sabes cuál pedir, un pedido que se demoró, o una idea para un diseño. Contestamos de verdad.',
      ),
    },
  ],
  meta: {
    description: 'Escríbenos: tallas, pedidos, ideas. Contestamos de verdad.',
    title: 'Contacto — Paralelo 8 Norte',
  },
  title: 'Contacto',
})

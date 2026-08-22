import type { RequiredDataFromCollectionSlug } from 'payload'

import { richText } from './lexical'

export const contactFormData: () => RequiredDataFromCollectionSlug<'forms'> = () => ({
  confirmationMessage: richText('Listo, recibimos tu mensaje. Te respondemos en cuanto podamos.'),
  confirmationType: 'message',
  emails: [
    {
      emailFrom: '"Paralelo 8 Norte" <hola@paralelo8norte.com>',
      emailTo: '{{email}}',
      message: richText('Gracias por escribirnos. Ya tenemos tu mensaje y te contestamos pronto.'),
      subject: 'Recibimos tu mensaje — Paralelo 8 Norte',
    },
  ],
  fields: [
    {
      name: 'nombre',
      blockName: 'nombre',
      blockType: 'text',
      label: 'Nombre y apellido',
      required: true,
      width: 100,
    },
    {
      name: 'email',
      blockName: 'email',
      blockType: 'email',
      label: 'Correo electrónico',
      required: true,
      width: 100,
    },
    {
      name: 'pedido',
      blockName: 'pedido',
      blockType: 'text',
      label: 'Número de pedido (si aplica)',
      required: false,
      width: 100,
    },
    {
      name: 'mensaje',
      blockName: 'mensaje',
      blockType: 'textarea',
      label: 'Mensaje',
      required: true,
      width: 100,
    },
  ],
  submitButtonLabel: 'ENVIAR',
  title: 'Formulario de contacto',
})

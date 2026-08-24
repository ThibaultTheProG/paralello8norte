'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'

type SendOrderAccessEmailArgs = {
  email: string
  orderID: string
}

type SendOrderAccessEmailResult = {
  success: boolean
  error?: string
}

export async function sendOrderAccessEmail({
  email,
  orderID,
}: SendOrderAccessEmailArgs): Promise<SendOrderAccessEmailResult> {
  const payload = await getPayload({ config: configPromise })

  try {
    const { docs: orders } = await payload.find({
      collection: 'orders',
      where: {
        and: [{ id: { equals: orderID } }, { customerEmail: { equals: email } }],
      },
      limit: 1,
      depth: 0,
    })

    const order = orders[0]

    if (!order || !order.accessToken) {
      return { success: true }
    }

    const serverURL = getServerSideURL()
    const orderURL = `${serverURL}/orders/${order.id}?email=${encodeURIComponent(email)}&accessToken=${order.accessToken}`

    // Copie livrée : espagnol du Venezuela, comme tout le reste du site.
    const emailBody = `
        <h1>Tu pedido en Paralelo 8 Norte</h1>
        <p>Haz clic en el enlace para ver los detalles de tu pedido:</p>
        <p><a href="${orderURL}">Ver el pedido n.º ${order.id}</a></p>
        <p>Si el enlace no funciona, copia esta dirección en tu navegador:</p>
        <p>${orderURL}</p>
        <p>Con ese enlace entras directo a tu pedido, sin cuenta.</p>
      `

    await payload.sendEmail({
      to: email,
      subject: `Tu pedido n.º ${order.id}`,
      html: emailBody,
    })

    return { success: true }
  } catch (err) {
    payload.logger.error({ msg: 'Failed to send order access email', err })
    return { success: true }
  }
}

'use client'

import { ImagePlaceholder, Rule, SectionHeading } from '@/components/p8'
import { Media } from '@/components/Media'
import { Message } from '@/components/Message'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { Suspense, useCallback, useEffect, useState } from 'react'

import { cssVariables } from '@/cssVariables'
import { CheckoutForm } from '@/components/forms/CheckoutForm'
import { useAddresses, useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { CheckoutAddresses } from '@/components/checkout/CheckoutAddresses'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { Address, Product, Variant } from '@/payload-types'
import { Checkbox } from '@/components/ui/checkbox'
import { AddressItem } from '@/components/addresses/AddressItem'
import { FormItem } from '@/components/forms/FormItem'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/LoadingSpinner'

// Le panier renvoyé par le plugin est faiblement typé : on annote les callbacks.
type GalleryItem = NonNullable<Product['gallery']>[number]
type VariantOptionRef = Variant['options'][number]

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const stripe = loadStripe(apiKey)

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { cart } = useCart()
  const t = useTranslations('Checkout')
  const tc = useTranslations('Carrito')
  const [error, setError] = useState<null | string>(null)
  /**
   * State to manage the email input for guest checkout.
   */
  const [email, setEmail] = useState('')
  const [emailEditable, setEmailEditable] = useState(true)
  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null)
  const { initiatePayment } = usePayments()
  const { addresses } = useAddresses()
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>()
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>()
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true)
  const [isProcessingPayment, setProcessingPayment] = useState(false)

  const cartIsEmpty = !cart || !cart.items || !cart.items.length

  const canGoToPayment = Boolean(
    (email || user) && billingAddress && (billingAddressSameAsShipping || shippingAddress),
  )

  // On initial load wait for addresses to be loaded and check to see if we can prefill a default one
  useEffect(() => {
    if (!shippingAddress) {
      if (addresses && addresses.length > 0) {
        const defaultAddress = addresses[0]
        if (defaultAddress) {
          setBillingAddress(defaultAddress)
        }
      }
    }
  }, [addresses])

  useEffect(() => {
    return () => {
      setShippingAddress(undefined)
      setBillingAddress(undefined)
      setBillingAddressSameAsShipping(true)
      setEmail('')
      setEmailEditable(true)
    }
  }, [])

  const initiatePaymentIntent = useCallback(
    async (paymentID: string) => {
      try {
        const paymentData = (await initiatePayment(paymentID, {
          additionalData: {
            ...(email ? { customerEmail: email } : {}),
            billingAddress,
            shippingAddress: billingAddressSameAsShipping ? billingAddress : shippingAddress,
          },
        })) as Record<string, unknown>

        if (paymentData) {
          setPaymentData(paymentData)
        }
      } catch (error) {
        const errorData = error instanceof Error ? JSON.parse(error.message) : {}
        let errorMessage = t('errorPago')

        if (errorData?.cause?.code === 'OutOfStock') {
          errorMessage = t('errorSinStock')
        }

        setError(errorMessage)
        toast.error(errorMessage)
      }
    },
    [billingAddress, billingAddressSameAsShipping, shippingAddress, email, initiatePayment, t],
  )

  if (!stripe) return null

  if (cartIsEmpty && isProcessingPayment) {
    return (
      <div className="w-full py-16 text-center">
        <p className="text-ui text-ink-muted mb-8">{t('procesando')}</p>
        <LoadingSpinner />
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="flex w-full flex-col items-start gap-5 py-16">
        <Rule />
        <p className="text-h2-sm text-ink font-extrabold">{t('carritoVacio')}</p>
        <Button asChild size="sm" variant="outline">
          <Link href="/catalogo">{t('verCatalogo')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="my-10 flex grow flex-col items-stretch justify-stretch gap-12 md:flex-row md:gap-10 lg:gap-16">
      <div className="flex basis-full flex-col justify-stretch gap-8 lg:basis-2/3">
        <SectionHeading size="sm" title={t('contacto')} />

        {user ? (
          <div className="border-hairline text-ui-sm text-ink-body border p-5">
            <p className="text-ink font-semibold">{user.email}</p>
            <p className="mt-1">
              {`${t('noEresTu')} `}
              <Link className="text-blue-brand border-gold border-b-2 font-semibold" href="/logout">
                {t('cerrarSesion')}
              </Link>
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="border-hairline flex flex-wrap items-center gap-3 border p-5">
              <Button asChild size="sm" variant="outline">
                <Link href="/login">{t('iniciarSesion')}</Link>
              </Button>
              <span className="text-ui-sm text-ink-muted">{t('o')}</span>
              <Link
                className="text-ui-sm text-blue-brand border-gold border-b-2 font-semibold"
                href="/create-account"
              >
                {t('crearCuenta')}
              </Link>
            </div>

            <div className="border-hairline border p-5">
              <p className="text-ui-sm text-ink-body mb-4">{t('comoInvitado')}</p>

              <FormItem className="mb-5 max-w-sm">
                <Label htmlFor="email">{t('correo')}</Label>
                <Input
                  disabled={!emailEditable}
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                />
              </FormItem>

              <Button
                disabled={!email || !emailEditable}
                onClick={(e) => {
                  e.preventDefault()
                  setEmailEditable(false)
                }}
                size="sm"
                variant="invert"
              >
                {t('continuarComoInvitado')}
              </Button>
            </div>
          </div>
        )}

        <SectionHeading size="sm" title={t('direccion')} />

        {billingAddress ? (
          <div className="border-hairline border p-5">
            <AddressItem
              actions={
                <Button
                  size="sm"
                  variant={'outline'}
                  disabled={Boolean(paymentData)}
                  onClick={(e) => {
                    e.preventDefault()
                    setBillingAddress(undefined)
                  }}
                >
                  {t('quitar')}
                </Button>
              }
              address={billingAddress}
            />
          </div>
        ) : user ? (
          <CheckoutAddresses heading={t('direccionFacturacion')} setAddress={setBillingAddress} />
        ) : (
          <CreateAddressModal
            disabled={!email || Boolean(emailEditable)}
            callback={(address) => {
              setBillingAddress(address)
            }}
            skipSubmission={true}
          />
        )}

        <div className="flex items-center gap-3">
          <Checkbox
            id="shippingTheSameAsBilling"
            checked={billingAddressSameAsShipping}
            disabled={Boolean(paymentData || (!user && (!email || Boolean(emailEditable))))}
            onCheckedChange={(state) => {
              setBillingAddressSameAsShipping(state as boolean)
            }}
          />
          <Label className="font-medium normal-case" htmlFor="shippingTheSameAsBilling">
            {t('mismaDireccionFacturacion')}
          </Label>
        </div>

        {!billingAddressSameAsShipping && (
          <>
            {shippingAddress ? (
              <div className="border-hairline border p-5">
                <AddressItem
                  actions={
                    <Button
                      size="sm"
                      variant={'outline'}
                      disabled={Boolean(paymentData)}
                      onClick={(e) => {
                        e.preventDefault()
                        setShippingAddress(undefined)
                      }}
                    >
                      {t('quitar')}
                    </Button>
                  }
                  address={shippingAddress}
                />
              </div>
            ) : user ? (
              <CheckoutAddresses
                heading={t('direccionEnvio')}
                description={t('seleccionaDireccionEnvio')}
                setAddress={setShippingAddress}
              />
            ) : (
              <CreateAddressModal
                callback={(address) => {
                  setShippingAddress(address)
                }}
                disabled={!email || Boolean(emailEditable)}
                skipSubmission={true}
              />
            )}
          </>
        )}

        {!paymentData && (
          <Button
            className="self-start"
            disabled={!canGoToPayment}
            onClick={(e) => {
              e.preventDefault()
              void initiatePaymentIntent('stripe')
            }}
          >
            {t('irAlPago')}
          </Button>
        )}

        {!paymentData?.['clientSecret'] && error && (
          <div className="flex flex-col items-start gap-4">
            <Message error={error} />

            <Button
              onClick={(e) => {
                e.preventDefault()
                router.refresh()
              }}
              size="sm"
              variant="outline"
            >
              {t('irAlPago')}
            </Button>
          </div>
        )}

        <Suspense fallback={<React.Fragment />}>
          {paymentData && Boolean(paymentData['clientSecret']) && (
            <div className="flex flex-col gap-8 pb-16">
              <SectionHeading size="sm" title={t('pago')} />
              {error && <Message error={error} />}
              <Elements
                options={{
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      // Rayon 0 et filets de 1px : mêmes règles que le reste du site.
                      borderRadius: '0px',
                      colorPrimary: cssVariables.colors.blue500,
                      gridColumnSpacing: '20px',
                      gridRowSpacing: '20px',
                      colorBackground: cssVariables.colors.white,
                      colorDanger: cssVariables.colors.error,
                      colorDangerText: cssVariables.colors.error,
                      colorIcon: cssVariables.colors.ink700,
                      colorText: cssVariables.colors.ink900,
                      colorTextPlaceholder: cssVariables.colors.ink500,
                      fontFamily: 'Manrope, system-ui, sans-serif',
                      fontSizeBase: '15px',
                      fontWeightBold: '800',
                      fontWeightNormal: '500',
                      spacingUnit: '4px',
                    },
                  },
                  clientSecret: paymentData['clientSecret'] as string,
                }}
                stripe={stripe}
              >
                <div className="flex flex-col gap-8">
                  <CheckoutForm
                    customerEmail={email}
                    billingAddress={billingAddress}
                    setProcessingPayment={setProcessingPayment}
                  />
                  <Button
                    variant="ghost"
                    className="self-start"
                    onClick={() => setPaymentData(null)}
                  >
                    {t('cancelarPago')}
                  </Button>
                </div>
              </Elements>
            </div>
          )}
        </Suspense>
      </div>

      {!cartIsEmpty && (
        <aside className="bg-sand flex h-fit basis-full flex-col gap-6 p-6 lg:basis-1/3 lg:p-8">
          <div>
            <Rule />
            <h2 className="text-h2-sm text-ink m-0 font-extrabold">{t('resumen')}</h2>
          </div>

          {cart?.items?.map((item, index) => {
            if (typeof item.product === 'object' && item.product) {
              const {
                product,
                product: { meta, title, gallery },
                quantity,
                variant,
              } = item

              if (!quantity) return null

              let image = gallery?.[0]?.image || meta?.image
              let price = product?.priceInEUR

              const isVariant = Boolean(variant) && typeof variant === 'object'

              if (isVariant) {
                price = variant?.priceInEUR

                const imageVariant = product.gallery?.find((galleryItem: GalleryItem) => {
                  if (!galleryItem.variantOption) return false
                  const variantOptionID =
                    typeof galleryItem.variantOption === 'object'
                      ? galleryItem.variantOption.id
                      : galleryItem.variantOption

                  const hasMatch = variant?.options?.some((option: VariantOptionRef) => {
                    if (typeof option === 'object') return option.id === variantOptionID
                    else return option === variantOptionID
                  })

                  return hasMatch
                })

                if (imageVariant && typeof imageVariant.image !== 'string') {
                  image = imageVariant.image
                }
              }

              return (
                <div className="flex items-start gap-4" key={index}>
                  <div className="border-hairline relative size-16 shrink-0 border bg-white">
                    {image && typeof image !== 'string' ? (
                      <Media fill imgClassName="object-cover" resource={image} />
                    ) : (
                      <ImagePlaceholder />
                    )}
                  </div>

                  <div className="flex grow items-start justify-between gap-3">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-ui-sm text-ink font-semibold">{title}</p>
                      {variant && typeof variant === 'object' && (
                        <p className="text-meta text-ink-muted">
                          {variant.options
                            ?.map((option: VariantOptionRef) =>
                              typeof option === 'object' ? option.label : null,
                            )
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}
                      <p className="text-meta text-ink-muted">{`× ${quantity}`}</p>
                    </div>

                    {typeof price === 'number' && (
                      <Price
                        amount={price * quantity}
                        className="text-ui-sm text-ink font-extrabold"
                      />
                    )}
                  </div>
                </div>
              )
            }
            return null
          })}

          <div className="border-control border-t pt-5">
            <div className="text-meta text-ink-muted mb-3 flex items-center justify-between">
              <span>{tc('envio')}</span>
              <span>{tc('envioCalculado')}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-meta text-ink font-bold tracking-[1px] uppercase">
                {tc('total')}
              </span>
              <Price className="text-price text-ink font-extrabold" amount={cart.subtotal || 0} />
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}

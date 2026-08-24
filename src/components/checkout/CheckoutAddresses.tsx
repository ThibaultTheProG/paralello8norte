'use client'

import { AddressItem } from '@/components/addresses/AddressItem'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Address } from '@/payload-types'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type Props = {
  selectedAddress?: Address
  setAddress: React.Dispatch<React.SetStateAction<Partial<Address> | undefined>>
  heading?: string
  description?: string
  setSubmit?: React.Dispatch<React.SetStateAction<() => void | Promise<void>>>
}

export const CheckoutAddresses: React.FC<Props> = ({ setAddress, heading, description }) => {
  const { addresses } = useAddresses()
  const t = useTranslations('Checkout')

  if (!addresses || addresses.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-ui-sm text-ink-muted">{t('sinDirecciones')}</p>

        <CreateAddressModal />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <div>
        <h3 className="text-ui text-ink font-extrabold">{heading ?? t('direccionFacturacion')}</h3>
        <p className="text-ui-sm text-ink-muted mt-1">{description ?? t('seleccionaDireccion')}</p>
      </div>
      <AddressesModal setAddress={setAddress} />
    </div>
  )
}

const AddressesModal: React.FC<Props> = ({ setAddress }) => {
  const [open, setOpen] = useState(false)
  const t = useTranslations('Checkout')

  const handleOpenChange = (state: boolean) => {
    setOpen(state)
  }

  const closeModal = () => {
    setOpen(false)
  }
  const { addresses } = useAddresses()

  if (!addresses || addresses.length === 0) {
    return <p className="text-ui-sm text-ink-muted">{t('sinDirecciones')}</p>
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant={'outline'}>
          {t('seleccionarDireccion')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-h2-sm text-ink font-extrabold">
            {t('seleccionarDireccion')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-8">
          <ul className="flex flex-col gap-6">
            {addresses.map((address) => (
              <li
                key={address.id}
                className="border-hairline border-b pb-6 last:border-none last:pb-0"
              >
                <AddressItem
                  address={address}
                  beforeActions={
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        setAddress(address)
                        closeModal()
                      }}
                    >
                      {t('seleccionar')}
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>

          <CreateAddressModal />
        </div>
      </DialogContent>
    </Dialog>
  )
}

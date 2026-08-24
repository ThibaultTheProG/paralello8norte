'use client'

import React from 'react'
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'
import { AddressItem } from '@/components/addresses/AddressItem'
import { useTranslations } from 'next-intl'

export const AddressListing: React.FC = () => {
  const { addresses } = useAddresses()
  const t = useTranslations('Cuenta')

  if (!addresses || addresses.length === 0) {
    return <p className="text-ui-sm text-ink-muted">{t('sinDirecciones')}</p>
  }

  return (
    <ul className="flex flex-col gap-6">
      {addresses.map((address) => (
        <li key={address.id} className="border-hairline border-b pb-6 last:border-none last:pb-0">
          <AddressItem address={address} />
        </li>
      ))}
    </ul>
  )
}

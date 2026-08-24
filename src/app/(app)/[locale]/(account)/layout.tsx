import type { ReactNode } from 'react'

import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { RenderParams } from '@/components/RenderParams'
import { AccountNav } from '@/components/AccountNav'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <div className="container py-12 md:py-16">
      <RenderParams className="mb-8" />

      <div className="flex gap-10 lg:gap-16">
        {user && <AccountNav className="hidden w-52 shrink-0 flex-col items-start md:flex" />}

        <div className="flex grow flex-col gap-10">{children}</div>
      </div>
    </div>
  )
}

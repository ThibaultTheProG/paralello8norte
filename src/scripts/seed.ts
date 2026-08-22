import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { seed } from '@/endpoints/seed'

/**
 * Exécute le seed hors HTTP : `pnpm payload run src/scripts/seed.ts`.
 * La route `POST /next/seed` exige une session admin, ce qui n'est pas toujours
 * disponible en local sur une base fraîchement vidée.
 */
const run = async () => {
  const payload = await getPayload({ config })
  const req = await createLocalReq({}, payload)

  await seed({ payload, req })

  process.exit(0)
}

void run()

import 'server-only'

import { headers } from 'next/headers'
import { cache } from 'react'
import { createCallerFactory } from '@/server/trpc'
import { createTRPCContext } from '@/server/trpc'
import { appRouter } from '@/server/routers'

const createContext = cache(() => {
  const heads = new Headers(headers())
  heads.set('x-trpc-source', 'rsc')
  return createTRPCContext({ headers: heads })
})

const createCaller = createCallerFactory(appRouter)

export const api = createCaller(createContext)

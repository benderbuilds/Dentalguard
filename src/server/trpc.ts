import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/database.types'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let dbUser = null
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('*, practices(*), organizations(*)')
      .eq('id', user.id)
      .single()
    dbUser = data
  }

  return {
    supabase,
    user,
    dbUser,
    headers: opts.headers,
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createCallerFactory = t.createCallerFactory

export const router = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || !ctx.dbUser) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      dbUser: ctx.dbUser,
    },
  })
})

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.dbUser.role !== 'admin' && !ctx.dbUser.is_org_admin) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' })
  }
  return next({ ctx })
})

export const orgAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.dbUser.is_org_admin) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Organization admin access required' })
  }
  return next({ ctx })
})

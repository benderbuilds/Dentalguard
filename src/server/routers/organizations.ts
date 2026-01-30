import { z } from 'zod'
import { router, protectedProcedure, orgAdminProcedure, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const organizationsRouter = router({
  // Get current organization
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.dbUser.organization_id) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'No organization found' })
    }

    const { data, error } = await ctx.supabase
      .from('organizations')
      .select('*, practices(count)')
      .eq('id', ctx.dbUser.organization_id)
      .single()

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
    return data
  }),

  // Update organization settings
  update: orgAdminProcedure
    .input(z.object({
      name: z.string().min(1).optional(),
      billingEmail: z.string().email().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('organizations')
        .update({
          ...(input.name && { name: input.name }),
          ...(input.billingEmail && { billing_email: input.billingEmail }),
        })
        .eq('id', ctx.dbUser.organization_id!)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Create organization during onboarding
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      billingEmail: z.string().email(),
      adminName: z.string().min(1),
      adminEmail: z.string().email(),
      adminPassword: z.string().min(8),
    }))
    .mutation(async ({ ctx, input }) => {
      // Create auth user
      const { data: authData, error: authError } = await ctx.supabase.auth.signUp({
        email: input.adminEmail,
        password: input.adminPassword,
        options: {
          data: { name: input.adminName },
        },
      })

      if (authError) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: authError.message })
      }

      if (!authData.user) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create user' })
      }

      // Create organization with 14-day trial
      const trialEndsAt = new Date()
      trialEndsAt.setDate(trialEndsAt.getDate() + 14)

      const { data: org, error: orgError } = await ctx.supabase
        .from('organizations')
        .insert({
          name: input.name,
          billing_email: input.billingEmail,
          plan_type: 'solo',
          trial_ends_at: trialEndsAt.toISOString(),
          subscription_status: 'trialing',
        })
        .select()
        .single()

      if (orgError) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: orgError.message })
      }

      // Create admin user record
      const { error: userError } = await ctx.supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: input.adminEmail,
          name: input.adminName,
          role: 'admin',
          organization_id: org.id,
          status: 'active',
          is_org_admin: true,
        })

      if (userError) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: userError.message })
      }

      return { organization: org, userId: authData.user.id }
    }),

  // Get subscription status
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from('organizations')
      .select('plan_type, trial_ends_at, subscription_status, stripe_subscription_id')
      .eq('id', ctx.dbUser.organization_id!)
      .single()

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

    const isTrialing = data.subscription_status === 'trialing'
    const trialEndsAt = data.trial_ends_at ? new Date(data.trial_ends_at) : null
    const trialDaysRemaining = trialEndsAt
      ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : 0

    return {
      ...data,
      isTrialing,
      trialDaysRemaining,
    }
  }),
})

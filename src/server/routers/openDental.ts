import { z } from 'zod'
import { router, adminProcedure, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { OpenDentalClient } from '@/lib/open-dental/client'
import { syncOpenDentalData } from '@/lib/open-dental/sync'
import { createAdminClient } from '@/lib/supabase/server'

export const openDentalRouter = router({
  /** Get Open Dental connection status */
  getConfig: protectedProcedure.query(async ({ ctx }) => {
    const practiceId = ctx.dbUser.practice_id
    if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

    const { data } = await ctx.supabase
      .from('open_dental_configs')
      .select('is_active, last_sync_at, sync_error, created_at')
      .eq('practice_id', practiceId)
      .single()

    return data ?? { is_active: false, last_sync_at: null, sync_error: null, created_at: null }
  }),

  /** Save or update Open Dental API key (admin only) */
  saveConfig: adminProcedure
    .input(z.object({ customerApiKey: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const practiceId = ctx.dbUser.practice_id
      if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

      // Use admin client to bypass RLS for service-level operations
      const adminSupabase = createAdminClient()

      const { error } = await adminSupabase
        .from('open_dental_configs')
        .upsert(
          {
            practice_id: practiceId,
            customer_api_key_encrypted: input.customerApiKey,
            is_active: false, // Not active until connection is tested
          },
          { onConflict: 'practice_id' }
        )

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  /** Test the Open Dental connection */
  testConnection: adminProcedure.mutation(async ({ ctx }) => {
    const practiceId = ctx.dbUser.practice_id
    if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

    const adminSupabase = createAdminClient()

    const { data: config } = await adminSupabase
      .from('open_dental_configs')
      .select('customer_api_key_encrypted')
      .eq('practice_id', practiceId)
      .single()

    if (!config) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'No Open Dental configuration found. Please save your API key first.' })
    }

    try {
      const client = new OpenDentalClient(config.customer_api_key_encrypted)
      const connected = await client.testConnection()

      if (connected) {
        await adminSupabase
          .from('open_dental_configs')
          .update({ is_active: true, sync_error: null })
          .eq('practice_id', practiceId)

        return { connected: true, message: 'Successfully connected to Open Dental!' }
      } else {
        await adminSupabase
          .from('open_dental_configs')
          .update({ is_active: false, sync_error: 'Connection test failed' })
          .eq('practice_id', practiceId)

        return { connected: false, message: 'Could not connect. Please verify your API key and ensure the eConnector is running.' }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      await adminSupabase
        .from('open_dental_configs')
        .update({ is_active: false, sync_error: message })
        .eq('practice_id', practiceId)

      return { connected: false, message: `Connection failed: ${message}` }
    }
  }),

  /** Trigger a manual data sync */
  syncNow: adminProcedure.mutation(async ({ ctx }) => {
    const practiceId = ctx.dbUser.practice_id
    if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

    const adminSupabase = createAdminClient()

    const { data: config } = await adminSupabase
      .from('open_dental_configs')
      .select('customer_api_key_encrypted, is_active')
      .eq('practice_id', practiceId)
      .single()

    if (!config?.is_active) {
      throw new TRPCError({ code: 'PRECONDITION_FAILED', message: 'Open Dental is not connected. Please test the connection first.' })
    }

    const result = await syncOpenDentalData(
      adminSupabase,
      practiceId,
      config.customer_api_key_encrypted
    )

    return result
  }),

  /** Get cached providers */
  getProviders: protectedProcedure.query(async ({ ctx }) => {
    const practiceId = ctx.dbUser.practice_id
    if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

    const { data, error } = await ctx.supabase
      .from('od_providers')
      .select('*')
      .eq('practice_id', practiceId)
      .eq('is_hidden', false)
      .order('last_name')

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
    return data ?? []
  }),

  /** Get cached operatories */
  getOperatories: protectedProcedure.query(async ({ ctx }) => {
    const practiceId = ctx.dbUser.practice_id
    if (!practiceId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No practice associated' })

    const { data, error } = await ctx.supabase
      .from('od_operatories')
      .select('*')
      .eq('practice_id', practiceId)
      .eq('is_hidden', false)
      .order('op_name')

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
    return data ?? []
  }),
})

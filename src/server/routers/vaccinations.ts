import { z } from 'zod'
import { router, protectedProcedure, adminProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const vaccinationsRouter = router({
  // Get vaccination record for a user
  getByUserId: protectedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Verify access
      if (input.userId !== ctx.user.id && ctx.dbUser.role === 'employee') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      const { data, error } = await ctx.supabase
        .from('vaccination_records')
        .select('*')
        .eq('user_id', input.userId)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Get all vaccination records for a practice
  listByPractice: adminProcedure
    .input(z.object({ practiceId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('vaccination_records')
        .select('*, users(name, email)')
        .eq('practice_id', input.practiceId)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Update vaccination status
  update: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
      status: z.enum(['vaccinated', 'declined', 'in_progress', 'not_started']),
      doseDates: z.array(z.string()).optional(),
      declinationReason: z.string().optional(),
      documentUrl: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input

      const updateData: any = {
        status: updates.status,
      }

      if (updates.doseDates !== undefined) updateData.dose_dates = updates.doseDates
      if (updates.declinationReason !== undefined) updateData.declination_reason = updates.declinationReason
      if (updates.documentUrl !== undefined) updateData.document_url = updates.documentUrl
      if (updates.notes !== undefined) updateData.notes = updates.notes

      if (updates.status === 'declined') {
        updateData.declination_signed_at = new Date().toISOString()
      }

      const { data, error } = await ctx.supabase
        .from('vaccination_records')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Record a vaccination dose
  addDose: adminProcedure
    .input(z.object({
      recordId: z.string().uuid(),
      doseDate: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get current record
      const { data: record } = await ctx.supabase
        .from('vaccination_records')
        .select('dose_dates, status')
        .eq('id', input.recordId)
        .single()

      if (!record) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Vaccination record not found' })
      }

      const newDoseDates = [...(record.dose_dates || []), input.doseDate]
      const newStatus = newDoseDates.length >= 3 ? 'vaccinated' : 'in_progress'

      const { data, error } = await ctx.supabase
        .from('vaccination_records')
        .update({
          dose_dates: newDoseDates,
          status: newStatus,
        })
        .eq('id', input.recordId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Sign declination form
  signDeclination: protectedProcedure
    .input(z.object({
      recordId: z.string().uuid(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify the record belongs to the user
      const { data: record } = await ctx.supabase
        .from('vaccination_records')
        .select('user_id')
        .eq('id', input.recordId)
        .single()

      if (!record || record.user_id !== ctx.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      const { data, error } = await ctx.supabase
        .from('vaccination_records')
        .update({
          status: 'declined',
          declination_signed_at: new Date().toISOString(),
          declination_reason: input.reason || null,
        })
        .eq('id', input.recordId)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Get vaccination compliance stats
  getStats: adminProcedure
    .input(z.object({ practiceId: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      let query = ctx.supabase
        .from('vaccination_records')
        .select('status, vaccine_type')
        .eq('vaccine_type', 'hep_b')

      if (input.practiceId) {
        query = query.eq('practice_id', input.practiceId)
      }

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      const stats = {
        total: data?.length || 0,
        vaccinated: 0,
        declined: 0,
        inProgress: 0,
        notStarted: 0,
      }

      data?.forEach((record) => {
        switch (record.status) {
          case 'vaccinated':
            stats.vaccinated++
            break
          case 'declined':
            stats.declined++
            break
          case 'in_progress':
            stats.inProgress++
            break
          default:
            stats.notStarted++
        }
      })

      return stats
    }),
})

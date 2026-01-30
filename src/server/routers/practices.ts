import { z } from 'zod'
import { router, protectedProcedure, adminProcedure, orgAdminProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { createAdminClient } from '@/lib/supabase/server'

export const practicesRouter = router({
  // List all practices in the organization
  list: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from('practices')
      .select('*, users(count)')
      .eq('organization_id', ctx.dbUser.organization_id!)
      .order('name')

    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
    return data
  }),

  // Get a single practice
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('practices')
        .select('*')
        .eq('id', input.id)
        .eq('organization_id', ctx.dbUser.organization_id!)
        .single()

      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Practice not found' })
      return data
    }),

  // Assign the current user to a practice (used during onboarding for admin)
  assignSelfToPractice: protectedProcedure
    .input(z.object({ practiceId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify the practice belongs to the user's organization
      const { data: practice, error: practiceError } = await ctx.supabase
        .from('practices')
        .select('id')
        .eq('id', input.practiceId)
        .eq('organization_id', ctx.dbUser.organization_id!)
        .single()

      if (practiceError || !practice) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Practice not found in your organization' })
      }

      const adminSupabase = createAdminClient()
      const { error } = await adminSupabase
        .from('users')
        .update({ practice_id: input.practiceId })
        .eq('id', ctx.user.id)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  // Get current user's practice
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.dbUser.practice_id) {
      return null
    }

    const { data, error } = await ctx.supabase
      .from('practices')
      .select('*')
      .eq('id', ctx.dbUser.practice_id)
      .single()

    if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Practice not found' })
    return data
  }),

  // Create a new practice
  create: orgAdminProcedure
    .input(z.object({
      name: z.string().min(1),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().length(2),
      zipCode: z.string().optional(),
      phone: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('practices')
        .insert({
          organization_id: ctx.dbUser.organization_id!,
          name: input.name,
          address_line1: input.addressLine1 || null,
          address_line2: input.addressLine2 || null,
          city: input.city || null,
          state: input.state,
          zip_code: input.zipCode || null,
          phone: input.phone || null,
        })
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Update a practice
  update: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().length(2).optional(),
      zipCode: z.string().optional(),
      phone: z.string().optional(),
      settings: z.record(z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input

      const updateData: any = {}
      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.addressLine1 !== undefined) updateData.address_line1 = updates.addressLine1
      if (updates.addressLine2 !== undefined) updateData.address_line2 = updates.addressLine2
      if (updates.city !== undefined) updateData.city = updates.city
      if (updates.state !== undefined) updateData.state = updates.state
      if (updates.zipCode !== undefined) updateData.zip_code = updates.zipCode
      if (updates.phone !== undefined) updateData.phone = updates.phone
      if (updates.settings !== undefined) updateData.settings = updates.settings

      const { data, error } = await ctx.supabase
        .from('practices')
        .update(updateData)
        .eq('id', id)
        .eq('organization_id', ctx.dbUser.organization_id!)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  // Delete a practice (only if no employees)
  delete: orgAdminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Check for employees
      const { count } = await ctx.supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('practice_id', input.id)

      if (count && count > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot delete practice with employees. Please reassign or remove all employees first.',
        })
      }

      const { error } = await ctx.supabase
        .from('practices')
        .delete()
        .eq('id', input.id)
        .eq('organization_id', ctx.dbUser.organization_id!)

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  // Get practice compliance overview
  getComplianceOverview: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Get employee count
      const { count: employeeCount } = await ctx.supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('practice_id', input.id)
        .eq('status', 'active')

      // Get training stats
      const { data: assignments } = await ctx.supabase
        .from('training_assignments')
        .select('status, due_date')
        .eq('practice_id', input.id)

      const now = new Date()
      let overdueCount = 0
      let dueSoonCount = 0
      let completedCount = 0

      assignments?.forEach((a) => {
        if (a.status === 'completed') {
          completedCount++
        } else if (new Date(a.due_date) < now) {
          overdueCount++
        } else {
          const daysUntilDue = Math.ceil((new Date(a.due_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          if (daysUntilDue <= 30) {
            dueSoonCount++
          }
        }
      })

      // Get vaccination stats
      const { data: vaccinations } = await ctx.supabase
        .from('vaccination_records')
        .select('status')
        .eq('practice_id', input.id)
        .eq('vaccine_type', 'hep_b')

      const vaccinatedCount = vaccinations?.filter((v) => v.status === 'vaccinated').length || 0
      const declinedCount = vaccinations?.filter((v) => v.status === 'declined').length || 0
      const pendingVaxCount = vaccinations?.filter((v) => !['vaccinated', 'declined'].includes(v.status)).length || 0

      return {
        employeeCount: employeeCount || 0,
        training: {
          total: assignments?.length || 0,
          completed: completedCount,
          overdue: overdueCount,
          dueSoon: dueSoonCount,
        },
        vaccination: {
          total: vaccinations?.length || 0,
          vaccinated: vaccinatedCount,
          declined: declinedCount,
          pending: pendingVaxCount,
        },
      }
    }),
})

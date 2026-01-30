import { z } from 'zod'
import { router, protectedProcedure, adminProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { createAdminClient } from '@/lib/supabase/server'

export const employeesRouter = router({
  list: protectedProcedure
    .input(z.object({
      practiceId: z.string().uuid().optional(),
      includeInactive: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const query = ctx.supabase
        .from('users')
        .select(`
          *,
          training_assignments(
            id,
            module_id,
            due_date,
            status,
            completed_at,
            training_modules(title, type)
          ),
          vaccination_records(*)
        `)
        .eq('organization_id', ctx.dbUser.organization_id!)

      if (input.practiceId) {
        query.eq('practice_id', input.practiceId)
      }

      if (!input.includeInactive) {
        query.neq('status', 'inactive')
      }

      query.order('name')

      const { data, error } = await query

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('users')
        .select(`
          *,
          practices(name, state),
          training_assignments(
            *,
            training_modules(*)
          ),
          vaccination_records(*),
          user_badges(*, badges(*)),
          user_streaks(*)
        `)
        .eq('id', input.id)
        .eq('organization_id', ctx.dbUser.organization_id!)
        .single()

      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Employee not found' })
      return data
    }),

  create: adminProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().min(1),
      role: z.enum(['admin', 'manager', 'employee']),
      practiceId: z.string().uuid(),
      hireDate: z.string().optional(),
      jobTitle: z.string().optional(),
      phone: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const adminSupabase = createAdminClient()

      // First create the auth user with a temporary password or magic link
      let userId: string
      const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
        email: input.email,
        email_confirm: true,
        user_metadata: { name: input.name },
      })

      if (authError) {
        // If user already exists in auth, look them up
        if (authError.message.includes('already been registered')) {
          const { data: { users } } = await adminSupabase.auth.admin.listUsers()
          const existing = users?.find(u => u.email === input.email)
          if (!existing) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'User exists but could not be found' })
          }
          userId = existing.id
        } else {
          throw new TRPCError({ code: 'BAD_REQUEST', message: authError.message })
        }
      } else {
        userId = authUser.user.id
      }

      // Create or update the user record (use admin client to bypass RLS)
      const { data, error } = await adminSupabase
        .from('users')
        .upsert({
          id: userId,
          email: input.email,
          name: input.name,
          role: input.role,
          practice_id: input.practiceId,
          organization_id: ctx.dbUser.organization_id!,
          hire_date: input.hireDate || null,
          job_title: input.jobTitle || null,
          phone: input.phone || null,
          status: 'active',
        }, { onConflict: 'id' })
        .select()
        .single()

      if (error) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      }

      // Create default Hep B vaccination record (ignore if already exists)
      await adminSupabase.from('vaccination_records').upsert({
        user_id: data.id,
        practice_id: input.practiceId,
        vaccine_type: 'hep_b',
        status: 'not_started',
      }, { onConflict: 'user_id,vaccine_type' })

      return data
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      role: z.enum(['admin', 'manager', 'employee']).optional(),
      practiceId: z.string().uuid().optional(),
      hireDate: z.string().optional(),
      jobTitle: z.string().optional(),
      phone: z.string().optional(),
      status: z.enum(['active', 'inactive', 'pending']).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input

      const { data, error } = await ctx.supabase
        .from('users')
        .update({
          ...(updates.name && { name: updates.name }),
          ...(updates.role && { role: updates.role }),
          ...(updates.practiceId && { practice_id: updates.practiceId }),
          ...(updates.hireDate !== undefined && { hire_date: updates.hireDate }),
          ...(updates.jobTitle !== undefined && { job_title: updates.jobTitle }),
          ...(updates.phone !== undefined && { phone: updates.phone }),
          ...(updates.status && { status: updates.status }),
        })
        .eq('id', id)
        .eq('organization_id', ctx.dbUser.organization_id!)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  deactivate: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('users')
        .update({ status: 'inactive' })
        .eq('id', input.id)
        .eq('organization_id', ctx.dbUser.organization_id!)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  reactivate: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('users')
        .update({ status: 'active' })
        .eq('id', input.id)
        .eq('organization_id', ctx.dbUser.organization_id!)
        .select()
        .single()

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  sendReminder: adminProcedure
    .input(z.object({
      userId: z.string().uuid(),
      assignmentId: z.string().uuid().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Queue a reminder email
      const { error } = await ctx.supabase
        .from('email_reminders')
        .insert({
          user_id: input.userId,
          assignment_id: input.assignmentId || null,
          email_type: 'manual_reminder',
          scheduled_for: new Date().toISOString(),
        })

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  getComplianceStats: protectedProcedure
    .input(z.object({ practiceId: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      // Get all employees with their training assignments
      const query = ctx.supabase
        .from('users')
        .select(`
          id,
          training_assignments(status, due_date),
          vaccination_records(status)
        `)
        .eq('organization_id', ctx.dbUser.organization_id!)
        .eq('status', 'active')

      if (input.practiceId) {
        query.eq('practice_id', input.practiceId)
      }

      const { data, error } = await query

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      const now = new Date()
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

      let totalEmployees = data?.length || 0
      let compliantEmployees = 0
      let overdueCount = 0
      let dueSoonCount = 0

      data?.forEach(employee => {
        const assignments = employee.training_assignments || []
        const hasOverdue = assignments.some((a: any) =>
          a.status === 'overdue' || (a.status !== 'completed' && new Date(a.due_date) < now)
        )
        const hasDueSoon = assignments.some((a: any) =>
          a.status !== 'completed' && new Date(a.due_date) <= thirtyDaysFromNow && new Date(a.due_date) >= now
        )

        if (hasOverdue) overdueCount++
        else if (hasDueSoon) dueSoonCount++
        else compliantEmployees++
      })

      return {
        totalEmployees,
        compliantEmployees,
        overdueCount,
        dueSoonCount,
        complianceRate: totalEmployees > 0 ? Math.round((compliantEmployees / totalEmployees) * 100) : 100,
      }
    }),
})
